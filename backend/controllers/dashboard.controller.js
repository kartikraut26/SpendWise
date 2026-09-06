const {
  getDashboardSummary
} = require('../services/dashboard.service')


async function getSummary(req, res) {

  const userId =
    req.user.id


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