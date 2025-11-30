import { icons } from "@/constants/icons";
import { useTheme } from "@/contexts/Theme";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";

const TabIcon = ({ focused, icon, title, isDark }: any) => {
  return (
    <View style={styles.tabIconContainer}>
      {focused ? (
        <View style={styles.activeTabBackground}>
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <Image
                source={icon}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: "#fff",
                }}
              />
            </View>
          </View>
          <Text style={styles.activeTabLabel}>{title}</Text>
        </View>
      ) : (
        <View style={styles.inactiveTab}>
          <Image
            source={icon}
            style={{
              width: 24,
              height: 24,
              tintColor: isDark ? "#6b7280" : "#94a3b8",
            }}
          />
        </View>
      )}
    </View>
  );
};

export default function Layout() {
  const { isDark } = useTheme();
  const [fontsLoaded] = useFonts({
    MongolianBaiti: require("../../assets/fonts/mnglwhiteotf.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#1e293b" : "#fff",
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
          position: "absolute",
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: isDark ? 0.3 : 0.05,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarBackground: () => (
          <View style={styles.tabBarBackground}>
            <View
              style={[
                styles.tabBarContent,
                { backgroundColor: isDark ? "#1e293b" : "#fff" },
              ]}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.home}
              title="Нүүр"
              isDark={isDark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.search}
              title="Хайлт"
              isDark={isDark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="prediction"
        options={{
          title: "Prediction",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.translator}
              title="Орчуулга"
              isDark={isDark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="predict"
        options={{
          title: "Predict",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.play}
              title="Бичлэг"
              isDark={isDark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Translator",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.person}
              title="Орчуулга"
              isDark={isDark}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabBackground: {
    backgroundColor: "#6366f1",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage: {
    width: 20,
    height: 20,
  },
  activeTabLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  inactiveTab: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  tabBarBackground: {
    flex: 1,
    overflow: "hidden",
  },
  tabBarContent: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
