const Category = require('../models/Category')
const Transaction = require('../models/Transaction')

const DEFAULTS = [
  ['Food', 'expense', 'food', '#6366f1'],
  ['Transport', 'expense', 'car', '#06b6d4'],
  ['Shopping', 'expense', 'shopping-bag', '#8b5cf6'],
  ['Bills', 'expense', 'receipt', '#f59e0b'],
  ['Entertainment', 'expense', 'clapperboard', '#ec4899'],
  ['Health', 'expense', 'heart-pulse', '#10b981'],
  ['Other', 'expense', 'tag', '#94a3b8'],
  ['Salary', 'income', 'wallet', '#10b981'],
  ['Other Income', 'income', 'plus-circle', '#22c55e']
]

async function ensureDefaults(userId) {
  const count = await Category.countDocuments({ userId })
  if (count > 0) return
  await Category.insertMany(
    DEFAULTS.map(([name, type, icon, color]) => ({ userId, name, type, icon, color })),
    { ordered: false }
  )
}

async function getCategories(req, res) {
  await ensureDefaults(req.user.id)
  const categories = await Category.find({ userId: req.user.id }).sort({ type: 1, name: 1 })
  res.json({ success: true, data: categories })
}

async function createCategory(req, res) {
  const name = String(req.body.name || '').trim()
  const type = req.body.type
  if (!name || !['income', 'expense'].includes(type)) {
    return res.status(400).json({ success: false, message: 'name and valid type are required' })
  }

  const category = await Category.create({
    userId: req.user.id,
    name,
    type,
    icon: req.body.icon || 'tag',
    color: req.body.color || '#6366f1'
  })

  res.status(201).json({ success: true, data: category })
}

async function updateCategory(req, res) {
  const category = await Category.findOne({ _id: req.params.id, userId: req.user.id })
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' })

  const oldName = category.name
  if (req.body.name !== undefined) category.name = String(req.body.name).trim()
  if (req.body.type !== undefined) {
    if (!['income', 'expense'].includes(req.body.type)) {
      return res.status(400).json({ success: false, message: 'Invalid category type' })
    }
    category.type = req.body.type
  }
  if (req.body.icon !== undefined) category.icon = String(req.body.icon)
  if (req.body.color !== undefined) category.color = String(req.body.color)

  await category.save()

  if (oldName !== category.name) {
    await Transaction.updateMany(
      { userId: req.user.id, categoryId: oldName },
      { $set: { categoryId: category.name } }
    )
  }

  res.json({ success: true, data: category })
}

async function deleteCategory(req, res) {
  const category = await Category.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' })

  await Transaction.updateMany(
    { userId: req.user.id, categoryId: category.name },
    { $set: { categoryId: null } }
  )

  res.json({ success: true, message: 'Category deleted successfully' })
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory }
