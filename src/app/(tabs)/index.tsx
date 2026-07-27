import SafeAreaView from '@/components/SafeAreaView'
import { Text, View } from 'react-native'

const HomeScreen = () => {
  return (
    <SafeAreaView className="bg-magnolia dark:bg-cinder flex-1 px-6 pt-6">
      <View className="flex-1">
        <View className="mb-6">
          <Text className="text-ebony dark:text-athens-gray text-3xl font-extrabold tracking-tight">
            Dashboard
          </Text>
          <Text className="text-gun-powder/70 dark:text-gray-suit text-sm mt-1">
            Overview of your financial activity and statistics
          </Text>
        </View>

        <View className="bg-white dark:bg-shark2 rounded-3xl p-6 shadow-sm border border-titan-white/20 dark:border-shark3 items-center justify-center min-h-[160px]">
          <Text className="text-ebony dark:text-athens-gray text-lg font-semibold">
            Stats & Overview
          </Text>
          <Text className="text-gun-powder/60 dark:text-gray-suit/80 text-xs mt-1 text-center">
            Your expense cards and charts will appear here.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen