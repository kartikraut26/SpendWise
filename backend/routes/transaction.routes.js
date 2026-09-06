const express =
  require('express')

const {
  getTransactions,
  createTransaction
} =
  require(
    '../controllers/transaction.controller'
  )

const asyncHandler =
  require('../utils/asyncHandler')

const requireAuth =
  require('../middleware/auth')


const router =
  express.Router()


router.get(

  '/',

  requireAuth,

  asyncHandler(
    getTransactions
  )

)


router.post(

  '/',

  requireAuth,

  asyncHandler(
    createTransaction
  )

)


module.exports =
  router