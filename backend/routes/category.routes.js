const express = require('express')
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(getCategories))
router.post('/', asyncHandler(createCategory))
router.patch('/:id', asyncHandler(updateCategory))
router.delete('/:id', asyncHandler(deleteCategory))

module.exports = router
