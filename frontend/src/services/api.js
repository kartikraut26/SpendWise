import axios from 'axios'
import keycloak from './keycloak'

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api',

  headers: {
    'Content-Type': 'application/json'
  }
})

/*
 * Attach the current Keycloak access token
 * to every API request.
 */
api.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      try {
        await keycloak.updateToken(30)

        config.headers.Authorization =
          `Bearer ${keycloak.token}`
      } catch (error) {
        console.error(
          'Unable to refresh authentication token:',
          error
        )

        keycloak.clearToken()

        if (
          window.location.pathname !== '/login'
        ) {
          window.location.href = '/login'
        }

        return Promise.reject(error)
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/*
 * If the backend rejects the token,
 * return the user to the login page.
 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/login'
    ) {
      keycloak.clearToken()

      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api