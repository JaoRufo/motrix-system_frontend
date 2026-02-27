import { http } from '../utils/http'

export const clienteService = {
  async listar() {
    return await http.get('/clientes')
  },

  async buscarPorId(id) {
    return await http.get(`/clientes/${id}`)
  },

  async criar(clienteData) {
    const payload = {
      cliente: clienteData.cliente,
      veiculos: clienteData.veiculos?.map(v => ({
        ...v,
        placa: v.placa?.toUpperCase(),
        chassi: v.chassi?.toUpperCase()
      })) || []
    }
    return await http.post('/clientes', payload)
  },

  async atualizar(id, cliente) {
    return await http.put(`/clientes/${id}`, cliente)
  },

  async excluir(id) {
    return await http.delete(`/clientes/${id}`)
  },

  async buscarHistorico(id) {
    return await http.get(`/clientes/${id}/historico`)
  }
}
