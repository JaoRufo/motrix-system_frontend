import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { authService } from '../services/authService'

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(),
    routes,
  })

  Router.beforeEach((to, from, next) => {
    const isAuthenticated = authService.isAuthenticated()

    if (!isAuthenticated && to.path !== '/login') {
      next('/login')
    } else if (isAuthenticated && to.path === '/login') {
      next('/ordens')
    } else {
      next()
    }
  })

  return Router
})
