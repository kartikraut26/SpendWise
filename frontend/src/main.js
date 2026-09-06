import {
  createApp
} from 'vue'

import {
  createPinia
} from 'pinia'

import './style.css'

import App from './App.vue'

import router from './router'

import {
  useAuthStore
} from './stores/auth'


async function bootstrap() {

  const app =
    createApp(App)

  const pinia =
    createPinia()

  app.use(pinia)


  const auth =
    useAuthStore(pinia)


  await auth.initialize()


  app.use(router)


  app.mount('#app')
}


bootstrap()