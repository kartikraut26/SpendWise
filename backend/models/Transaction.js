const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    categoryId: {
      type: String,
      default: null
    },

    date: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
)

transactionSchema.index({
  userId: 1,
  date: -1
})

module.exports = mongoose.model(
  'Transaction',
  transactionSchema
)