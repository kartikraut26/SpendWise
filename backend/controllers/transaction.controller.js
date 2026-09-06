const Transaction =
  require('../models/Transaction')


async function getTransactions(
  req,
  res
) {

  const userId =
    req.user.id


  const transactions =
    await Transaction
      .find({
        userId
      })
      .sort({
        date: -1
      })


  res.status(200).json({

    success: true,

    data: transactions
  })
}


async function createTransaction(
  req,
  res
) {

  const userId =
    req.user.id


  const {
    type,
    amount,
    description,
    categoryId,
    date
  } = req.body


  if (
    !type ||
    amount === undefined ||
    !description ||
    !date
  ) {

    return res.status(400).json({

      success: false,

      message:
        'type, amount, description and date are required'
    })
  }


  if (
    ![
      'income',
      'expense'
    ].includes(type)
  ) {

    return res.status(400).json({

      success: false,

      message:
        'type must be income or expense'
    })
  }


  const transaction =
    await Transaction.create({

      userId,

      type,

      amount,

      description,

      categoryId:
        categoryId || null,

      date
    })


  res.status(201).json({

    success: true,

    data: transaction
  })
}


module.exports = {

  getTransactions,

  createTransaction
}