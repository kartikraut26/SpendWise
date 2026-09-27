const mongoose = require('mongoose')

const investmentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },

    companyName: { type: String, required: true, trim: true, maxlength: 120 },

    symbol: { type: String, required: true, trim: true, uppercase: true, maxlength: 30 },

    exchange: { type: String, required: true, trim: true, uppercase: true, maxlength: 20 },

    quantity: { type: Number, required: true, min: 0.000001 },

    buyPrice: { type: Number, required: true, min: 0.01 },

    purchaseDate: { type: Date, required: true },

    currentPrice: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
)

investmentSchema.index({
  userId: 1,
  purchaseDate: -1
})

module.exports = mongoose.model(
  'Investment',
  investmentSchema
)
