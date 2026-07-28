import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import SafeAreaView from '@/components/SafeAreaView'
import { useExpenseStore } from '@/store/useExpenseStore'
import {
  formatCurrency,
  formatIndianDate,
  getCategoryBreakdown,
  getCategoryMeta,
  getCurrentMonthTotal,
  getRecentExpenses,
  getYearlyTotal,
} from '@/lib/app.helpers'

const HomeScreen = () => {
  const { userExpenses } = useExpenseStore()

  const currentYear = new Date().getFullYear()
  const currentMonthName = new Date().toLocaleString('en-IN', { month: 'long' })

  const yearlyTotal = getYearlyTotal(userExpenses, currentYear)
  const monthlyTotal = getCurrentMonthTotal(userExpenses, currentYear)
  const categoryBreakdown = getCategoryBreakdown(userExpenses)
  const recentTransactions = getRecentExpenses(userExpenses, 5)

  return (
    <SafeAreaView className="flex-1 bg-magnolia dark:bg-cinder px-5 pt-4" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-extrabold tracking-tight text-ebony dark:text-athens-gray">
            Dashboard
          </Text>
          <Text className="mt-1 text-sm text-gun-powder/70 dark:text-gray-suit">
            Overview of your financial activity and statistics
          </Text>
        </View>

        {/* 1. Stat Cards: Yearly & Monthly Totals */}
        <View className="flex-row gap-3 mb-6">
          {/* Yearly Expense Card */}
          <View className="flex-1 bg-white dark:bg-shark2 p-4 rounded-2xl border border-titan-white/20 dark:border-shark3 shadow-sm">
            <View className="w-10 h-10 rounded-xl bg-purple-500/10 items-center justify-center mb-3">
              <Ionicons name="calendar-outline" size={20} color="#584de8" />
            </View>
            <Text className="text-xs font-medium text-gun-powder/70 dark:text-gray-suit">
              {currentYear} Total
            </Text>
            <Text className="text-xl font-bold mt-1 text-ebony dark:text-athens-gray" numberOfLines={1}>
              {formatCurrency(yearlyTotal)}
            </Text>
          </View>

          {/* Monthly Expense Card */}
          <View className="flex-1 bg-white dark:bg-shark2 p-4 rounded-2xl border border-titan-white/20 dark:border-shark3 shadow-sm">
            <View className="w-10 h-10 rounded-xl bg-emerald-500/10 items-center justify-center mb-3">
              <Ionicons name="trending-down-outline" size={20} color="#10b981" />
            </View>
            <Text className="text-xs font-medium text-gun-powder/70 dark:text-gray-suit">
              {currentMonthName} Expense
            </Text>
            <Text className="text-xl font-bold mt-1 text-ebony dark:text-athens-gray" numberOfLines={1}>
              {formatCurrency(monthlyTotal)}
            </Text>
          </View>
        </View>

        {/* 2. Middle Chart: Category Spending Breakdown */}
        <View className="bg-white dark:bg-shark2 p-5 rounded-3xl border border-titan-white/20 dark:border-shark3 shadow-sm mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-lg font-bold text-ebony dark:text-athens-gray">
                Category Breakdown
              </Text>
              <Text className="text-xs text-gun-powder/60 dark:text-gray-suit/70">
                Spending distribution across categories
              </Text>
            </View>
            <Ionicons name="pie-chart-outline" size={22} color="#584de8" />
          </View>

          {categoryBreakdown.length === 0 ? (
            <View className="py-6 items-center justify-center">
              <Text className="text-sm text-gun-powder/50 dark:text-gray-suit/50">
                No expense data available for breakdown
              </Text>
            </View>
          ) : (
            <View className="gap-3.5">
              {categoryBreakdown.map((item) => (
                <View key={item.category}>
                  <View className="flex-row items-center justify-between mb-1.5">
                    <View className="flex-row items-center gap-2">
                      <View className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <Text className="text-sm font-semibold text-ebony dark:text-athens-gray">
                        {item.category}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xs text-gun-powder/70 dark:text-gray-suit font-medium">
                        {formatCurrency(item.amount)}
                      </Text>
                      <Text className="text-xs font-bold text-ebony dark:text-athens-gray min-w-[32px] text-right">
                        {item.percentage}%
                      </Text>
                    </View>
                  </View>
                  {/* Progress Bar */}
                  <View className="h-2 w-full bg-titan-white/40 dark:bg-shark3 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 3. Recent Transactions */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-ebony dark:text-athens-gray">
              Recent Transactions
            </Text>
            <Text className="text-xs font-semibold text-[#584de8]">
              {recentTransactions.length} items
            </Text>
          </View>

          {recentTransactions.length === 0 ? (
            <View className="bg-white dark:bg-shark2 p-6 rounded-2xl border border-titan-white/20 dark:border-shark3 items-center justify-center">
              <Ionicons name="receipt-outline" size={36} color="#9a96aa" />
              <Text className="mt-2 text-sm text-gun-powder/60 dark:text-gray-suit/80 font-medium text-center">
                No recent transactions yet
              </Text>
            </View>
          ) : (
            <View className="gap-2.5">
              {recentTransactions.map((item) => {
                const meta = getCategoryMeta(item.category)
                return (
                  <View
                    key={item.id}
                    className="flex-row items-center justify-between bg-white dark:bg-shark2 p-3.5 rounded-2xl border border-titan-white/20 dark:border-shark3 shadow-sm"
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-11 h-11 rounded-2xl items-center justify-center"
                        style={{ backgroundColor: meta.bg }}
                      >
                        <Ionicons name={meta.icon as any} size={22} color={meta.color} />
                      </View>
                      <View>
                        <Text className="text-sm font-semibold text-ebony dark:text-athens-gray">
                          {item.title}
                        </Text>
                        <Text className="text-xs text-gun-powder/60 dark:text-gray-suit/70 mt-0.5">
                          {item.category} • {formatIndianDate(item.expenseDate)}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm font-bold text-ebony dark:text-athens-gray">
                      -{formatCurrency(item.amount)}
                    </Text>
                  </View>
                )
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen