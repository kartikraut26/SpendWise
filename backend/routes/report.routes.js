const express = require('express')
const { getReport } = require('../controllers/report.controller')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get(
  '/',
  asyncHandler(getReport)
)

module.exports = router