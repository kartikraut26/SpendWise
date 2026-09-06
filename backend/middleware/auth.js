const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')

const keycloakUrl = (
  process.env.KEYCLOAK_URL ||
  'http://localhost:8080'
).replace(/\/$/, '')

const realm =
  process.env.KEYCLOAK_REALM ||
  'spendwise'

const issuer =
  `${keycloakUrl}/realms/${realm}`

const audience =
  process.env.KEYCLOAK_API_CLIENT_ID ||
  'spendwise-api'


const client = jwksClient({
  jwksUri:
    `${issuer}/protocol/openid-connect/certs`,

  cache: true,

  cacheMaxEntries: 5,

  cacheMaxAge:
    10 * 60 * 1000,

  rateLimit: true,

  jwksRequestsPerMinute: 10
})


function getSigningKey(header, callback) {

  client.getSigningKey(
    header.kid,
    (error, key) => {

      if (error) {
        return callback(error)
      }

      callback(
        null,
        key.getPublicKey()
      )
    }
  )
}


function requireAuth(req, res, next) {

  const authorization =
    req.get('authorization') || ''


  if (
    !authorization.startsWith(
      'Bearer '
    )
  ) {

    return res.status(401).json({
      success: false,
      message:
        'Authentication required'
    })
  }


  const token =
    authorization
      .slice(7)
      .trim()


  if (!token) {

    return res.status(401).json({
      success: false,
      message:
        'Authentication token missing'
    })
  }


  jwt.verify(
    token,
    getSigningKey,
    {
      algorithms: ['RS256'],
      issuer,
      audience
    },
    (error, payload) => {

      if (error) {

        console.error(
          'JWT verification failed:',
          error.message
        )

        return res.status(401).json({
          success: false,
          message:
            'Invalid or expired access token'
        })
      }


      if (!payload.sub) {

        return res.status(401).json({
          success: false,
          message:
            'Token does not contain a user identity'
        })
      }


      req.user = {
        id: payload.sub,
        ...payload
      }


      next()
    }
  )
}


module.exports = requireAuth