const Transaction = require('../models/Transaction')

async function getDashboardSummary(userId) {
  const transactions = await Transaction
    .find({ userId })
    .sort({ date: -1 })

  let totalIncome = 0
  let totalExpenses = 0

  for (const transaction of transactions) {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount
    }

    if (transaction.type === 'expense') {
      totalExpenses += transaction.amount
    }
  }

  const totalBalance =
    totalIncome - totalExpenses

  const recentTransactions =
    transactions.slice(0, 5)

  return {
    totalBalance,
    totalIncome,
    totalExpenses,

    savings: totalBalance,

    transactionCount:
      transactions.length,

    recentTransactions
  }
}

module.exports = {
  getDashboardSummary
}