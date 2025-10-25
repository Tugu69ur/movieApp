import { DarkTheme, LightTheme } from "@/constants/theme";

import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/Theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Heart, Search, SlidersHorizontal } from "lucide-react-native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  // const { user, signOut } = useAuth();
  // Removed unused selected state

  const currentTheme = theme === "dark" ? DarkTheme : LightTheme;

  const flashcards = [
    {
      id: 1,
      title: "Ишиг /ᠢᠰᠢᢉᠡ/",
      image: require("../../assets/images/goat.jpg"),
      rating: 4.8,
    },
    {
      id: 2,
      title: "Чулуу /ᠴᠢᠯᠠᠭᠤ/",
      image: require("../../assets/images/rock.jpg"),
      rating: 4.5,
    },
    {
      id: 3,
      title: "Зурагт /ᠵᠢᠷᠤᠭᠲᠤ/",
      image: require("../../assets/images/tv.jpg"),
      rating: 4.7,
    },
  ];

  const flashcards2 = [
    {
      id: 1,
      title: "Шувуу /ᠰᠢᠪᠠᠭ/",
      image: require("../../assets/images/shuvuu.jpg"),
      rating: 4.9,
    },
    {
      id: 2,
      title: "Нулимс /ᠨᠢᠯᠪᠤᠰᠤ/",
      image: require("../../assets/images/nulims.jpg"),
      rating: 4.6,
    },
    {
      id: 3,
      title: "Судар /ᠰᠤᠳᠤᠷ/",
      image: require("../../assets/images/sudar.jpg"),
      rating: 4.8,
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentTheme.background,
        padding: 24,
        paddingTop: 48,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 24,
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "600",
              color: currentTheme.text,
            }}
          >
            {t("home.greeting").replace("JavaGod69killer", "User")}
          </Text>
          <Text style={{ color: currentTheme.secondaryText, marginTop: 4 }}>
            {t("home.subtitle")}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity 
            onPress={() => changeLanguage(language === 'en' ? 'mn' : 'en')} 
            style={{ padding: 8}}
          >
            <MaterialCommunityIcons
              name="translate"
              size={24}
              color={currentTheme.accent}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={{ padding: 8 , marginRight: 8}}>
            <MaterialCommunityIcons
              name={theme === "dark" ? "weather-sunny" : "moon-waxing-crescent"}
              size={24}
              color={currentTheme.accent}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 8, marginRight: 8 }}>
            <MaterialCommunityIcons
              name="logout"
              size={24}
              color={currentTheme.accent}
            />
          </TouchableOpacity>
          <Image
            source={{ uri: "https://i.pravatar.cc/60" }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </View>
      </View>

      {/* Search bar */}
      <TouchableOpacity onPress={() => router.push("/search")}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: currentTheme.card,
            borderRadius: 24,
            paddingVertical: 12,
            paddingHorizontal: 16,
            marginBottom: 16,
          }}
        >
          <Search color={currentTheme.secondaryText} size={20} />
          <Text
            style={{
              flex: 1,
              marginLeft: 8,
              color: currentTheme.secondaryText,
            }}
          >
            {t("common.search")}
          </Text>
          <SlidersHorizontal color={currentTheme.secondaryText} size={20} />
        </View>
      </TouchableOpacity>

      {/* Flashcards section */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          marginBottom: 8,
          color: currentTheme.text,
        }}
      >
        {t("home.savedCards")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: 160, marginBottom: 26 }}
      >
        {flashcards.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => router.push(`/movies/${card.id}`)}
            style={{
              width: 224,
              backgroundColor: currentTheme.card,
              borderRadius: 24,
              shadowColor: theme === "dark" ? "#000" : "#000",
              shadowOpacity: theme === "dark" ? 0.3 : 0.1,
              shadowRadius: 8,
              marginRight: 16,
              height: 250,
            }}
          >
            <Image
              source={card.image}
              style={{
                width: "100%",
                height: 170,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              }}
              resizeMode="cover"
            />
            <View style={{ padding: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: currentTheme.text,
                }}
              >
                {card.title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <Heart color={currentTheme.heart} size={16} />
                <Text
                  style={{ marginLeft: 4, color: currentTheme.secondaryText }}
                >
                  {card.rating}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          marginBottom: 8,
          color: currentTheme.text,
        }}
      >
        {t("home.todaysWords")}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{}}>
        {flashcards2.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => router.push("/search")}
            style={{
              width: 224,
              backgroundColor: currentTheme.card,
              borderRadius: 24,
              shadowColor: theme === "dark" ? "#000" : "#000",
              shadowOpacity: theme === "dark" ? 0.3 : 0.1,
              shadowRadius: 8,
              marginRight: 16,
              height: 250,
            }}
          >
            <Image
              source={card.image}
              style={{
                width: "100%",
                height: 170,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              }}
              resizeMode="cover"
            />
            <View style={{ padding: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: currentTheme.text,
                }}
              >
                {card.title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <Heart color={currentTheme.heart} size={16} />
                <Text
                  style={{ marginLeft: 4, color: currentTheme.secondaryText }}
                >
                  {card.rating}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
