# Tratamento de Erros - Oficina System

## Utilitário de Erros

O arquivo `src/utils/errorHandler.js` centraliza o tratamento de erros com mensagens amigáveis.

### Uso

```javascript
import { getErrorMessage } from '../../utils/errorHandler'

try {
  await service.metodo()
} catch (error) {
  $q.notify({ type: 'negative', message: getErrorMessage(error) })
}
```

### Mensagens por Código HTTP

- **Sem conexão**: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet."
- **401**: "Sessão expirada. Faça login novamente."
- **403**: "Você não tem permissão para realizar esta ação."
- **404**: "Registro não encontrado."
- **409**: "Este registro já existe no sistema."
- **422**: "Dados inválidos. Verifique os campos e tente novamente."
- **500**: "Erro no servidor. Tente novamente mais tarde."
- **Genérico**: Mensagem do backend ou "Ocorreu um erro inesperado."

## Arquivos Atualizados

✅ `src/pages/usuarios/UsuariosCadastro.vue`
✅ `src/pages/usuarios/UsuariosConsulta.vue`

## Arquivos que Precisam Atualização

Para aplicar o tratamento de erros nos demais arquivos, siga o padrão:

1. Importe o utilitário:
```javascript
import { getErrorMessage } from '../../utils/errorHandler'
```

2. Substitua blocos catch vazios ou com mensagens genéricas:
```javascript
// Antes
catch {
  $q.notify({ type: 'negative', message: 'Erro ao carregar' })
}

// Depois
catch (error) {
  $q.notify({ type: 'negative', message: getErrorMessage(error) })
}
```

## Arquivos Recomendados para Atualizar

- `src/pages/clientes/ClientesCadastro.vue`
- `src/pages/clientes/ClientesConsulta.vue`
- `src/pages/ordens/OrdemNova.vue`
- `src/pages/ordens/OrdemConsulta.vue`
- `src/pages/Login.vue`
