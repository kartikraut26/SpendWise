const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    amount: { type: Number, required: true, min: 0.01 },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], required: true },
    nextPaymentDate: { type: Date, required: true },
    categoryId: { type: String, default: 'Subscription' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
)

subscriptionSchema.index({ userId: 1, nextPaymentDate: 1 })

module.exports = mongoose.model('Subscription', subscriptionSchema)
