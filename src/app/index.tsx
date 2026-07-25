import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  FlatList,
} from "react-native";

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  icon: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Grocery Shopping",
    category: "Food",
    amount: 84.50,
    type: "expense",
    date: "Today, 2:45 PM",
    icon: "🛒",
  },
  {
    id: "2",
    title: "Salary Deposit",
    category: "Income",
    amount: 3200.00,
    type: "income",
    date: "Yesterday",
    icon: "💰",
  },
  {
    id: "3",
    title: "Electricity Bill",
    category: "Bills",
    amount: 120.00,
    type: "expense",
    date: "24 Jul 2026",
    icon: "⚡",
  },
  {
    id: "4",
    title: "Coffee & Pastry",
    category: "Food",
    amount: 14.20,
    type: "expense",
    date: "23 Jul 2026",
    icon: "☕",
  },
  {
    id: "5",
    title: "Freelance Project",
    category: "Income",
    amount: 450.00,
    type: "income",
    date: "22 Jul 2026",
    icon: "💻",
  },
];

const CATEGORIES = ["All", "Food", "Income", "Bills", "Shopping"];

export default function Index() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState<"expense" | "income">("expense");
  const [newCategory, setNewCategory] = useState("Food");

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((t) =>
    selectedCategory === "All" ? true : t.category === selectedCategory
  );

  const handleAddTransaction = () => {
    if (!newTitle.trim() || !newAmount.trim()) return;

    const amountNum = parseFloat(newAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const iconMap: Record<string, string> = {
      Food: "🍔",
      Income: "💵",
      Bills: "📄",
      Shopping: "🛍️",
      Transport: "🚗",
    };

    const newTx: Transaction = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      category: newCategory,
      amount: amountNum,
      type: newType,
      date: "Just now",
      icon: iconMap[newCategory] || "💳",
    };

    setTransactions([newTx, ...transactions]);
    setNewTitle("");
    setNewAmount("");
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.userName}>Vipul Avinash</Text>
        </View>
        <TouchableOpacity style={styles.profileBadge}>
          <Text style={styles.profileBadgeText}>VA</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>${netBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIconBadge, { backgroundColor: "rgba(16, 185, 129, 0.2)" }]}>
                <Text style={styles.statIconText}>↓</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>Income</Text>
                <Text style={styles.incomeText}>+${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <View style={[styles.statIconBadge, { backgroundColor: "rgba(239, 68, 68, 0.2)" }]}>
                <Text style={styles.statIconText}>↑</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>Expenses</Text>
                <Text style={styles.expenseText}>-${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setModalVisible(true)}>
            <View style={[styles.actionIcon, { backgroundColor: "#6366f1" }]}>
              <Text style={styles.actionIconText}>+</Text>
            </View>
            <Text style={styles.actionText}>Add Record</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: "#10b981" }]}>
              <Text style={styles.actionIconText}>📊</Text>
            </View>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: "#f59e0b" }]}>
              <Text style={styles.actionIconText}>🎯</Text>
            </View>
            <Text style={styles.actionText}>Budgets</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filters */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Transaction List */}
        <View style={styles.listContainer}>
          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>No transactions found in this category.</Text>
            </View>
          ) : (
            filteredTransactions.map((item) => (
              <View key={item.id} style={styles.txCard}>
                <View style={styles.txLeft}>
                  <View style={styles.txIconContainer}>
                    <Text style={styles.txEmoji}>{item.icon}</Text>
                  </View>
                  <View>
                    <Text style={styles.txTitle}>{item.title}</Text>
                    <Text style={styles.txDate}>{item.date} • {item.category}</Text>
                  </View>
                </View>
                <Text style={[styles.txAmount, item.type === "income" ? styles.incomeColor : styles.expenseColor]}>
                  {item.type === "income" ? "+" : "-"}${item.amount.toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Transaction Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Record</Text>

            {/* Type Toggle */}
            <View style={styles.typeToggle}>
              <TouchableOpacity
                style={[styles.typeBtn, newType === "expense" && styles.typeBtnActiveExpense]}
                onPress={() => setNewType("expense")}
              >
                <Text style={[styles.typeText, newType === "expense" && styles.typeTextActive]}>Expense</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeBtn, newType === "income" && styles.typeBtnActiveIncome]}
                onPress={() => setNewType("income")}
              >
                <Text style={[styles.typeText, newType === "income" && styles.typeTextActive]}>Income</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dinner, Salary"
              placeholderTextColor="#9ca3af"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.inputLabel}>Amount ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={newAmount}
              onChangeText={setNewAmount}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryPicker}>
              {["Food", "Income", "Bills", "Shopping", "Transport"].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pickerChip, newCategory === cat && styles.pickerChipActive]}
                  onPress={() => setNewCategory(cat)}
                >
                  <Text style={[styles.pickerChipText, newCategory === cat && styles.pickerChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddTransaction}>
                <Text style={styles.submitBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  greeting: {
    color: "#94a3b8",
    fontSize: 14,
  },
  userName: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "700",
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
  },
  profileBadgeText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 24,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  balanceLabel: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "500",
  },
  balanceAmount: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  statIconText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 12,
  },
  incomeText: {
    color: "#10b981",
    fontSize: 15,
    fontWeight: "700",
  },
  expenseText: {
    color: "#ef4444",
    fontSize: 15,
    fontWeight: "700",
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#334155",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
  },
  actionBtn: {
    alignItems: "center",
  },
  actionIcon: {
    width: 54,
    height: 54,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 22,
    color: "#ffffff",
  },
  actionText: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "500",
  },
  filterSection: {
    marginTop: 30,
  },
  sectionTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  categoryScroll: {
    flexDirection: "row",
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  categoryChipActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  categoryText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#ffffff",
  },
  listContainer: {
    marginTop: 16,
    gap: 12,
  },
  txCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#334155",
  },
  txLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  txIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  txEmoji: {
    fontSize: 22,
  },
  txTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "600",
  },
  txDate: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  incomeColor: {
    color: "#10b981",
  },
  expenseColor: {
    color: "#ef4444",
  },
  emptyView: {
    padding: 30,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1e293b",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  typeToggle: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  typeBtnActiveExpense: {
    backgroundColor: "#ef4444",
  },
  typeBtnActiveIncome: {
    backgroundColor: "#10b981",
  },
  typeText: {
    color: "#94a3b8",
    fontWeight: "600",
  },
  typeTextActive: {
    color: "#ffffff",
  },
  inputLabel: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  categoryPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  pickerChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
  },
  pickerChipActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  pickerChipText: {
    color: "#94a3b8",
    fontSize: 13,
  },
  pickerChipTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#334155",
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#6366f1",
    alignItems: "center",
  },
  submitBtnText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});

