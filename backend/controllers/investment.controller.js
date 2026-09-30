const Investment = require('../models/Investment')

function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : NaN
}

function normalizePriceHistory(value, { required = false } = {}) {
  if (value === undefined || value === null) {
    if (required) {
      return { error: 'Exactly 5 historical price points are required' }
    }
    return { value: undefined }
  }

  if (!Array.isArray(value)) {
    return { error: 'priceHistory must be an array' }
  }

  if (required && value.length !== 5) {
    return { error: 'Exactly 5 historical price points are required' }
  }

  if (value.length === 0) {
    return { value: [] }
  }

  if (value.length !== 5) {
    return { error: 'priceHistory must contain exactly 5 historical price points' }
  }

  const history = []

  for (const point of value) {
    if (!point || !point.date) {
      return {
        error: 'Each historical price point must have a date'
      }
    }

    const date = new Date(point.date)
    const price = toNumber(point.price)

    if (Number.isNaN(date.getTime())) {
      return {
        error: 'Each historical price point must have a valid date'
      }
    }

    if (!Number.isFinite(price) || price < 0) {
      return {
        error: 'Historical price must be zero or greater'
      }
    }

    history.push({
      date,
      price
    })
  }

  history.sort((a, b) => a.date - b.date)

  for (let index = 1; index < history.length; index += 1) {
    if (
      history[index].date.getTime() ===
      history[index - 1].date.getTime()
    ) {
      return {
        error: 'Historical price dates must be different'
      }
    }
  }

  return {
    value: history
  }
}

function enrichInvestment(investment) {
  const item = investment.toObject
    ? investment.toObject()
    : investment

  const investedValue =
    Number(item.quantity) * Number(item.buyPrice)

  const currentValue =
    Number(item.quantity) * Number(item.currentPrice)

  const profitLoss =
    currentValue - investedValue

  const profitLossPercentage =
    investedValue > 0
      ? (profitLoss / investedValue) * 100
      : 0

  return {
    ...item,

    priceHistory: Array.isArray(item.priceHistory)
      ? [...item.priceHistory].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )
      : [],

    investedValue,
    currentValue,
    profitLoss,
    profitLossPercentage
  }
}

function buildSummary(investments) {
  const summary = investments.reduce(
    (result, investment) => {
      result.totalInvested += investment.investedValue
      result.currentValue += investment.currentValue
      result.totalProfitLoss += investment.profitLoss

      return result
    },
    {
      totalInvested: 0,
      currentValue: 0,
      totalProfitLoss: 0
    }
  )

  summary.profitLossPercentage =
    summary.totalInvested > 0
      ? (summary.totalProfitLoss / summary.totalInvested) * 100
      : 0

  return summary
}

async function getInvestments(req, res) {
  const investments = await Investment.find({
    userId: req.user.id
  }).sort({
    purchaseDate: -1,
    _id: -1
  })

  const data = investments.map(enrichInvestment)

  res.json({
    success: true,
    data,
    summary: buildSummary(data)
  })
}

async function createInvestment(req, res) {
  const {
    companyName,
    symbol,
    exchange,
    quantity,
    buyPrice,
    purchaseDate,
    currentPrice,
    priceHistory
  } = req.body

  const numericQuantity = toNumber(quantity)
  const numericBuyPrice = toNumber(buyPrice)
  const numericCurrentPrice = toNumber(currentPrice)
  const purchase = new Date(purchaseDate)

  const historyResult = normalizePriceHistory(
    priceHistory,
    { required: true }
  )

  if (
    !companyName ||
    !symbol ||
    !exchange ||
    !purchaseDate
  ) {
    return res.status(400).json({
      success: false,
      message:
        'companyName, symbol, exchange and purchaseDate are required'
    })
  }

  if (
    !Number.isFinite(numericQuantity) ||
    numericQuantity <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'quantity must be greater than zero'
    })
  }

  if (
    !Number.isFinite(numericBuyPrice) ||
    numericBuyPrice <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'buyPrice must be greater than zero'
    })
  }

  if (
    !Number.isFinite(numericCurrentPrice) ||
    numericCurrentPrice < 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'currentPrice must be zero or greater'
    })
  }

  if (Number.isNaN(purchase.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'purchaseDate must be a valid date'
    })
  }

  if (historyResult.error) {
    return res.status(400).json({
      success: false,
      message: historyResult.error
    })
  }

  const investment = await Investment.create({
    userId: req.user.id,

    companyName: String(companyName).trim(),

    symbol: String(symbol)
      .trim()
      .toUpperCase(),

    exchange: String(exchange)
      .trim()
      .toUpperCase(),

    quantity: numericQuantity,

    buyPrice: numericBuyPrice,

    purchaseDate: purchase,

    currentPrice: numericCurrentPrice,

    priceHistory: historyResult.value
  })

  res.status(201).json({
    success: true,
    data: enrichInvestment(investment)
  })
}

async function updateInvestment(req, res) {
  const allowed = [
    'companyName',
    'symbol',
    'exchange',
    'quantity',
    'buyPrice',
    'purchaseDate',
    'currentPrice',
    'priceHistory'
  ]

  const updates = {}

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key]
    }
  }

  if (updates.companyName !== undefined) {
    updates.companyName =
      String(updates.companyName).trim()

    if (!updates.companyName) {
      return res.status(400).json({
        success: false,
        message: 'companyName is required'
      })
    }
  }

  if (updates.symbol !== undefined) {
    updates.symbol =
      String(updates.symbol)
        .trim()
        .toUpperCase()
  }

  if (updates.exchange !== undefined) {
    updates.exchange =
      String(updates.exchange)
        .trim()
        .toUpperCase()
  }

  if (updates.quantity !== undefined) {
    updates.quantity =
      toNumber(updates.quantity)

    if (
      !Number.isFinite(updates.quantity) ||
      updates.quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'quantity must be greater than zero'
      })
    }
  }

  if (updates.buyPrice !== undefined) {
    updates.buyPrice =
      toNumber(updates.buyPrice)

    if (
      !Number.isFinite(updates.buyPrice) ||
      updates.buyPrice <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'buyPrice must be greater than zero'
      })
    }
  }

  if (updates.currentPrice !== undefined) {
    updates.currentPrice =
      toNumber(updates.currentPrice)

    if (
      !Number.isFinite(updates.currentPrice) ||
      updates.currentPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'currentPrice must be zero or greater'
      })
    }
  }

  if (updates.purchaseDate !== undefined) {
    updates.purchaseDate =
      new Date(updates.purchaseDate)

    if (
      Number.isNaN(
        updates.purchaseDate.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'purchaseDate must be a valid date'
      })
    }
  }

  if (updates.priceHistory !== undefined) {
    const historyResult =
      normalizePriceHistory(
        updates.priceHistory
      )

    if (historyResult.error) {
      return res.status(400).json({
        success: false,
        message: historyResult.error
      })
    }

    updates.priceHistory =
      historyResult.value
  }

  const investment =
    await Investment.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id
      },
      updates,
      {
        new: true,
        runValidators: true
      }
    )

  if (!investment) {
    return res.status(404).json({
      success: false,
      message: 'Investment not found'
    })
  }

  res.json({
    success: true,
    data: enrichInvestment(investment)
  })
}

async function deleteInvestment(req, res) {
  const investment =
    await Investment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    })

  if (!investment) {
    return res.status(404).json({
      success: false,
      message: 'Investment not found'
    })
  }

  res.json({
    success: true,
    message: 'Investment deleted successfully'
  })
}

module.exports = {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment
}