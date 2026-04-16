import { http } from '../utils/http'

export const ordemService = {
  async listar(page = 1, limit = 10) {
    return await http.get(`/ordens?page=${page}&limit=${limit}`)
  },

  async buscarPorId(id) {
    return await http.get(`/ordens/${id}`)
  },

  async buscarPorPlaca(placa) {
    return await http.get(`/ordens/veiculo/${placa.toUpperCase()}`)
  },

  async criar(ordemData) {
    const payload = {
      ordem: {
        ...ordemData.ordem,
        veiculo_placa: ordemData.ordem.veiculo_placa?.toUpperCase()
      },
      pecas: ordemData.pecas || [],
      maoObra: ordemData.maoObra || []
    }
    return await http.post('/ordens', payload)
  },

  async atualizar(id, ordemData) {
    const payload = {
      ordem: ordemData.ordem,
      pecas: ordemData.pecas || [],
      maoObra: ordemData.maoObra || []
    }
    return await http.put(`/ordens/${id}`, payload)
  },

  async excluir(id) {
    return await http.delete(`/ordens/${id}`)
  },

  async obterLinkWhatsApp(id) {
    return await http.get(`/ordens/${id}/whatsapp`)
  },

  async baixarPDF(id) {
    const blob = await http.downloadPDF(`/ordens/${id}/pdf`)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ordem-servico-${String(id).padStart(6, '0')}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  }
}
