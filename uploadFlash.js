import { collection, doc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { db } from "./FirebaseConfig.js";

// EXISTING AUTH USER
const USER = {
  uid: "QbKDSxzLppPm4Lga4Dm2fVPPtgH3",
  name: "Tuguldur",
  email: "tugit8833@gmail.com",
};

// ---- FLASHCARDS ----
const flashcards = [
  // Animals
  { title: "Ишиг /ᠢᠰᠢᢉᠡ/", english: "Goat Kid", category: "Animals", image: "goat.png", rating: 4.8 },
  { title: "Шувуу /ᠰᠢᠪᠠᠭ/", english: "Bird", category: "Animals", image: "bird.png", rating: 4.9 },
  { title: "Морь /ᠮᠣᠷᠢ/", english: "Horse", category: "Animals", image: "horse.png", rating: 5.0 },
  { title: "Тэмээ /ᠲᠡᠮᠡᠭ/", english: "Camel", category: "Animals", image: "camel.png", rating: 4.7 },
  { title: "Гахай /ᠭᠠᠬᠠᠢ/", english: "Pig", category: "Animals", image: "pig.png", rating: 4.6 },

  // Nature
  { title: "Чулуу /ᠴᠢᠯᠠᠭᠤ/", english: "Rock / Stone", category: "Nature", image: "rock.png", rating: 4.5 },
  { title: "Уул /ᠠᠭᠤᠯᠠ/", english: "Mountain", category: "Nature", image: "mountain.png", rating: 4.9 },
  { title: "Гол /ᠭᠣᠣᠯ/", english: "River", category: "Nature", image: "river.png", rating: 4.8 },
  { title: "Мод /ᠮᠣᠳᠤ/", english: "Tree", category: "Nature", image: "tree.png", rating: 4.7 },
  { title: "Салхи /ᠰᠠᠯᠬᠢ/", english: "Wind", category: "Nature", image: "wind.png", rating: 4.6 },

  // Technology
  { title: "Зурагт /ᠵᠢᠷᠤᠭᠲᠤ/", english: "Television", category: "Technology", image: "tv.png", rating: 4.7 },
  { title: "Утас /ᠤᠲᠠᠰᠤ/", english: "Phone", category: "Technology", image: "phone.png", rating: 4.6 },
  { title: "Компьютер /ᠺᠣᠮᠫᠢᠶᠦᠲᠤᠷ/", english: "Computer", category: "Technology", image: "computer.png", rating: 4.8 },
  { title: "Камер /ᠺᠠᠮᠧᠷᠠ/", english: "Camera", category: "Technology", image: "camera.png", rating: 4.7 },
  { title: "Чип /ᠴᠢᠫᠤ/", english: "Chip", category: "Technology", image: "chip.png", rating: 4.5 },

  // Food
  { title: "Алим /ᠠᠯᠢᠮᠠ/", english: "Apple", category: "Food", image: "apple.png", rating: 4.5 },
  { title: "Талх /ᠲᠠᠯᠬ᠎ᠠ/", english: "Bread", category: "Food", image: "bread.png", rating: 4.7 },
  { title: "Сүү /ᠰᠦᠦ/", english: "Milk", category: "Food", image: "milk.png", rating: 4.8 },
  { title: "Өндөг /ᠥᠨᠳᠥᠭ/", english: "Egg", category: "Food", image: "egg.png", rating: 4.6 },
  { title: "Мах /ᠮᠠᠬᠤ/", english: "Meat", category: "Food", image: "meat.png", rating: 4.9 },

  // Travel
  { title: "Онгоц /ᠣᠩᠭᠣᠴᠠ/", english: "Airplane", category: "Travel", image: "airplane.png", rating: 4.9 },
  { title: "Галт тэрэг /ᠭᠠᠯᠲᠠᠲᠡᠷᠡᠭ/", english: "Train", category: "Travel", image: "train.png", rating: 4.8 },
  { title: "Автобус /ᠠᠪᠲᠣᠪᠤᠰᠤ/", english: "Bus", category: "Travel", image: "bus.png", rating: 4.6 },
  { title: "Газрын зураг /ᠭᠠᠵᠢᠷᠢᠨ ᠵᠤᠷᠢᠭ/", english: "Map", category: "Travel", image: "map.png", rating: 4.7 },
  { title: "Паспорт /ᠫᠠᠰᠫᠣᠷᠲᠤ/", english: "Passport", category: "Travel", image: "passport.png", rating: 4.8 },

  // Add more 100+ items here...
];

async function seedFlashcards() {
  try {
    console.log("Seeding flashcards...");
    const batch = writeBatch(db);
    const createdFlashcardIDs = [];

    for (const card of flashcards) {
      const q = query(collection(db, "flashcards"), where("title", "==", card.title));
      const snap = await getDocs(q);

      if (!snap.empty) {
        console.log(`Already exists: ${card.title}`);
        continue;
      }

      const cardRef = doc(collection(db, "flashcards"));
      batch.set(cardRef, {
        ...card,
        createdAt: new Date()
      });

      createdFlashcardIDs.push(cardRef.id);
      console.log(`Added: ${card.title}`);
    }

    // Add user favourites (first 3 cards)
    const fav = createdFlashcardIDs.slice(0, 3);

    const userRef = doc(db, "users", USER.uid);
    batch.set(
      userRef,
      {
        name: USER.name,
        email: USER.email,
        favourites: fav,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    await batch.commit();
    console.log("Flashcards + User favourites saved successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}

seedFlashcards();
