import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import SafeAreaView from '@/components/SafeAreaView'
import { useExpenseStore } from '@/store/useExpenseStore'
import { ExpenseCategory, ExpenseItem } from '@/store/useExpenseStore.types'
import {
  formatCurrency,
  formatIndianDate,
  getCategoryMeta,
  parseIndianDate,
} from '@/lib/app.helpers'

const CATEGORIES: ('All' | ExpenseCategory)[] = [
  'All',
  'Food',
  'Transport',
  'Groceries',
  'Entertainment',
  'Bills',
]
const EDIT_CATEGORIES: ExpenseCategory[] = ['Food', 'Transport', 'Groceries', 'Entertainment', 'Bills']

const ExpenseScreen = () => {
  const { userExpenses, deleteExpenses, updateExpenses } = useExpenseStore()

  const [selectedCategory, setSelectedCategory] = useState<'All' | ExpenseCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editCategory, setEditCategory] = useState<ExpenseCategory>('Food')
  const [editDate, setEditDate] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleOpenEdit = (item: ExpenseItem) => {
    setEditingItem(item)
    setEditTitle(item.title)
    setEditAmount(String(item.amount))
    setEditCategory(item.category)
    setEditDate(formatIndianDate(item.expenseDate))
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return
    const numAmount = parseFloat(editAmount)
    if (!editTitle.trim() || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid title and amount.')
      return
    }

    try {
      setIsUpdating(true)
      await updateExpenses(editingItem.id, {
        title: editTitle.trim(),
        category: editCategory,
        amount: numAmount,
        expenseDate: editDate,
      })
      setEditingItem(null)
    } catch (err) {
      Alert.alert('Error', 'Failed to update expense item.')
    } finally {
      setIsUpdating(false)
    }
  }

  // Filter & Search Logic
  const filteredExpenses = userExpenses
    .filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase().trim())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => parseIndianDate(b.expenseDate).getTime() - parseIndianDate(a.expenseDate).getTime())

  const filteredTotal = filteredExpenses.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  )

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Delete Expense', `Are you sure you want to delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteExpenses(id),
      },
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-magnolia dark:bg-cinder px-5 pt-4" edges={['top']}>
      {/* Header */}
      <View className="mb-4">
        <Text className="text-3xl font-extrabold tracking-tight text-ebony dark:text-athens-gray">
          All Transactions
        </Text>
        <Text className="mt-1 text-sm text-gun-powder/70 dark:text-gray-suit">
          Filter, edit, and manage all your logged expenses
        </Text>
      </View>

      {/* Search Input */}
      <View className="mb-4 flex-row items-center bg-white dark:bg-shark2 px-4 py-3 rounded-2xl border border-titan-white/20 dark:border-shark3 shadow-sm">
        <Ionicons name="search-outline" size={20} color="#9a96aa" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search transactions..."
          placeholderTextColor="#9a96aa"
          className="flex-1 text-sm font-medium text-ebony dark:text-athens-gray ml-2"
        />
        {!!searchQuery && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#9a96aa" />
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Category Filters */}
      <View className="mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
                className={`px-4 py-2.5 rounded-2xl border ${
                  isSelected
                    ? 'bg-[#584de8] border-[#584de8]'
                    : 'bg-white dark:bg-shark2 border-titan-white/20 dark:border-shark3'
                }`}
              >
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
        </ScrollView>
      </View>

      {/* Summary Banner */}
      <View className="bg-white dark:bg-shark2 px-4 py-3 rounded-2xl border border-titan-white/20 dark:border-shark3 shadow-sm mb-4 flex-row items-center justify-between">
        <Text className="text-xs font-semibold text-gun-powder/70 dark:text-gray-suit">
          Showing {filteredExpenses.length} {filteredExpenses.length === 1 ? 'transaction' : 'transactions'}
        </Text>
        <Text className="text-sm font-extrabold text-[#584de8]">
          Total: {formatCurrency(filteredTotal)}
        </Text>
      </View>

      {/* Transactions List */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 110 }}
        ListEmptyComponent={
          <View className="bg-white dark:bg-shark2 p-8 rounded-3xl border border-titan-white/20 dark:border-shark3 items-center justify-center mt-4">
            <Ionicons name="funnel-outline" size={40} color="#9a96aa" />
            <Text className="mt-3 text-base font-bold text-ebony dark:text-athens-gray text-center">
              No transactions found
            </Text>
            <Text className="mt-1 text-xs text-gun-powder/60 dark:text-gray-suit/80 text-center">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your category filter or search query.'
                : 'Log a new expense from the Add tab.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const meta = getCategoryMeta(item.category)
          return (
            <View className="flex-row items-center justify-between bg-white dark:bg-shark2 p-4 rounded-2xl border border-titan-white/20 dark:border-shark3 shadow-sm mb-3">
              <View className="flex-row items-center gap-3 flex-1 mr-2">
                <View
                  className="w-11 h-11 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: meta.bg }}
                >
                  <Ionicons name={meta.icon as any} size={22} color={meta.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-ebony dark:text-athens-gray" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text className="text-xs text-gun-powder/60 dark:text-gray-suit/70 mt-0.5">
                    {item.category} • {formatIndianDate(item.expenseDate)}
                  </Text>
                </View>
              </View>

              <View className="items-end flex-row items-center gap-2">
                <Text className="text-sm font-extrabold text-ebony dark:text-athens-gray mr-1">
                  -{formatCurrency(item.amount)}
                </Text>

                {/* Edit Button */}
                <TouchableOpacity
                  onPress={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg bg-purple-500/10"
                >
                  <Ionicons name="create-outline" size={18} color="#584de8" />
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                  onPress={() => handleDelete(item.id, item.title)}
                  className="p-1.5 rounded-lg bg-red-500/10"
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          )
        }}
      />

      {/* Edit Transaction Modal */}
      <Modal
        visible={!!editingItem}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingItem(null)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white dark:bg-shark2 p-6 rounded-t-3xl border-t border-titan-white/20 dark:border-shark3">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-extrabold text-ebony dark:text-athens-gray">
                Edit Expense
              </Text>
              <TouchableOpacity onPress={() => setEditingItem(null)}>
                <Ionicons name="close" size={24} color="#9a96aa" />
              </TouchableOpacity>
            </View>

            {/* Edit Amount */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gun-powder/70 dark:text-gray-suit uppercase mb-1">
                Amount (₹)
              </Text>
              <TextInput
                value={editAmount}
                onChangeText={setEditAmount}
                keyboardType="decimal-pad"
                className="bg-titan-white/30 dark:bg-shark3 p-3.5 rounded-2xl text-sm font-bold text-ebony dark:text-athens-gray border border-titan-white/20 dark:border-shark2"
              />
            </View>

            {/* Edit Title */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gun-powder/70 dark:text-gray-suit uppercase mb-1">
                Title
              </Text>
              <TextInput
                value={editTitle}
                onChangeText={setEditTitle}
                className="bg-titan-white/30 dark:bg-shark3 p-3.5 rounded-2xl text-sm font-bold text-ebony dark:text-athens-gray border border-titan-white/20 dark:border-shark2"
              />
            </View>

            {/* Edit Category */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gun-powder/70 dark:text-gray-suit uppercase mb-2">
                Category
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {EDIT_CATEGORIES.map((cat) => {
                  const isSel = editCategory === cat
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setEditCategory(cat)}
                      className={`px-3 py-2 rounded-xl border ${
                        isSel ? 'bg-[#584de8] border-[#584de8]' : 'bg-titan-white/30 dark:bg-shark3 border-transparent'
                      }`}
                    >
                      <Text className={`text-xs font-bold ${isSel ? 'text-white' : 'text-ebony dark:text-athens-gray'}`}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            {/* Edit Date */}
            <View className="mb-6">
              <Text className="text-xs font-bold text-gun-powder/70 dark:text-gray-suit uppercase mb-1">
                Date (DD-MM-YYYY)
              </Text>
              <TextInput
                value={editDate}
                onChangeText={setEditDate}
                className="bg-titan-white/30 dark:bg-shark3 p-3.5 rounded-2xl text-sm font-bold text-ebony dark:text-athens-gray border border-titan-white/20 dark:border-shark2"
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSaveEdit}
              disabled={isUpdating}
              className="bg-[#584de8] py-3.5 rounded-2xl items-center justify-center flex-row gap-2"
            >
              {isUpdating ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-base">Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default ExpenseScreen