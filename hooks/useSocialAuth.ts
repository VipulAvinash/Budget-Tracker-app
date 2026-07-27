import { OAuthStrategy } from "@/utils/constants";
import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert, Platform } from "react-native";

if (Platform.OS !== "web") {
    WebBrowser.maybeCompleteAuthSession();
}

const useSocialAuth = () => {
    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null)
    const { startSSOFlow } = useSSO()

    const handleSocialAuth = async (strategy: OAuthStrategy) => {
        if (loadingStrategy) return
        setLoadingStrategy(strategy)

        try {
            const redirectUrl = AuthSession.makeRedirectUri()
            const { createdSessionId, setActive } = await startSSOFlow({
                strategy,
                redirectUrl,
            })
            if (!createdSessionId || !setActive) {
                Alert.alert("Sign in Incomplete")
                return
            }
            await setActive({ session: createdSessionId })
        }
        catch (error: any) {
            console.log("Error in Social Auth", error)
            Alert.alert("Sign In Error", error?.errors?.[0]?.longMessage || error?.message || "Failed to Sign in. Please Try Again")
        } finally {
            setLoadingStrategy(null)
        }
    }
    return { handleSocialAuth, loadingStrategy }
}

export default useSocialAuth;