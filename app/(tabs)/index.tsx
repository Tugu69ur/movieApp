import { useRouter } from "expo-router";
import { Heart, Search, SlidersHorizontal } from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [selected, setSelected] = useState("Most Viewed");

  const flashcards = [
    { id: 1, title: "Ишиг /ᠢᠰᠢᢉᠡ/", image: require("../../assets/images/goat.jpg"), rating: 4.8 },
    { id: 2, title: "Чулуу /ᠴᠢᠯᠠᠭᠤ/", image: require("../../assets/images/rock.jpg"), rating: 4.5 },
    { id: 3, title: "Зурагт /ᠵᠢᠷᠤᠭᠲᠤ/", image: require("../../assets/images/tv.jpg"), rating: 4.7 },
  ];

  const flashcards2 = [
    { id: 1, title: "Шувуу /ᠰᠢᠪᠠᠭ/", image: require("../../assets/images/shuvuu.jpg"), rating: 4.9 },
    { id: 2, title: "Нулимс /ᠨᠢᠯᠪᠤᠰᠤ/", image: require("../../assets/images/nulims.jpg"), rating: 4.6 },
    { id: 3, title: "Судар /ᠰᠤᠳᠤᠷ/", image: require("../../assets/images/sudar.jpg"), rating: 4.8 },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 24, paddingTop: 48 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24, alignItems: "center" }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: "600" }}>Hi, JavaGod69killer👋</Text>
          <Text style={{ color: "#999", marginTop: 4 }}>Explore flashcards</Text>
        </View>
        <Image source={{ uri: "https://i.pravatar.cc/60" }} style={{ width: 40, height: 40, borderRadius: 20 }} />
      </View>

      {/* Search bar */}
      <TouchableOpacity onPress={() => router.push("/search")}>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f0f0f0", borderRadius: 24, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 16 }}>
          <Search color="#999" size={20} />
          <Text style={{ flex: 1, marginLeft: 8, color: "#999" }}>Search flashcards</Text>
          <SlidersHorizontal color="#999" size={20} />
        </View>
      </TouchableOpacity>

      {/* Flashcards section */}
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>Таны хадгалсан</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {flashcards.map(card => (
          <TouchableOpacity
            key={card.id}
            onPress={() => router.push(`/movies/${card.id}`)}
            style={{ width: 224, backgroundColor: "#fff", borderRadius: 24, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, marginRight: 16 }}
          >
            <Image source={card.image} style={{ width: "100%", height: 120, borderTopLeftRadius: 24, borderTopRightRadius: 24 }} resizeMode="cover" />
            <View style={{ padding: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>{card.title}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Heart color="#f87171" size={16} />
                <Text style={{ marginLeft: 4, color: "#555" }}>{card.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>Өнөөдрийн үгс</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {flashcards2.map(card => (
          <TouchableOpacity
            key={card.id}
            onPress={() => router.push("/search")}
            style={{ width: 224, backgroundColor: "#fff", borderRadius: 24, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, marginRight: 16 }}
          >
            <Image source={card.image} style={{ width: "100%", height: 120, borderTopLeftRadius: 24, borderTopRightRadius: 24 }} resizeMode="cover" />
            <View style={{ padding: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>{card.title}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Heart color="#f87171" size={16} />
                <Text style={{ marginLeft: 4, color: "#555" }}>{card.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
