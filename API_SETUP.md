# Integração API Motrix - Guia Rápido

## ✅ Arquivos Criados

### Configuração
- `src/config/api.js` - Configuração base da API
- `.env` - Variáveis de ambiente
- `.env.example` - Exemplo de configuração

### Utilitários
- `src/utils/http.js` - Cliente HTTP com interceptors

### Services
- `src/services/authService.js` - Autenticação (login/register/logout)
- `src/services/clienteService.js` - CRUD de clientes
- `src/services/veiculoService.js` - CRUD de veículos
- `src/services/ordemService.js` - CRUD de ordens + PDF
- `src/services/usuarioService.js` - CRUD de usuários (Admin)

### Composables
- `src/composables/useApi.js` - Hook para facilitar chamadas API

### Documentação
- `API_INTEGRATION.md` - Documentação completa
- `src/examples/service-usage-examples.js` - Exemplos de uso

## 🚀 Como Usar

### 1. Configurar URL da API

Edite o arquivo `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Usar nos Componentes

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { clienteService } from '@/services/clienteService'

const clientes = ref([])
const loading = ref(false)

async function carregarClientes() {
  loading.value = true
  try {
    clientes.value = await clienteService.listar()
  } catch (error) {
    console.error(error.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  carregarClientes()
})
</script>
```

## 📋 Services Disponíveis

### authService
- `login(username, password)` - Login
- `register(userData)` - Registro
- `logout()` - Logout
- `isAuthenticated()` - Verifica autenticação
- `getUser()` - Retorna usuário logado

### clienteService
- `listar()` - Lista todos
- `buscarPorId(id)` - Busca por ID
- `criar(clienteData)` - Cria cliente com veículos
- `atualizar(id, cliente)` - Atualiza cliente
- `excluir(id)` - Exclui cliente
- `buscarHistorico(id)` - Histórico de ordens

### veiculoService
- `atualizar(id, veiculo)` - Atualiza veículo
- `excluir(id)` - Exclui veículo

### ordemService
- `listar()` - Lista todas
- `buscarPorId(id)` - Busca por ID
- `buscarPorPlaca(placa)` - Busca por placa
- `criar(ordemData)` - Cria ordem
- `atualizar(id, ordemData)` - Atualiza ordem
- `excluir(id)` - Exclui ordem
- `baixarPDF(id)` - Baixa PDF

### usuarioService (Admin)
- `listar()` - Lista todos
- `buscarPorId(id)` - Busca por ID
- `criar(usuario)` - Cria usuário
- `atualizar(id, usuario)` - Atualiza usuário
- `excluir(id)` - Exclui usuário

## 🔐 Autenticação

O token é gerenciado automaticamente:
- Salvo no localStorage após login
- Incluído em todas as requisições
- Redirecionamento automático para login em caso de erro 401

## ⚙️ Funcionalidades Automáticas

- **Placa e Chassi**: Convertidos para MAIÚSCULO
- **Token**: Incluído automaticamente nos headers
- **Erros 401**: Logout e redirecionamento automático
- **Notificações**: Integradas com Quasar Notify

## 📝 Próximos Passos

1. Atualizar componentes existentes para usar os services
2. Substituir localStorage por chamadas API
3. Testar integração com backend
4. Ajustar tratamento de erros conforme necessário

Veja `API_INTEGRATION.md` para documentação completa.
