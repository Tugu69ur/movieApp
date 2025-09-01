import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-5xl text-accent font-bold">Welcome!</Text>
      <Link href="/onboarding">Get Started</Link>
      <Link href="/movie/69">Movie 69</Link>
    </View>
  );
}
