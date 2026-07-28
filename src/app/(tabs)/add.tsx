import React, { useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import SafeAreaView from '@/components/SafeAreaView'
import { useExpenseStore } from '@/store/useExpenseStore'
import { ExpenseCategory } from '@/store/useExpenseStore.types'
import {
  getCategoryMeta,
  getTodayIndianDate,
  getYesterdayIndianDate,
} from '@/lib/app.helpers'

const CATEGORIES: ExpenseCategory[] = ['Food', 'Transport', 'Groceries', 'Entertainment', 'Bills']

const AddScreen = () => {
  const router = useRouter()
  const { addExpenses } = useExpenseStore()

  const todayStr = getTodayIndianDate()
  const yesterdayStr = getYesterdayIndianDate()

  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('Food')
  const [expenseDate, setExpenseDate] = useState(todayStr)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async () => {
    setErrorMessage('')
    const numAmount = parseFloat(amount)

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid expense amount.')
      return
    }

    if (!title.trim()) {
      setErrorMessage('Please enter a title for your expense.')
      return
    }

    try {
      setIsSubmitting(true)
      await addExpenses({
        title: title.trim(),
        category,
        amount: numAmount,
        expenseDate: expenseDate || todayStr,
      })

      // Reset Form
      setAmount('')
      setTitle('')
      setCategory('Food')
      setExpenseDate(todayStr)

      // Navigate back to Dashboard
      router.push('/(tabs)')
    } catch (err) {
      setErrorMessage('Failed to create expense. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-magnolia dark:bg-cinder px-5 pt-4" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View className="mb-5">
          <Text className="text-3xl font-extrabold tracking-tight text-ebony dark:text-athens-gray">
            Add Expense
          </Text>
          <Text className="mt-1 text-sm text-gun-powder/70 dark:text-gray-suit">
            Record a new transaction to track your spending
          </Text>
        </View>

        {/* Error Alert Message */}
        {!!errorMessage && (
          <View className="mb-4 bg-red-500/10 border border-red-500/30 p-3 rounded-2xl flex-row items-center gap-2">
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
            <Text className="text-sm font-medium text-red-500 flex-1">{errorMessage}</Text>
          </View>
        )}

        {/* 1. Hero Amount Input Field */}
        <View className="bg-white dark:bg-shark2 p-6 rounded-3xl border border-titan-white/20 dark:border-shark3 shadow-sm mb-5 items-center">
          <Text className="text-xs font-semibold text-gun-powder/60 dark:text-gray-suit/70 uppercase tracking-wider mb-2">
            Enter Amount
          </Text>
          <View className="flex-row items-center justify-center">
            <Text className="text-4xl font-extrabold text-[#584de8] mr-1">₹</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#9a96aa"
              keyboardType="decimal-pad"
              className="text-4xl font-black text-ebony dark:text-athens-gray min-w-[120px] text-center"
            />
          </View>
        </View>

        {/* 2. Expense Title Input */}
        <View className="bg-white dark:bg-shark2 p-5 rounded-3xl border border-titan-white/20 dark:border-shark3 shadow-sm mb-5">
          <Text className="text-xs font-bold text-gun-powder/70 dark:text-gray-suit uppercase tracking-wider mb-2">
            Title / Note
          </Text>
          <View className="flex-row items-center bg-titan-white/30 dark:bg-shark3 px-4 py-3 rounded-2xl border border-titan-white/20 dark:border-shark2">
            <Ionicons name="create-outline" size={20} color="#9a96aa" />
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Dinner, Grocery shopping, Uber..."
              placeholderTextColor="#9a96aa"
              className="flex-1 text-sm font-medium text-ebony dark:text-athens-gray ml-2"
            />
          </View>
        </View>

        {/* 3. Category Selector */}
        <View className="bg-white dark:bg-shark2 p-5 rounded-3xl border border-titan-white/20 dark:border-shark3 shadow-sm mb-5">
          <Text className="text-xs font-bold text-gun-powder/70 dark:text-gray-suit uppercase tracking-wider mb-3">
            Select Category
          </Text>
          <View className="flex-row flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => {
              const meta = getCategoryMeta(cat)
              const isSelected = category === cat
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.7}
                  className={`flex-row items-center gap-2 px-4 py-2.5 rounded-2xl border ${
                    isSelected
                      ? 'bg-[#584de8] border-[#584de8]'
                      : 'bg-titan-white/30 dark:bg-shark3 border-titan-white/20 dark:border-shark2'
                  }`}
                >
                  <Ionicons
                    name={meta.icon as any}
                    size={18}
                    color={isSelected ? '#ffffff' : meta.color}
                  />
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-ebony dark:text-athens-gray'
                    }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* 4. Date Picker Options */}
        <View className="bg-white dark:bg-shark2 p-5 rounded-3xl border border-titan-white/20 dark:border-shark3 shadow-sm mb-6">
          <Text className="text-xs font-bold text-gun-powder/70 dark:text-gray-suit uppercase tracking-wider mb-3">
            Expense Date (DD-MM-YYYY)
          </Text>
          <View className="flex-row gap-2 mb-3">
            <TouchableOpacity
              onPress={() => setExpenseDate(todayStr)}
              className={`flex-1 py-2.5 rounded-xl border items-center justify-center ${
                expenseDate === todayStr
                  ? 'bg-[#584de8]/10 border-[#584de8]'
                  : 'bg-titan-white/20 dark:bg-shark3 border-transparent'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  expenseDate === todayStr ? 'text-[#584de8]' : 'text-gun-powder/70 dark:text-gray-suit'
                }`}
              >
                Today ({todayStr})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setExpenseDate(yesterdayStr)}
              className={`flex-1 py-2.5 rounded-xl border items-center justify-center ${
                expenseDate === yesterdayStr
                  ? 'bg-[#584de8]/10 border-[#584de8]'
                  : 'bg-titan-white/20 dark:bg-shark3 border-transparent'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  expenseDate === yesterdayStr ? 'text-[#584de8]' : 'text-gun-powder/70 dark:text-gray-suit'
                }`}
              >
                Yesterday
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Input Field */}
          <View className="flex-row items-center bg-titan-white/30 dark:bg-shark3 px-4 py-3 rounded-2xl border border-titan-white/20 dark:border-shark2">
            <Ionicons name="calendar-outline" size={20} color="#9a96aa" />
            <TextInput
              value={expenseDate}
              onChangeText={setExpenseDate}
              placeholder="DD-MM-YYYY"
              placeholderTextColor="#9a96aa"
              className="flex-1 text-sm font-medium text-ebony dark:text-athens-gray ml-3"
            />
          </View>
        </View>

        {/* 5. Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
          className="bg-[#584de8] py-4 rounded-3xl items-center justify-center shadow-lg shadow-[#584de8]/30 flex-row gap-2"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Ionicons name="add-circle" size={22} color="#ffffff" />
              <Text className="text-white font-bold text-base">Add Expense</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddScreen