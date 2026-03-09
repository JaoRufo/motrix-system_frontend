import { http } from '../utils/http'

export const oficinaService = {
  async buscar() {
    return await http.get('/oficinas')
  },

  async buscarMecanicos() {
    return await http.get('/usuarios/mecanicos')
  },

  async atualizar(id, oficina) {
    return await http.put(`/oficinas/${id}`, oficina)
  }
}
