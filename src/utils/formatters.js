export function formatarPlaca(placa) {
  if (!placa) return ''
  
  // Remove tudo que não é letra ou número
  const limpa = placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  
  // Formato antigo: ABC1234 -> ABC-1234
  // Formato Mercosul: ABC1D23 -> ABC-1D23
  if (limpa.length <= 7) {
    return limpa.replace(/^([A-Z]{3})([0-9A-Z]{1,4})$/, '$1-$2')
  }
  
  return limpa.substring(0, 7).replace(/^([A-Z]{3})([0-9A-Z]{4})$/, '$1-$2')
}
