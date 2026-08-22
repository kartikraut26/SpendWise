import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useFinanceStore = defineStore('finance', () => {
  const transactions = ref([
    {
      id: 1,
      title: 'Salary',
      category: 'Income',
      amount: 50000,
      type: 'income',
      date: 'Today',
      icon: 'wallet'
    },
    {
      id: 2,
      title: 'Grocery Store',
      category: 'Food',
      amount: 1250,
      type: 'expense',
      date: 'Today',
      icon: 'food'
    },
    {
      id: 3,
      title: 'Petrol',
      category: 'Transport',
      amount: 900,
      type: 'expense',
      date: 'Yesterday',
      icon: 'transport'
    },
    {
      id: 4,
      title: 'Netflix',
      category: 'Entertainment',
      amount: 649,
      type: 'expense',
      date: '20 Aug',
      icon: 'subscription'
    },
    {
      id: 5,
      title: 'Coffee',
      category: 'Food',
      amount: 180,
      type: 'expense',
      date: '19 Aug',
      icon: 'food'
    }
  ])

  const budgets = ref([
    {
      category: 'Food',
      spent: 7200,
      limit: 10000
    },
    {
      category: 'Transport',
      spent: 2250,
      limit: 5000
    },
    {
      category: 'Entertainment',
      spent: 1800,
      limit: 3000
    }
  ])

  const savingsGoal = ref({
    title: 'New Laptop',
    current: 45000,
    target: 60000
  })

  const totalIncome = computed(() =>
    transactions.value
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0)
  )

  const totalExpenses = computed(() =>
    transactions.value
      .filter(transaction => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0)
  )

  const totalBalance = computed(() =>
    totalIncome.value - totalExpenses.value
  )

  const savings = computed(() =>
    Math.max(totalBalance.value, 0)
  )

  const savingsPercentage = computed(() => {
    return Math.min(
      Math.round(
        (savingsGoal.value.current / savingsGoal.value.target) * 100
      ),
      100
    )
  })

  function addTransaction(transaction) {
    transactions.value.unshift({
      id: Date.now(),
      ...transaction
    })

    if (transaction.type === 'expense') {
      const budget = budgets.value.find(
        item => item.category === transaction.category
      )

      if (budget) {
        budget.spent += transaction.amount
      }
    }
  }

  return {
    transactions,
    budgets,
    savingsGoal,
    totalIncome,
    totalExpenses,
    totalBalance,
    savings,
    savingsPercentage,
    addTransaction
  }
})