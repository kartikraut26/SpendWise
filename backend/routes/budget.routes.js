const express = require('express')
const { getBudgets, createBudget, updateBudget, deleteBudget } = require('../controllers/budget.controller')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()
router.get('/', asyncHandler(getBudgets))
router.post('/', asyncHandler(createBudget))
router.patch('/:id', asyncHandler(updateBudget))
router.delete('/:id', asyncHandler(deleteBudget))
module.exports = router
