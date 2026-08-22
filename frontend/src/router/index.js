import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },

  {
    path: '/',
    component: AppLayout,

    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue')
      },

      {
        path: 'transactions',
        name: 'transactions',
        component: () => import('../views/Transactions.vue')
      },

      {
        path: 'categories',
        name: 'categories',
        component: () => import('../views/Categories.vue')
      },

      {
        path: 'budget',
        name: 'budget',
        component: () => import('../views/Budget.vue')
      },

      {
        path: 'subscriptions',
        name: 'subscriptions',
        component: () => import('../views/Subscriptions.vue')
      },

      {
        path: 'reports',
        name: 'reports',
        component: () => import('../views/Reports.vue')
      },

      {
        path: 'profile',
        name: 'profile',
        component: () => import('../views/Profile.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router