const Transaction = require('../models/Transaction')

function buildFilters(req) {
  const filters = { userId: req.user.id }

  if (req.query.type && ['income', 'expense'].includes(req.query.type)) {
    filters.type = req.query.type
  }

  if (req.query.category) {
    filters.categoryId = String(req.query.category)
  }

  if (req.query.from || req.query.to) {
    filters.date = {}
    if (req.query.from) filters.date.$gte = new Date(`${req.query.from}T00:00:00.000Z`)
    if (req.query.to) filters.date.$lte = new Date(`${req.query.to}T23:59:59.999Z`)
  }

  if (req.query.search) {
    filters.$or = [
      { description: { $regex: String(req.query.search), $options: 'i' } },
      { categoryId: { $regex: String(req.query.search), $options: 'i' } }
    ]
  }

  return filters
}

async function getTransactions(req, res) {
  const sortField = ['date', 'amount', 'description'].includes(req.query.sort)
    ? req.query.sort
    : 'date'
  const sortDirection = req.query.order === 'asc' ? 1 : -1

  const transactions = await Transaction.find(buildFilters(req))
    .sort({ [sortField]: sortDirection, _id: -1 })

  res.json({ success: true, data: transactions })
}

async function createTransaction(req, res) {
  const { type, amount, description, categoryId, date } = req.body

  if (!type || amount === undefined || !description || !date) {
    return res.status(400).json({
      success: false,
      message: 'type, amount, description and date are required'
    })
  }

  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ success: false, message: 'type must be income or expense' })
  }

  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ success: false, message: 'amount must be greater than zero' })
  }

  const transaction = await Transaction.create({
    userId: req.user.id,
    type,
    amount: numericAmount,
    description: String(description).trim(),
    categoryId: categoryId ? String(categoryId).trim() : null,
    date: new Date(date)
  })

  res.status(201).json({ success: true, data: transaction })
}

async function updateTransaction(req, res) {
  const allowed = ['type', 'amount', 'description', 'categoryId', 'date']
  const updates = {}

  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key]
  }

  if (updates.type && !['income', 'expense'].includes(updates.type)) {
    return res.status(400).json({ success: false, message: 'type must be income or expense' })
  }
  if (updates.amount !== undefined) {
    updates.amount = Number(updates.amount)
    if (!Number.isFinite(updates.amount) || updates.amount <= 0) {
      return res.status(400).json({ success: false, message: 'amount must be greater than zero' })
    }
  }
  if (updates.description !== undefined) updates.description = String(updates.description).trim()
  if (updates.categoryId !== undefined) updates.categoryId = updates.categoryId ? String(updates.categoryId).trim() : null
  if (updates.date !== undefined) updates.date = new Date(updates.date)

  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    updates,
    { new: true, runValidators: true }
  )

  if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' })

  res.json({ success: true, data: transaction })
}

async function deleteTransaction(req, res) {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  })

  if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' })

  res.json({ success: true, message: 'Transaction deleted successfully' })
}

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
}
