import { http } from '../utils/http'

export const usuarioService = {
  async listar() {
    return await http.get('/usuarios')
  },

  async buscarPorId(id) {
    return await http.get(`/usuarios/${id}`)
  },

  async criar(usuario) {
    return await http.post('/usuarios', usuario)
  },

  async atualizar(id, usuario) {
    return await http.put(`/usuarios/${id}`, usuario)
  },

  async excluir(id) {
    return await http.delete(`/usuarios/${id}`)
  }
}
