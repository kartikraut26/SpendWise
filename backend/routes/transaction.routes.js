const express = require('express')
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transaction.controller')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(getTransactions))
router.post('/', asyncHandler(createTransaction))
router.patch('/:id', asyncHandler(updateTransaction))
router.delete('/:id', asyncHandler(deleteTransaction))

module.exports = router
