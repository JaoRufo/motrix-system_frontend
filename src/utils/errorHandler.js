export function getErrorMessage(error) {
  // Erro de rede
  if (!error.status && error.message === 'Failed to fetch') {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
  }

  // Erro 401 - Não autorizado
  if (error.status === 401) {
    return 'Sessão expirada. Faça login novamente.'
  }

  // Erro 403 - Sem permissão
  if (error.status === 403) {
    return 'Você não tem permissão para realizar esta ação.'
  }

  // Erro 404 - Não encontrado
  if (error.status === 404) {
    return 'Registro não encontrado.'
  }

  // Erro 409 - Conflito (duplicado)
  if (error.status === 409) {
    return error.message || 'Este registro já existe no sistema.'
  }

  // Erro 422 - Validação
  if (error.status === 422) {
    return error.message || 'Dados inválidos. Verifique os campos e tente novamente.'
  }

  // Erro 500 - Erro do servidor
  if (error.status === 500) {
    return 'Erro no servidor. Tente novamente mais tarde.'
  }

  // Erro com mensagem do backend
  if (error.message) {
    return error.message
  }

  // Erro genérico
  return 'Ocorreu um erro inesperado. Tente novamente.'
}
