import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { authService } from '../services/authService'

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(),
    routes,
  })

  const publicRoutes = ['/login', '/forgot-password', '/reset-password']

  Router.beforeEach((to) => {
    const isAuthenticated = authService.isAuthenticated()

    if (!isAuthenticated && !publicRoutes.includes(to.path)) {
      return '/login'
    } else if (isAuthenticated && to.path === '/login') {
      return '/ordens'
    }
  })

  return Router
})
