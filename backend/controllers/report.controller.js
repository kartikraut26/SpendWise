const Transaction = require('../models/Transaction')

function monthStart(month) {
  return new Date(`${month}-01T00:00:00.000Z`)
}

async function getReport(req, res) {
  const months = Math.min(Math.max(Number(req.query.months) || 6, 1), 24)
  const now = new Date()
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - months + 1, 1))

  const match = {
    userId: req.user.id,
    date: { $gte: start, $lt: end }
  }

  const [category, monthly] = await Promise.all([
    Transaction.aggregate([
      { $match: { ...match, type: 'expense' } },
      { $group: { _id: { $ifNull: ['$categoryId', 'Uncategorized'] }, total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]),
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])
  ])

  const categoryTotal = category.reduce((sum, item) => sum + item.total, 0)
  const monthlyData = monthly.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    income: item.income,
    expense: item.expense,
    balance: item.income - item.expense
  }))

  res.json({
    success: true,
    data: {
      category: category.map(item => ({
        name: item._id,
        amount: item.total,
        percent: categoryTotal ? Math.round((item.total / categoryTotal) * 100) : 0
      })),
      monthly: monthlyData,
      totals: {
        income: monthlyData.reduce((sum, item) => sum + item.income, 0),
        expense: monthlyData.reduce((sum, item) => sum + item.expense, 0)
      }
    }
  })
}

module.exports = { getReport }
