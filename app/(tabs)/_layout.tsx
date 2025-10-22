import { icons } from "@/constants/icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <ImageBackground
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-[15px] justify-center items-center rounded-full overflow-hidden"
      >
        <Image source={icon} tintColor="#151312" className="size-5" />
        <Text className="text-base font-semibold ml-2" >
          {title}
        </Text>
      </ImageBackground>
    );
  }
  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Image source={icon} tintColor="#A8B5DB" className="size-5" />
    </View>
  );
};

export default function Layout() {
  const [fontsLoaded] = useFonts({
    MongolianBaiti: require("../../assets/fonts/mnglwhiteotf.ttf"),
    MongolQagan: require("../../assets/fonts/mnglwritingaat.ttf"),
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
    </Tabs>
  );
}

const styles = StyleSheet.create({});
