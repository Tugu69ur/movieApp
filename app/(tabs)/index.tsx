import { useRouter } from "expo-router";
import { BookOpen, Heart, Search, SlidersHorizontal, Star } from "lucide-react-native";
import React from "react";
import { Image, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const flashcards = [
    { id: 1, title: "Ишиг /ᠢᠰᠢᢉᠡ/", image: require("../../assets/images/goat.jpg"), rating: 4.8, category: "Animals" },
    { id: 2, title: "Чулуу /ᠴᠢᠯᠠᠭᠤ/", image: require("../../assets/images/rock.jpg"), rating: 4.5, category: "Nature" },
    { id: 3, title: "Зурагт /ᠵᠢᠷᠤᠭᠲᠤ/", image: require("../../assets/images/tv.jpg"), rating: 4.7, category: "Technology" },
  ];

  const flashcards2 = [
    { id: 1, title: "Шувуу /ᠰᠢᠪᠠᠭ/", image: require("../../assets/images/shuvuu.jpg"), rating: 4.9, category: "Animals" },
    { id: 2, title: "Нулимс /ᠨᠢᠯᠪᠤᠰᠤ/", image: require("../../assets/images/nulims.jpg"), rating: 4.6, category: "Nature" },
    { id: 3, title: "Судар /ᠰᠤᠳᠤᠷ/", image: require("../../assets/images/sudar.jpg"), rating: 4.8, category: "Cultural" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={{ 
          backgroundColor: "#fff", 
          paddingTop: Platform.OS === "ios" ? 60 : 20,
          paddingHorizontal: 24,
          paddingBottom: 24,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 28, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 }}>Hi, JavaGod69killer 👋</Text>
              <Text style={{ fontSize: 15, color: "#666", fontWeight: "500" }}>Let&apos;s learn something new today!</Text>
            </View>
            <View style={{ 
              width: 50, 
              height: 50, 
              borderRadius: 25, 
              backgroundColor: "#6366f1",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <Text style={{ fontSize: 20 }}>👤</Text>
            </View>
          </View>

          {/* Search bar */}
          <TouchableOpacity 
            onPress={() => router.push("/search")}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f1f5f9",
              borderRadius: 16,
              paddingVertical: 14,
              paddingHorizontal: 18,
              borderWidth: 1,
              borderColor: "#e2e8f0",
              height: 48
            }}
          >
            <Search color="#64748b" size={22} />
            <Text style={{ flex: 1, marginLeft: 12, color: "#64748b", fontSize: 15, fontWeight: "500" }}>
              Search flashcards...
            </Text>
            <View style={{
              backgroundColor: "#fff",
              padding: 8,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#e2e8f0",
            }}>
              <SlidersHorizontal color="#64748b" size={18} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Saved Flashcards Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 24 }}>
          <View style={{ 
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: 16 
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ 
                backgroundColor: "#e0e7ff", 
                padding: 8, 
                borderRadius: 12 
              }}>
                <BookOpen color="#6366f1" size={20} />
              </View>
              <Text style={{ fontSize: 22, fontWeight: "700", color: "#1a1a1a" }}>
                Таны хадгалсан
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={{ color: "#6366f1", fontWeight: "600", fontSize: 15 }}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {flashcards.map((card, index) => (
              <TouchableOpacity
                key={card.id}
                onPress={() => router.push(`/movies/${card.id}`)}
                activeOpacity={0.95}
                style={{
                  width: 240,
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  marginRight: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 12,
                    },
                    android: {
                      elevation: 4,
                    },
                  }),
                }}
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={card.image}
                    style={{ width: "100%", height: 150 }}
                    resizeMode="cover"
                  />
                  <View style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(10px)",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}>
                    <Star color="#ffd700" size={12} fill="#ffd700" />
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
                      {card.rating}
                    </Text>
                  </View>
                </View>
                
                <View style={{ padding: 16 }}>
                  <Text style={{ fontSize: 17, fontWeight: "700", color: "#1a1a1a", marginBottom: 6 }}>
                    {card.title}
                  </Text>
                  <Text style={{ 
                    fontSize: 13, 
                    color: "#94a3b8", 
                    textTransform: "uppercase", 
                    fontWeight: "600",
                    letterSpacing: 0.5,
                  }}>
                    {card.category}
                  </Text>
                  
                  <View style={{ 
                    flexDirection: "row", 
                    alignItems: "center", 
                    marginTop: 12,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: "#f1f5f9",
                  }}>
                    <View style={{
                      backgroundColor: "#fef2f2",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}>
                      <Heart color="#ef4444" size={14} fill="#ef4444" />
                      <Text style={{ color: "#ef4444", fontSize: 12, fontWeight: "700" }}>
                        Saved
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Today's Words Section */}
        <View style={{ marginTop: 32, paddingHorizontal: 24 ,marginBottom: 48}}>
          <View style={{ 
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: 16 
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ 
                backgroundColor: "#fef3c7", 
                padding: 8, 
                borderRadius: 12 
              }}>
                <BookOpen color="#f59e0b" size={20} />
              </View>
              <Text style={{ fontSize: 22, fontWeight: "700", color: "#1a1a1a" }}>
                Өнөөдрийн үгс
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={{ color: "#6366f1", fontWeight: "600", fontSize: 15 }}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {flashcards2.map((card, index) => (
              <TouchableOpacity
                key={card.id}
                onPress={() => router.push("/search")}
                activeOpacity={0.95}
                style={{
                  width: 240,
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  marginRight: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 12,
                    },
                    android: {
                      elevation: 4,
                    },
                  }),
                }}
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={card.image}
                    style={{ width: "100%", height: 150 }}
                    resizeMode="cover"
                  />
                  <View style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(10px)",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}>
                    <Star color="#ffd700" size={12} fill="#ffd700" />
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
                      {card.rating}
                    </Text>
                  </View>
                </View>
                
                <View style={{ padding: 16 }}>
                  <Text style={{ fontSize: 17, fontWeight: "700", color: "#1a1a1a", marginBottom: 6 }}>
                    {card.title}
                  </Text>
                  <Text style={{ 
                    fontSize: 13, 
                    color: "#94a3b8", 
                    textTransform: "uppercase", 
                    fontWeight: "600",
                    letterSpacing: 0.5,
                  }}>
                    {card.category}
                  </Text>
                  
                  <View style={{ 
                    flexDirection: "row", 
                    alignItems: "center", 
                    marginTop: 12,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: "#f1f5f9",
                  }}>
                    <View style={{
                      backgroundColor: "#fef3c7",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}>
                      <Text style={{ color: "#f59e0b", fontSize: 12, fontWeight: "700" }}>
                        📚 Today
                      </Text>
                    </View>
                  </View>
                </View>
             
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
