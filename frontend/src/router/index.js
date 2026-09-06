import {
  createRouter,
  createWebHistory
} from 'vue-router'

import AppLayout
  from '../components/layout/AppLayout.vue'

import {
  useAuthStore
} from '../stores/auth'


const routes = [

  /*
   * Public login page
   */
  {
    path: '/login',
    name: 'login',
    component: () =>
      import('../views/Login.vue')
  },


  /*
   * Default route
   */
  {
    path: '/',
    redirect: '/dashboard'
  },


  /*
   * Protected application
   */
  {
    path: '/',
    component: AppLayout,

    meta: {
      requiresAuth: true
    },

    children: [

      {
        path: 'dashboard',
        name: 'dashboard',
        component: () =>
          import('../views/Dashboard.vue')
      },

      {
        path: 'transactions',
        name: 'transactions',
        component: () =>
          import('../views/Transactions.vue')
      },

      {
        path: 'categories',
        name: 'categories',
        component: () =>
          import('../views/Categories.vue')
      },

      {
        path: 'budget',
        name: 'budget',
        component: () =>
          import('../views/Budget.vue')
      },

      {
        path: 'subscriptions',
        name: 'subscriptions',
        component: () =>
          import('../views/Subscriptions.vue')
      },

      {
        path: 'reports',
        name: 'reports',
        component: () =>
          import('../views/Reports.vue')
      },

      {
        path: 'profile',
        name: 'profile',
        component: () =>
          import('../views/Profile.vue')
      },

      {
        path: 'settings',
        name: 'settings',
        component: () =>
          import('../views/Settings.vue')
      }

    ]
  }

]


const router =
  createRouter({

    history:
      createWebHistory(),

    routes

  })


router.beforeEach((to) => {

  const auth =
    useAuthStore()


  /*
   * Protected page
   */
  if (
    to.meta.requiresAuth &&
    !auth.isAuthenticated
  ) {

    return {
      name: 'login',

      query: {
        redirect:
          to.fullPath
      }
    }

  }


  /*
   * Already logged-in user
   * should not see login page.
   */
  if (
    to.name === 'login' &&
    auth.isAuthenticated
  ) {

    return {
      name: 'dashboard'
    }

  }

})


export default router