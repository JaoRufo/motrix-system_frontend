export const clienteService = {
  listar() {
    return JSON.parse(localStorage.getItem('clientes') || '[]')
  },

  salvar(cliente) {
    const clientes = this.listar()
    clientes.push({ ...cliente, id: Date.now() })
    localStorage.setItem('clientes', JSON.stringify(clientes))
    return true
  },

  atualizar(id, cliente) {
    const clientes = this.listar()
    const index = clientes.findIndex((c) => c.id == id)
    if (index !== -1) {
      clientes[index] = { ...cliente, id: parseInt(id) }
      localStorage.setItem('clientes', JSON.stringify(clientes))
      return true
    }
    return false
  },

  buscarPorId(id) {
    return this.listar().find((c) => c.id == id)
  },

  excluir(id) {
    const clientes = this.listar().filter((c) => c.id != id)
    localStorage.setItem('clientes', JSON.stringify(clientes))
    return true
  },
}
