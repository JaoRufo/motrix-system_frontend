import { apiConfig, getAuthHeader } from '../config/api'

class HttpClient {
  async request(endpoint, options = {}) {
    const url = `${apiConfig.baseURL}${endpoint}`
    const config = {
      ...options,
      headers: {
        ...apiConfig.headers,
        ...getAuthHeader(),
        ...options.headers,
      },
    }

    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      if ((response.status === 401 || response.status === 403) && localStorage.getItem('token')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
      throw {
        status: response.status,
        message: data.message || 'Usuário ou senha inválidos',
        data,
      }
    }

    return data
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  async downloadPDF(endpoint) {
    const url = `${apiConfig.baseURL}${endpoint}`
    const response = await fetch(url, {
      headers: getAuthHeader(),
    })

    if (!response.ok) throw new Error('Erro ao baixar PDF')

    return response.blob()
  }
}

export const http = new HttpClient()
