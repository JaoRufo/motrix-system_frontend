import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(),
    routes,
  })

  Router.beforeEach((to, from, next) => {
    const user = localStorage.getItem('user')

    if (!user && to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  })

  return Router
})
