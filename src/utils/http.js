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

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Erro na requisição',
          data,
        }
      }

      return data
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
      throw error
    }
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
