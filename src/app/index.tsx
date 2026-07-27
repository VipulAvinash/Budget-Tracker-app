import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import SafeAreaView from "@/components/SafeAreaView";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-magnolia dark:bg-cinder">
      <View>
        <Text className="text-xl font-bold text-gun-powder dark:text-athens-gray">Home Screen</Text>
      </View>
    </SafeAreaView>
  );
}
