import { http } from '../utils/http'

export const veiculoService = {
  async atualizar(id, veiculo) {
    const payload = {
      ...veiculo,
      placa: veiculo.placa?.toUpperCase(),
      chassi: veiculo.chassi?.toUpperCase()
    }
    return await http.put(`/veiculos/${id}`, payload)
  },

  async excluir(id) {
    return await http.delete(`/veiculos/${id}`)
  }
}
