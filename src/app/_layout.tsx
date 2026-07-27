import "../../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import * as SystemUI from "expo-system-ui";
import { View } from "react-native";

SystemUI.setBackgroundColorAsync("#11131b");

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <View className="flex-1 bg-magnolia dark:bg-cinder">
        <StatusBar style="auto" />
        <Stack 
          screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: "#11131b" } 
          }} 
        />
      </View>
    </ClerkProvider>
  );
}

