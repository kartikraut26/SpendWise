const Budget = require('../models/Budget')
const Transaction = require('../models/Transaction')

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

async function getBudgets(req, res) {
  const month = /^\d{4}-\d{2}$/.test(req.query.month || '') ? req.query.month : currentMonth()
  const budgets = await Budget.find({ userId: req.user.id, month }).sort({ categoryId: 1 })
  const start = new Date(`${month}-01T00:00:00.000Z`)
  const end = new Date(start)
  end.setUTCMonth(end.getUTCMonth() + 1)

  const spending = await Transaction.aggregate([
    {
      $match: {
        userId: req.user.id,
        type: 'expense',
        date: { $gte: start, $lt: end }
      }
    },
    { $group: { _id: '$categoryId', spent: { $sum: '$amount' } } }
  ])
  const spentMap = new Map(spending.map(item => [item._id || 'Uncategorized', item.spent]))

  const data = budgets.map(budget => ({
    ...budget.toObject(),
    spent: budget.categoryId === 'overall'
      ? spending.reduce((sum, item) => sum + item.spent, 0)
      : (spentMap.get(budget.categoryId) || 0),
    remaining: Math.max(
      budget.amount - (budget.categoryId === 'overall'
        ? spending.reduce((sum, item) => sum + item.spent, 0)
        : (spentMap.get(budget.categoryId) || 0)),
      0
    )
  }))

  res.json({ success: true, data })
}

async function createBudget(req, res) {
  const month = /^\d{4}-\d{2}$/.test(req.body.month || '') ? req.body.month : currentMonth()
  const amount = Number(req.body.amount)
  const categoryId = String(req.body.categoryId || 'overall')

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Budget amount must be greater than zero' })
  }

  const budget = await Budget.findOneAndUpdate(
    { userId: req.user.id, month, categoryId },
    { $set: { amount } },
    { new: true, upsert: true, runValidators: true }
  )

  res.status(201).json({ success: true, data: budget })
}

async function updateBudget(req, res) {
  const amount = Number(req.body.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Budget amount must be greater than zero' })
  }

  const budget = await Budget.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: { amount } },
    { new: true, runValidators: true }
  )

  if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' })
  res.json({ success: true, data: budget })
}

async function deleteBudget(req, res) {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
  if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' })
  res.json({ success: true, message: 'Budget deleted successfully' })
}

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget }
