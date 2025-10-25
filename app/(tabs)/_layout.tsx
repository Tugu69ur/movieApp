import { icons } from "@/constants/icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const TabIcon = ({ focused, icon, title }: any) => {
  return (
    <View
      className="flex justify-center items-center mt-2"
      style={{
        backgroundColor: focused ? "#A8B5DB" : "transparent",
        padding: 8,
        width: 60,
        borderRadius: 50,
      }}
    >
      <Image
        source={icon}
        style={{ width: 24, height: 24, tintColor: focused ? "#fff" : "#A8B5DB" }}
      />
      {focused && title ? (
        <Text style={{ color: "#fff", fontSize: 12, marginTop: 2 }}>{title}</Text>
      ) : null}
    </View>
  );
};


export default function Layout() {
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
          backgroundColor: "#fff",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Нүүр",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Translator",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.translator} title="" />
          ),
        }}
      />
            <Tabs.Screen
        name="predict"
        options={{
          title: "Predict",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.play} title="" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
