const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    month: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
    categoryId: { type: String, default: 'overall' },
    amount: { type: Number, required: true, min: 0.01 }
  },
  { timestamps: true }
)

budgetSchema.index({ userId: 1, month: 1, categoryId: 1 }, { unique: true })

module.exports = mongoose.model('Budget', budgetSchema)
