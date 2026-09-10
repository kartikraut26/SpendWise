const express = require('express')
const {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
} = require('../controllers/subscription.controller')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()
router.get('/', asyncHandler(getSubscriptions))
router.post('/', asyncHandler(createSubscription))
router.patch('/:id', asyncHandler(updateSubscription))
router.delete('/:id', asyncHandler(deleteSubscription))
module.exports = router
