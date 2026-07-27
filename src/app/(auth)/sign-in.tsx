import SafeAreaView from "@/components/SafeAreaView"
import useSocialAuth from "@/hooks/useSocialAuth"
import { OAUTH } from "@/utils/constants"
import { Image } from "expo-image"
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native"

const SignInScreen = () => {
    const { handleSocialAuth, loadingStrategy } = useSocialAuth()

    const isGoogleClicked = loadingStrategy === OAUTH.GOOGLE_OAUTH
    const isGithubClicked = loadingStrategy === OAUTH.GITHUB_OAUTH
    const isAppleClicked = loadingStrategy === OAUTH.APPLE_OAUTH
    const isLoading = loadingStrategy !== null

    return (
        <SafeAreaView className="bg-magnolia dark:bg-cinder flex-1 w-full overflow-hidden" edges={["top"]} >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
                showsVerticalScrollIndicator={false}
                className="w-full"
            >
                <View className="px-6 pt-6 items-center w-full">
                    <Text className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-gun-powder dark:text-athens-gray uppercase font-mono w-full">Expense-App</Text>
                    <Text className="mt-1 text-center text-sm text-ebony dark:text-gray-suit w-full px-2">Sign in to access your curated financial dashboard</Text>

                    <View className="items-center justify-center mt-4 mb-2">
                        <Image
                            source={require("@/assets/images/wallet.png")}
                            style={{ width: 80, height: 80 }}
                            contentFit="contain"
                        />
                    </View>
                </View>

                <View className="bg-white dark:bg-shark2 flex-1 rounded-t-[36px] px-6 pt-6 pb-8 mt-4 shadow-xl border-t border-titan-white/20 dark:border-shark3 w-full justify-between">
                    <View className="items-center mb-4 w-full">
                        <Text className="text-center text-2xl font-bold text-ebony dark:text-athens-gray tracking-tight">
                            Welcome Back
                        </Text>
                        <Text className="text-center text-sm font-normal text-gun-powder dark:text-gray-suit leading-relaxed px-4 mt-1">
                            Select a sign-in option below to continue and securely access your account
                        </Text>
                    </View>

                    <View className="w-full space-y-3 gap-3 mb-2">
                        {/* Google Button */}
                        <Pressable
                            disabled={isLoading}
                            onPress={() => handleSocialAuth(OAUTH.GOOGLE_OAUTH)}
                            className={`w-full flex-row items-center justify-center py-3.5 px-4 rounded-2xl border border-titan-white/80 dark:border-shark3 bg-magnolia dark:bg-shark3 shadow-sm active:opacity-80 ${isLoading ? "opacity-60" : ""}`}
                        >
                            {isGoogleClicked ? (
                                <ActivityIndicator color="#584de8" className="mr-2" />
                            ) : (
                                <Image
                                    source={require("@/assets/images/google.png")}
                                    style={{ width: 22, height: 22, marginRight: 10 }}
                                    contentFit="contain"
                                />
                            )}
                            <Text className="text-ebony dark:text-athens-gray font-semibold text-base">
                                {isGoogleClicked ? "Connecting to Google..." : "Continue With Google"}
                            </Text>
                        </Pressable>

                        {/* GitHub Button */}
                        <Pressable
                            disabled={isLoading}
                            onPress={() => handleSocialAuth(OAUTH.GITHUB_OAUTH)}
                            className={`w-full flex-row items-center justify-center py-3.5 px-4 rounded-2xl bg-ebony dark:bg-shark3 border border-ebony dark:border-shark3 shadow-sm active:opacity-80 ${isLoading ? "opacity-60" : ""}`}
                        >
                            {isGithubClicked ? (
                                <ActivityIndicator color="#ffffff" className="mr-2" />
                            ) : (
                                <Image
                                    source={require("@/assets/images/github.png")}
                                    style={{ width: 22, height: 22, marginRight: 10 }}
                                    contentFit="contain"
                                />
                            )}
                            <Text className="text-white dark:text-athens-gray font-semibold text-base">
                                {isGithubClicked ? "Connecting to GitHub..." : "Continue With GitHub"}
                            </Text>
                        </Pressable>

                        {/* Apple Button */}
                        <Pressable
                            disabled={isLoading}
                            onPress={() => handleSocialAuth(OAUTH.APPLE_OAUTH)}
                            className={`w-full flex-row items-center justify-center py-3.5 px-4 rounded-2xl bg-black dark:bg-athens-gray border border-black dark:border-athens-gray shadow-sm active:opacity-80 ${isLoading ? "opacity-60" : ""}`}
                        >
                            {isAppleClicked ? (
                                <ActivityIndicator color="#ffffff" className="mr-2" />
                            ) : (
                                <Image
                                    source={require("@/assets/images/apple.png")}
                                    style={{ width: 22, height: 22, marginRight: 10 }}
                                    contentFit="contain"
                                />
                            )}
                            <Text className="text-white dark:text-ebony font-semibold text-base">
                                {isAppleClicked ? "Connecting to Apple..." : "Continue With Apple"}
                            </Text>
                        </Pressable>
                    </View>

                    <Text className="text-center text-xs font-normal text-gun-powder/70 dark:text-gray-suit/70 mt-4 leading-relaxed px-4">
                        By continuing, you agree to our terms and conditions
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignInScreen