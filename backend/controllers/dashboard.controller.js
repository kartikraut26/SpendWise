const {
  getDashboardSummary
} = require('../services/dashboard.service')

async function getSummary(req, res) {
  /*
   * TEMPORARY:
   * Authentication will be connected in the
   * Keycloak/JWT phase.
   *
   * We deliberately keep this separate from
   * the controller architecture.
   */

  const userId =
    req.user?.id || 'development-user'

  const summary =
    await getDashboardSummary(userId)

  res.status(200).json({
    success: true,
    data: summary
  })
}

module.exports = {
  getSummary
}