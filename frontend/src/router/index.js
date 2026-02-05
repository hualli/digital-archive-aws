import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import AdminSearch from '../views/AdminSearch.vue'
import SuperAdminStats from '../views/SuperAdminStats.vue'

const routes = [
  { 
    path: '/', 
    name: 'Login',
    component: Login 
  },
  { 
    path: '/search', 
    name: 'AdminSearch',
    component: AdminSearch 
  },
  { 
    path: '/stats', 
    name: 'SuperAdminStats',
    component: SuperAdminStats 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router