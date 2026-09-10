const Subscription = require('../models/Subscription')

async function getSubscriptions(req, res) {
  const subscriptions = await Subscription.find({ userId: req.user.id }).sort({ nextPaymentDate: 1 })
  res.json({ success: true, data: subscriptions })
}

async function createSubscription(req, res) {
  const { name, amount, billingCycle, nextPaymentDate, categoryId } = req.body
  const numericAmount = Number(amount)
  if (!name || !Number.isFinite(numericAmount) || numericAmount <= 0 ||
      !['monthly', 'yearly'].includes(billingCycle) || !nextPaymentDate) {
    return res.status(400).json({
      success: false,
      message: 'name, amount, billingCycle and nextPaymentDate are required'
    })
  }

  const subscription = await Subscription.create({
    userId: req.user.id,
    name: String(name).trim(),
    amount: numericAmount,
    billingCycle,
    nextPaymentDate: new Date(nextPaymentDate),
    categoryId: categoryId || 'Subscription'
  })
  res.status(201).json({ success: true, data: subscription })
}

async function updateSubscription(req, res) {
  const allowed = ['name', 'amount', 'billingCycle', 'nextPaymentDate', 'categoryId', 'active']
  const updates = {}
  for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key]
  if (updates.amount !== undefined) updates.amount = Number(updates.amount)
  if (updates.nextPaymentDate !== undefined) updates.nextPaymentDate = new Date(updates.nextPaymentDate)

  const subscription = await Subscription.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    updates,
    { new: true, runValidators: true }
  )
  if (!subscription) return res.status(404).json({ success: false, message: 'Subscription not found' })
  res.json({ success: true, data: subscription })
}

async function deleteSubscription(req, res) {
  const subscription = await Subscription.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  })
  if (!subscription) return res.status(404).json({ success: false, message: 'Subscription not found' })
  res.json({ success: true, message: 'Subscription deleted successfully' })
}

module.exports = { getSubscriptions, createSubscription, updateSubscription, deleteSubscription }
