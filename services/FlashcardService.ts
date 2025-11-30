import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../FirebaseConfig';

export interface Category {
    id: string;
    name: string;
    image: string;
    description?: string;
    totalCards: number;
}

export interface Flashcard {
    id: string;
    title: string; // Mongolian word
    phonetic?: string;
    image: string;
    rating: number;
    category: string; // Category ID
    english: string; // English translation
    definition?: string;
    steps?: any[];
    desc?: string;
    subtitle?: string;
}

export interface UserData {
    uid: string;
    name: string;
    streak: number;
    lastActiveDate: Timestamp | null;
    favourites: string[]; // Array of Flashcard IDs
    dailyWords: string[]; // Array of Flashcard IDs for today
    dailyWordsDate: Timestamp | null;
}

export const FlashcardService = {
    // --- Flashcards ---

    async getCardById(id: string): Promise<Flashcard | null> {
        const ref = doc(db, "flashcards", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) return null;
        return { id: snap.id, ...snap.data() } as Flashcard;
    }
    ,
    async getFlashcardById(flashcardId: string): Promise<Flashcard | null> {
        try {
            const docRef = doc(db, 'flashcards', flashcardId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) return { id: docSnap.id, ...(docSnap.data() as Omit<Flashcard, 'id'>) };
            return null;
        } catch (err) {
            console.error("Error fetching flashcard:", err);
            return null;
        }
    },

    async getUserData(userId: string): Promise<UserData | null> {
        try {
            const userRef = doc(db, 'users', userId);
            const snap = await getDoc(userRef);
            if (snap.exists()) return snap.data() as UserData;
            return null;
        } catch (err) {
            console.error("Error fetching user data:", err);
            return null;
        }
    },

    async toggleFavorite(userId: string, flashcardId: string, isFavorite: boolean) {
        try {
            const userRef = doc(db, "users", userId);

            if (isFavorite) {
                // ADD to array
                await updateDoc(userRef, {
                    favourites: arrayUnion(flashcardId)
                });
            } else {
                // REMOVE from array
                await updateDoc(userRef, {
                    favourites: arrayRemove(flashcardId)
                });
            }

        } catch (err) {
            console.error("Error toggling favorite:", err);
        }
    },


    async getFavoriteIds(userId: string): Promise<string[]> {
        try {
            const userRef = doc(db, "users", userId);
            const snap = await getDoc(userRef);

            if (!snap.exists()) return [];

            const data = snap.data();
            return data.favourites || [];
        } catch (err) {
            console.error("Error:", err);
            return [];
        }
    }
    ,
    async getFavorites(userId: string): Promise<Flashcard[]> {
        try {
            const userRef = doc(db, 'users', userId);
            const snap = await getDoc(userRef);
            if (!snap.exists()) return [];

            const data = snap.data() as UserData;
            const favIds = data.favourites || []; // <-- get array from user doc
            if (favIds.length === 0) return [];

            const results: Flashcard[] = [];

            // Firestore IN queries only allow 10 IDs at a time
            for (let i = 0; i < favIds.length; i += 10) {
                const batchIds = favIds.slice(i, i + 10);
                const q = query(
                    collection(db, "flashcards"),
                    where("__name__", "in", batchIds)
                );
                const snap = await getDocs(q);
                snap.forEach(docSnap => {
                    results.push({
                        id: docSnap.id,
                        ...(docSnap.data() as Omit<Flashcard, 'id'>)
                    });
                });
            }

            return results;

        } catch (err) {
            console.error("Error fetching favorites:", err);
            return [];
        }
    },
    async updateStreak(userId: string) {
        try {
            const userRef = doc(db, 'users', userId);
            const snap = await getDoc(userRef);

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            if (!snap.exists()) {
                // Create user doc if it doesn't exist (legacy users)
                await setDoc(userRef, {
                    uid: userId,
                    streak: 1,
                    lastActiveDate: Timestamp.fromDate(now),
                    favourites: [],
                    dailyWords: [],
                    dailyWordsDate: null,
                    createdAt: now.toISOString() // Approximate
                });
                return;
            }

            const data = snap.data() as UserData;
            let newStreak = 1;

            if (data.lastActiveDate) {
                const last = data.lastActiveDate.toDate();
                const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
                const diffDays = Math.round((today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24));

                if (diffDays === 1) newStreak = data.streak + 1;
                else if (diffDays > 1) newStreak = 1;
                else newStreak = data.streak; // already updated today
            }

            await updateDoc(userRef, { streak: newStreak, lastActiveDate: Timestamp.fromDate(now) });
        } catch (err) {
            console.error("Error updating streak:", err);
        }
    },

    async getDailyWords(userId: string): Promise<Flashcard[]> {
        try {
            const userRef = doc(db, 'users', userId);
            const snap = await getDoc(userRef);
            if (!snap.exists()) return [];

            const data = snap.data() as UserData;
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            let dailyWordIds = data.dailyWords || [];
            const lastDateDay = data.dailyWordsDate?.toDate();
            const isNewDay = !lastDateDay || new Date(lastDateDay.getFullYear(), lastDateDay.getMonth(), lastDateDay.getDate()).getTime() !== today.getTime();

            if (isNewDay || dailyWordIds.length === 0) {
                const snap = await getDocs(collection(db, 'flashcards'));
                const allIds = snap.docs.map(d => d.id);
                dailyWordIds = allIds.sort(() => Math.random() - 0.5).slice(0, 3);

                await updateDoc(userRef, {
                    dailyWords: dailyWordIds,
                    dailyWordsDate: Timestamp.fromDate(now)
                });
            }

            const result: Flashcard[] = [];
            for (const id of dailyWordIds) {
                const card = await this.getFlashcardById(id);
                if (card) result.push(card);
            }
            return result;
        } catch (err) {
            console.error("Error getting daily words:", err);
            return [];
        }
    },

    getLocalImage(filename: string) {
        const images: Record<string, any> = {
            // Animals
            "camel.png": require("../assets/images/Animals/camel.jpg"),
            "goat.png": require("../assets/images/Animals/goat.jpg"),
            "pig.png": require("../assets/images/Animals/pig.jpg"),
            "horse.png": require("../assets/images/Animals/horse.jpg"),
            "bird.png": require("../assets/images/Animals/shuvuu.jpg"),

            //Nature
            "rock.png": require("../assets/images/Nature/rock.jpg"),
            "mountain.png": require("../assets/images/Nature/mountain.jpg"),
            "river.png": require("../assets/images/Nature/river.jpg"),
            "tree.png": require("../assets/images/Nature/tree.jpg"),
            "wind.png": require("../assets/images/Nature/wind.jpg"),

            //Technology
            "computer.png": require("../assets/images/Technology/computer.jpg"),
            "camera.png": require("../assets/images/Technology/camera.jpg"),
            "chip.png": require("../assets/images/Technology/chip.jpeg"),
            "phone.png": require("../assets/images/Technology/phone.jpg"),
            "tv.png": require("../assets/images/Technology/tv.jpg"),

            //Food
            "apple.png": require("../assets/images/Food/apple.jpg"),
            "bread.png": require("../assets/images/Food/bread.jpg"),
            "egg.png": require("../assets/images/Food/egg.jpg"),
            "meat.png": require("../assets/images/Food/meat.jpeg"),
            "milk.png": require("../assets/images/Food/milk.jpg"),
            //Travel
            "bus.png": require("../assets/images/Travel/bus.jpg"),
            "airplane.png": require("../assets/images/Travel/airplane.jpeg"),
            "map.png": require("../assets/images/Travel/map.jpg"),
            "passport.png": require("../assets/images/Travel/passport.jpg"),
            "train.png": require("../assets/images/Travel/train.jpg"),

        };
        return images[filename] ?? require("../assets/images/placeholder.png");
    }
};

// --- Fetch Mongolian flashcards from a subcollection ---
export const getMongolFlashcards = async (): Promise<Flashcard[]> => {
    try {
        const subColRef = collection(db, "flashcards", "X4PjOKwpjvyRn3C8Vocs", "mzny");
        const snap = await getDocs(subColRef);

        return snap.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Flashcard, 'id'>)
        }));
    } catch (err) {
        console.error("Error fetching Mongolian flashcards:", err);
        return [];
    }
};
export const getMongolFlashcardsByCategory = async (categoryId: string): Promise<Flashcard[]> => {
    try {
        const subColRef = collection(db, "flashcards");

        // Firestore queries allow filtering with where()
        const q = query(subColRef, where('category', '==', categoryId));
        const snap = await getDocs(q);

        return snap.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Flashcard, 'id'>)
        }));
    } catch (err) {
        console.error("Error fetching Mongolian flashcards by category:", err);
        return [];
    }
};
