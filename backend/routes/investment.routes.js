const express = require('express')
const {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment
} = require('../controllers/investment.controller')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(getInvestments))
router.post('/', asyncHandler(createInvestment))
router.patch('/:id', asyncHandler(updateInvestment))
router.delete('/:id', asyncHandler(deleteInvestment))

module.exports = router
