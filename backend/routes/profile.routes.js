const express =
  require('express')


const {
  getProfile,
  updateProfile
} =
  require(
    '../controllers/profile.controller'
  )


const asyncHandler =
  require('../utils/asyncHandler')


const router =
  express.Router()


/*
 * Current authenticated user's profile.
 */
router.get(
  '/me',
  asyncHandler(
    getProfile
  )
)


/*
 * Update current authenticated user's
 * profile/preferences.
 */
router.patch(
  '/me',
  asyncHandler(
    updateProfile
  )
)


module.exports =
  router