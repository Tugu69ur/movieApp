import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { images } from "@/constants/images";
import { Background } from "@react-navigation/elements";

import { MagnifyingGlassIcon } from "react-native-heroicons/outline";

const saved = () => {
  const [showSearch, toggleSearch] = React.useState(false);
  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image
        source={images.weather}
        className="flex-1 absolute w-full h-full z-0"
        resizeMode="cover"
      />
      <SafeAreaView className="flex-1 flex">
        <View className="mx-4 relative z-50" style={{ height: "7%" }}>
          <View
            className="flex-row justify-end items-center rounded-full"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          >
            {showSearch ? (
              <TextInput
                placeholder="Search city"
                placeholderTextColor={"lightgray"}
                className="flex-1 pl-6 h-10 text-base text-white"
              />
            ) : null}

            <TouchableOpacity
              onPress={() => toggleSearch(!showSearch)}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              className="rounded-full p-3 m-1"
            >
              <MagnifyingGlassIcon size={25} color="white" />
            </TouchableOpacity>

            <MagnifyingGlassIcon size="25" color="white" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default saved;

const styles = StyleSheet.create({});
