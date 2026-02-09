import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../FirebaseConfig";

export const seedFlashcards = async () => {
    const flashcards = [
        // Animals
        { title: "Тэмээ/ᠲᠡᠮᠡᢉᠡ/", english: "Camel", category: "Animals", image: "camel.png", rating: 5 },
        { title: "Ямаа/ᠢᠮᠠᠭ᠎ᠠ/", english: "Goat", category: "Animals", image: "goat.png", rating: 5 },
        { title: "Гахай/ᠭᠠᠬᠠᠢ/", english: "Pig", category: "Animals", image: "pig.png", rating: 5 },
        { title: "Морь /ᠮᠣᠷᠢ/", english: "Horse", category: "Animals", image: "horse.png", rating: 5 },
        { title: "Шувуу/ᠰᠢᠪᠠᠭᠤ/", english: "Bird", category: "Animals", image: "bird.png", rating: 5 },
        { title: "Үхэр/ᠦᢈᠡᠷ/", english: "Cow", category: "Animals", image: "cow.png", rating: 5 },
        { title: "Хонь/ᠬᠣᠨᠢ/", english: "Sheep", category: "Animals", image: "sheep.png", rating: 5 },
        { title: "Нохой/ᠨᠣᠬᠠᠢ/", english: "Dog", category: "Animals", image: "dog.png", rating: 5 },
        { title: "Муур/ᠮᠤᠤᠷ/", english: "Cat", category: "Animals", image: "cat.png", rating: 5 },
        { title: "Чоно/ᠴᠢᠨᠤ᠎ᠠ/", english: "Wolf", category: "Animals", image: "wolf.png", rating: 5 },

        // Nature
        { title: "Чулуу/ᠴᠢᠯᠠᠭᠤ/", english: "Rock", category: "Nature", image: "rock.png", rating: 5 },
        { title: "Уул/ᠠᠭᠤᠯᠠ/", english: "Mountain", category: "Nature", image: "mountain.png", rating: 5 },
        { title: "Гол/ᠭᠣᠣᠯ/", english: "River", category: "Nature", image: "river.png", rating: 5 },
        { title: "Мод/ᠮᠣᠳᠤ/", english: "Tree", category: "Nature", image: "tree.png", rating: 5 },
        { title: "Салхи/ᠰᠠᠯᢈᠢ/", english: "Wind", category: "Nature", image: "wind.png", rating: 5 },
        { title: "Төвд/ᠨᠠᠭᠤᠷ/", english: "Lake", category: "Nature", image: "lake.png", rating: 5 },
        { title: "Ой/ᠣᠢ/", english: "Forest", category: "Nature", image: "forest.png", rating: 5 },
        { title: "Цөл/ᠴᠥᠯ/", english: "Desert", category: "Nature", image: "desert.png", rating: 5 },
        { title: "Бороо/ᠪᠣᠷᠤᠭ᠎ᠠ/", english: "Rain", category: "Nature", image: "rain.png", rating: 5 },
        { title: "Цас/ᠴᠠᠰᠤ/", english: "Snow", category: "Nature", image: "snow.png", rating: 5 },

        // Technology
        { title: "Компьютер/ᠻᠣᠮᠫᠶᠦ᠋ᠲ᠋ᠧᠷ/", english: "Computer", category: "Technology", image: "computer.png", rating: 5 },
        { title: "Камер/ᠻᠠᠮᠧᠷ/", english: "Camera", category: "Technology", image: "camera.png", rating: 5 },
        { title: "Чип/ᠴᠢᠫ/", english: "Chip", category: "Technology", image: "chip.png", rating: 5 },
        { title: "Утас/ᠤᠲᠠᠰᠤ/", english: "Phone", category: "Technology", image: "phone.png", rating: 5 },
        { title: "Телевизор/ᠲᠧᠯᠧᠸᠢᠽᠣᠷ/", english: "TV", category: "Technology", image: "tv.png", rating: 5 },
        { title: "Лаптоп/ᠯᠠᠫᠲ᠋ᠣᠫ/", english: "Laptop", category: "Technology", image: "laptop.png", rating: 5 },
        { title: "Таблет/ᠲᠠᠪᠯᠧᠲ/", english: "Tablet", category: "Technology", image: "tablet.png", rating: 5 },
        { title: "Робот/ᠷᠣᠪᠣᠲ/", english: "Robot", category: "Technology", image: "robot.png", rating: 5 },
        { title: "Дрон/ᠳ᠋ᠷᠣᠨ᠋/", english: "Drone", category: "Technology", image: "drone.png", rating: 5 },
        { title: "Компьютерын гар/ᠻᠣᠮᠫᠶᠦ᠋ᠲ᠋ᠧᠷ ᠦ᠋ᠨ ᠭᠠᠷ/", english: "Keyboard", category: "Technology", image: "keyboard.png", rating: 5 },

        // Food
        { title: "Алим/ᠠᠯᠢᠮᠠ/", english: "Apple", category: "Food", image: "apple.png", rating: 5 },
        { title: "Талх/ᠲᠠᠯᠬᠠ/", english: "Bread", category: "Food", image: "bread.png", rating: 5 },
        { title: "Өндөг/ᠥᠨᠳᠡᢉᠡ/", english: "Egg", category: "Food", image: "egg.png", rating: 5 },
        { title: "Мах/ᠮᠢᠬ᠎ᠠ/", english: "Meat", category: "Food", image: "meat.png", rating: 5 },
        { title: "Сүү/ᠰᠦᠨ/", english: "Milk", category: "Food", image: "milk.png", rating: 5 },
        { title: "Бяслаг/ᠪᠢᠰᠢᠯᠠᠭ/", english: "Cheese", category: "Food", image: "cheese.png", rating: 5 },
        { title: "Торт/ᠲᠣᠷᠲ/", english: "Cake", category: "Food", image: "cake.png", rating: 5 },
        { title: "Будаа/ᠪᠤᠳᠠᠭ᠎ᠠ/", english: "Rice", category: "Food", image: "rice.png", rating: 5 },
        { title: "Гоймон/ᠭᠤᠸᠠᠮᠢᠶᠠᠨ/", english: "Noodle", category: "Food", image: "noodle.png", rating: 5 },
        { title: "Загас/ᠵᠢᠭᠠᠰᠤ/", english: "Fish", category: "Food", image: "fish.png", rating: 5 },

        // Travel
        { title: "Автобус/ᠠᠦ᠋ᠲ᠋ᠣᠪᠦ᠋ᠰ/", english: "Bus", category: "Travel", image: "bus.png", rating: 5 },
        { title: "Онгоц/ᠣᠩᠭᠤᠴᠠ/", english: "Airplane", category: "Travel", image: "airplane.png", rating: 5 },
        { title: "Газрын зураг/ᠭᠠᠵᠠᠷ ᠤ᠋ᠨ ᠵᠢᠷᠤᠭ/", english: "Map", category: "Travel", image: "map.png", rating: 5 },
        { title: "Паспорт/ᠫᠠᠰᠫᠣᠷᠲ/", english: "Passport", category: "Travel", image: "passport.png", rating: 5 },
        { title: "Галт тэрэг/ᠭᠠᠯᠲᠤ ᠲᠡᠷᢉᠡ/", english: "Train", category: "Travel", image: "train.png", rating: 5 },
        { title: "Машин/ᠮᠠᠱᠢᠨ᠋/", english: "Car", category: "Travel", image: "car.png", rating: 5 },
        { title: "Усан онгоц/ᠤᠰᠤᠨ ᠣᠩᠭᠤᠴᠠ/", english: "Ship", category: "Travel", image: "ship.png", rating: 5 },
        { title: "Дугуй/ᠳᠤᠭᠤᠢ/", english: "Bicycle", category: "Travel", image: "bicycle.png", rating: 5 },
        { title: "Зочид буудал/ᠵᠣᠴᠢᠳ ᠪᠠᠭᠤᠳᠠᠯ/", english: "Hotel", category: "Travel", image: "hotel.png", rating: 5 },
        { title: "Тасалбар/ᠲᠠᠰᠤᠯᠪᠤᠷᠢ/", english: "Ticket", category: "Travel", image: "ticket.png", rating: 5 },
    ];


    for (const card of flashcards) {
        await addDoc(collection(db, "flashcards"), {
            ...card,
            createdAt: Timestamp.now(),
        });
    }

    console.log("🔥 Flashcards Seeded");
};
