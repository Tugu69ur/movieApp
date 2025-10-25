import { icons } from "@/constants/icons";
import { DarkTheme, LightTheme } from "@/constants/theme";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/Theme";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const TabIcon = ({ focused, icon, title }: any) => {
  const { theme } = useTheme();
  const currentTheme = theme === "dark" ? DarkTheme : LightTheme;

  return (
    <View
      className="flex justify-center items-center mt-2"
      style={{
        backgroundColor: focused ? currentTheme.accent : "transparent",
        padding: 8,
        width: 60,
        borderRadius: 50,
      }}
    >
      <Image
        source={icon}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? "#fff" : currentTheme.accent,
        }}
      />
      {focused && title ? (
        <Text style={{ color: "#fff", fontSize: 12 }}>{title}</Text>
      ) : null}
    </View>
  );
};

export default function Layout() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentTheme = theme === "dark" ? DarkTheme : LightTheme;
  const [fontsLoaded] = useFonts({
    MongolianBaiti: require("../../assets/fonts/mnglwhiteotf.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: { width: "100%", height: "100%" },
        tabBarStyle: {
          backgroundColor: currentTheme.card,
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",

          borderWidth: 2,
          borderColor: currentTheme.background, 
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("navigation.home"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t("navigation.search"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("navigation.translator"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.translator} title="" />
          ),
        }}
      />
      <Tabs.Screen
        name="predict"
        options={{
          title: t("navigation.predict"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.star} title="" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
