require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const connectDatabase =
  require('./config/database')

const healthRoutes =
  require('./routes/health.routes')

const dashboardRoutes =
  require('./routes/dashboard.routes')

const notFound =
  require('./middleware/notFound')

const errorHandler =
  require('./middleware/errorHandler')


const app = express()

const PORT =
  process.env.PORT || 5000


/* =========================================
   SECURITY
========================================= */

app.use(
  helmet()
)


/* =========================================
   CORS
========================================= */

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      'http://localhost:5173',

    credentials: true
  })
)


/* =========================================
   BODY PARSER
========================================= */

app.use(
  express.json({
    limit: '1mb'
  })
)

app.use(
  express.urlencoded({
    extended: true
  })
)


/* =========================================
   LOGGING
========================================= */

if (
  process.env.NODE_ENV !== 'test'
) {
  app.use(morgan('dev'))
}


/* =========================================
   BASIC ROUTE
========================================= */

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to SpendWise API'
  })
})


/* =========================================
   API ROUTES
========================================= */

app.use(
  '/api/health',
  healthRoutes
)

app.use(
  '/api/dashboard',
  dashboardRoutes
)


/* =========================================
   ERROR HANDLING
========================================= */

app.use(notFound)

app.use(errorHandler)


/* =========================================
   DATABASE + SERVER
========================================= */

async function startServer() {
  try {

    await connectDatabase()

    app.listen(
      PORT,
      () => {
        console.log(
          `SpendWise API running on port ${PORT}`
        )

        console.log(
          `http://localhost:${PORT}`
        )
      }
    )

  } catch (error) {

    console.error(
      'Server startup failed'
    )

    process.exit(1)
  }
}


startServer()