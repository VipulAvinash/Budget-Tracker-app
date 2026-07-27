import { OAuthStrategy } from "@/utils/constants";
import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";

const useSocialAuth = () => {

    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null)
    const { startSSOFlow } = useSSO()

    const handleSocialAuth = async (strategy: OAuthStrategy) => {

        if (loadingStrategy) return
        setLoadingStrategy(strategy)

        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy })
            if (!createdSessionId || !setActive) {
                Alert.alert("Sign in Incomplete")
                return
            }
            await setActive({ session: createdSessionId })
        }
        catch (error) {
            console.log("Error in Social Auth", error)
            Alert.alert("Error Failed to Sign in . Please Try Again")
        }finally{
            setLoadingStrategy(null)
        }
    }
    return { handleSocialAuth, loadingStrategy }
}


export default useSocialAuth;