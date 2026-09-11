import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api'

function mapTransaction(t) {
  return {
    id: t._id,
    title: t.description,
    description: t.description,
    category: t.categoryId || 'Uncategorized',
    categoryId: t.categoryId || null,
    amount: Number(t.amount),
    type: t.type,
    date: t.date,
    dateLabel: formatDate(t.date),
    icon: getTransactionIcon(t.categoryId, t.type)
  }
}

function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getTransactionIcon(category, type) {
  if (type === 'income') return 'wallet'
  const value = String(category || '').toLowerCase()
  if (value.includes('food') || value.includes('grocery')) return 'food'
  if (value.includes('transport') || value.includes('petrol') || value.includes('travel')) return 'transport'
  if (value.includes('subscription') || value.includes('entertainment')) return 'subscription'
  return 'receipt'
}

export const useFinanceStore = defineStore('finance', () => {
  const transactions = ref([])
  const categories = ref([])
  const budgets = ref([])
  const subscriptions = ref([])
  const loading = ref(false)

  const totalIncome = computed(() =>
    transactions.value.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
  )
  const totalExpenses = computed(() =>
    transactions.value.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
  )
  const totalBalance = computed(() => totalIncome.value - totalExpenses.value)
  const savings = computed(() => Math.max(totalBalance.value, 0))
  const savingsPercentage = computed(() =>
    totalIncome.value > 0 ? Math.max(0, Math.round((totalBalance.value / totalIncome.value) * 100)) : 0
  )

  async function fetchTransactions(params = {}) {
    loading.value = true
    try {
      const response = await api.get('/transactions', { params })
      transactions.value = (response.data.data || []).map(mapTransaction)
      return transactions.value
    } finally {
      loading.value = false
    }
  }

  async function addTransaction(transaction) {
    const response = await api.post('/transactions', {
      type: transaction.type,
      amount: Number(transaction.amount),
      description: transaction.description || transaction.title,
      categoryId: transaction.categoryId || transaction.category || null,
      date: transaction.date
    })
    const created = mapTransaction(response.data.data)
    transactions.value = [created, ...transactions.value]
    return created
  }

  async function updateTransaction(id, transaction) {
    const response = await api.patch(`/transactions/${id}`, {
      type: transaction.type,
      amount: Number(transaction.amount),
      description: transaction.description || transaction.title,
      categoryId: transaction.categoryId || transaction.category || null,
      date: transaction.date
    })
    const updated = mapTransaction(response.data.data)
    const index = transactions.value.findIndex(t => t.id === id)
    if (index >= 0) transactions.value[index] = updated
    return updated
  }

  async function deleteTransaction(id) {
    await api.delete(`/transactions/${id}`)
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  async function fetchCategories() {
    const response = await api.get('/categories')
    categories.value = response.data.data || []
    return categories.value
  }

  async function fetchBudgets(month) {
    const response = await api.get('/budgets', { params: month ? { month } : {} })
    budgets.value = (response.data.data || []).map(b => ({
      ...b,
      id: b._id,
      category: b.categoryId === 'overall' ? 'Overall' : b.categoryId,
      limit: Number(b.amount),
      spent: Number(b.spent || 0),
      remaining: Number(b.remaining ?? Math.max(Number(b.amount) - Number(b.spent || 0), 0))
    }))
    return budgets.value
  }

  async function fetchSubscriptions() {
    const response = await api.get('/subscriptions')
    subscriptions.value = response.data.data || []
    return subscriptions.value
  }

  return {
    transactions, categories, budgets, subscriptions, loading,
    totalIncome, totalExpenses, totalBalance, savings, savingsPercentage,
    fetchTransactions, addTransaction, updateTransaction, deleteTransaction,
    fetchCategories, fetchBudgets, fetchSubscriptions
  }
})
