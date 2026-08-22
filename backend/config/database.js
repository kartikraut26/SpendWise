const dns = require('dns')

dns.setServers([
  '8.8.8.8',
  '1.1.1.1'
])

const mongoose = require('mongoose')


async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI

    if (!mongoUri) {
      throw new Error(
        'MONGODB_URI is not defined in environment variables'
      )
    }

    await mongoose.connect(mongoUri)

    console.log(
      'MongoDB connected successfully'
    )

  } catch (error) {

    console.error(
      'MongoDB connection failed'
    )

    console.error(
      error.message
    )

    throw error
  }
}


module.exports = connectDatabase