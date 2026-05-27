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
        <View
          style={[
            styles.activeTabBackground,
            isDark && styles.activeTabBackgroundDark,
          ]}
        >
          <Image
            source={icon}
            style={{
              width: 24,
              height: 24,
              tintColor: "#fff",
            }}
          />
          <Text style={styles.activeTabLabel}>{title}</Text>
        </View>
      ) : (
        <View style={styles.inactiveTab}>
          <Image
            source={icon}
            style={{
              width: 24,
              height: 24,
              tintColor: isDark ? "#64748b" : "#94a3b8",
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
          backgroundColor: "transparent",
          height: Platform.OS === "ios" ? 69 : 60,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
          paddingHorizontal: 16,
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0,
        },
        tabBarBackground: () => (
          <View style={styles.tabBarBackground}>
            <View
              style={[
                styles.tabBarContent,
                {
                  backgroundColor: isDark ? "#1e293b" : "#ffffff",
                  borderWidth: 1,
                  borderColor: isDark ? "#334155" : "#f1f5f9",
                },
              ]}
            />
          </View>
        ),
      }}
    >
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
              title="Профайл"
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
    paddingVertical: 4,
  },
  activeTabBackground: {
    backgroundColor: "#6366f1",
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 54,
    ...Platform.select({
      ios: {
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  activeTabBackgroundDark: {
    backgroundColor: "#6366f1",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  inactiveTab: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    opacity: 0.5, // make it look smaller
  },
  tabBarBackground: {
    flex: 1,
    overflow: "hidden",
  },
  tabBarContent: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: Platform.OS === "ios" ? 8 : 4,
    borderRadius: 28,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
});
