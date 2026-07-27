import SafeAreaView from "@/components/SafeAreaView"
import { Text, View } from "react-native"

const SignInScreen = () => {

    return (
        <SafeAreaView className="bg-magnolia  dark:bg-cinder flex-1" >
            <View className="px-6 pt-12">
                <Text className="text-center text-5xl font-extrabold tracking-tight text-gun-powder dark:text-athens-gray uppercase font-mono">Expense-App</Text>
                <Text className=" mt-1 text-center text-[14px] text-ebony dark:text-gray-suit " >Sign in to access yoour curated financial dashboard</Text>
            </View>
        </SafeAreaView>
    )

}

export default SignInScreen