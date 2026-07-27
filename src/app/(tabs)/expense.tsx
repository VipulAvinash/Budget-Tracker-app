import SafeAreaView from '@/components/SafeAreaView'
import React from 'react'
import { Text, View } from 'react-native'

const ExpenseScreen = () => {
  return (
    <SafeAreaView className="bg-magnolia dark:bg-cinder flex-1 px-6 pt-6" edges={["top"]}>
      <View className="flex-1">
        <Text className="text-ebony dark:text-athens-gray text-3xl font-extrabold tracking-tight">
          Expenses
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default ExpenseScreen