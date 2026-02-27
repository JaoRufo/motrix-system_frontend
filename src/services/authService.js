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
  }
}
