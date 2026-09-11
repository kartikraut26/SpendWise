const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 50 },
    type: { type: String, enum: ['income', 'expense'], required: true },
    icon: { type: String, default: 'tag' },
    color: { type: String, default: '#6366f1' }
  },
  { timestamps: true }
)

categorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true })

module.exports = mongoose.model('Category', categorySchema)
