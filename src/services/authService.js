import { http } from '../utils/http'

export const authService = {
  async login(username, password) {
    const data = await http.post('/auth/login', { username, password })

    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    return data
  },

  async register(userData) {
    return await http.post('/auth/register', userData)
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  async forgotPassword(email) {
    return await http.post('/auth/forgot-password', { email })
  },

  async validateResetToken(token) {
    return await http.get(`/auth/reset-password/validate?token=${token}`)
  },

  async resetPassword(token, novaSenha) {
    return await http.post('/auth/reset-password', { token, novaSenha })
  },
}
