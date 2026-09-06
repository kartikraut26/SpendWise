import {
  computed,
  ref
} from 'vue'

import {
  defineStore
} from 'pinia'

import keycloak from '../services/keycloak'


export const useAuthStore =
  defineStore('auth', () => {

    const initialized =
      ref(false)

    const initializing =
      ref(true)

    const authenticated =
      ref(false)

    const user =
      ref(null)

    const error =
      ref(null)


    const isAuthenticated =
      computed(
        () => authenticated.value
      )


    const userName =
      computed(() => {

        if (!user.value) {
          return 'User'
        }

        return (
          user.value.name ||
          user.value.preferred_username ||
          user.value.email ||
          'User'
        )
      })


    const userEmail =
      computed(() => {

        return (
          user.value?.email ||
          ''
        )
      })


    async function initialize() {

      if (initialized.value) {
        return authenticated.value
      }

      initializing.value = true
      error.value = null

      try {

        const loggedIn =
          await keycloak.init({
            onLoad: 'check-sso',

            pkceMethod: 'S256',

            checkLoginIframe: false
          })


        authenticated.value =
          loggedIn


        if (loggedIn) {
          setUser()
        }

        keycloak.onTokenExpired =
          async () => {

            try {

              await keycloak.updateToken(
                30
              )

              setUser()

            } catch (refreshError) {

              console.error(
                'Token refresh failed:',
                refreshError
              )

              await logout()
            }
          }


        initialized.value = true

        return loggedIn

      } catch (initializationError) {

        console.error(
          'Keycloak initialization failed:',
          initializationError
        )

        error.value =
          'Authentication service is unavailable.'

        authenticated.value = false

        initialized.value = true

        return false

      } finally {

        initializing.value = false
      }
    }


    function setUser() {

      const parsed =
        keycloak.tokenParsed

      if (!parsed) {
        user.value = null
        return
      }

      user.value = {
        id: parsed.sub,

        username:
          parsed.preferred_username,

        email:
          parsed.email,

        firstName:
          parsed.given_name,

        lastName:
          parsed.family_name,

        name:
          parsed.name ||
          [
            parsed.given_name,
            parsed.family_name
          ]
            .filter(Boolean)
            .join(' ')
      }
    }


    async function login() {

      await keycloak.login({
        redirectUri:
          window.location.origin +
          '/dashboard'
      })
    }


    async function loginWithGoogle() {

      await keycloak.login({

        idpHint:
          import.meta.env
            .VITE_KEYCLOAK_GOOGLE_IDP ||
          'google',

        redirectUri:
          window.location.origin +
          '/dashboard'
      })
    }


    async function logout() {

      try {

        await keycloak.logout({
          redirectUri:
            window.location.origin +
            '/login'
        })

      } catch (logoutError) {

        console.error(
          'Logout failed:',
          logoutError
        )
      }
    }


    async function refreshToken() {

      if (!keycloak.authenticated) {
        return false
      }

      try {

        await keycloak.updateToken(
          30
        )

        setUser()

        return true

      } catch (refreshError) {

        console.error(
          'Unable to refresh token:',
          refreshError
        )

        authenticated.value =
          false

        user.value = null

        return false
      }
    }


    return {

      initialized,
      initializing,
      authenticated,
      user,
      error,

      isAuthenticated,
      userName,
      userEmail,

      initialize,
      login,
      loginWithGoogle,
      logout,
      refreshToken
    }
  })