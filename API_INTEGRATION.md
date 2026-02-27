# Integração API Motrix

## Estrutura de Arquivos

```
src/
├── config/
│   └── api.js              # Configuração base da API
├── services/
│   ├── authService.js      # Autenticação
│   ├── clienteService.js   # Clientes
│   ├── veiculoService.js   # Veículos
│   ├── ordemService.js     # Ordens de Serviço
│   └── usuarioService.js   # Usuários (Admin)
└── utils/
    └── http.js             # Cliente HTTP
```

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
```

## Services

### authService

```javascript
import { authService } from '@/services/authService'

// Login
await authService.login('admin', 'admin123')

// Registro
await authService.register({
  name: 'Nome',
  username: 'usuario',
  email: 'email@email.com',
  password: 'senha123',
  role: 'user'
})

// Logout
authService.logout()

// Verificar autenticação
authService.isAuthenticated()

// Obter usuário logado
authService.getUser()
```

### clienteService

```javascript
import { clienteService } from '@/services/clienteService'

// Listar todos
const clientes = await clienteService.listar()

// Buscar por ID
const cliente = await clienteService.buscarPorId(1)

// Criar cliente com veículos
await clienteService.criar({
  cliente: {
    nome: 'João Silva',
    cpf: '123.456.789-00',
    telefone: '(11) 98765-4321',
    email: 'joao@email.com',
    endereco: 'Rua ABC, 123'
  },
  veiculos: [{
    placa: 'ABC-1234',
    modelo: 'Fiat Uno',
    ano: '2015',
    chassi: 'abc123xyz',
    cor: 'Branco',
    km_atual: 50000
  }]
})

// Atualizar
await clienteService.atualizar(1, {
  nome: 'João Silva',
  telefone: '(11) 99999-9999'
})

// Excluir
await clienteService.excluir(1)

// Histórico
const historico = await clienteService.buscarHistorico(1)
```

### veiculoService

```javascript
import { veiculoService } from '@/services/veiculoService'

// Atualizar
await veiculoService.atualizar(1, {
  placa: 'ABC-1234',
  modelo: 'Fiat Uno',
  ano: '2015',
  chassi: 'abc123xyz',
  cor: 'Preto',
  km_atual: 55000
})

// Excluir
await veiculoService.excluir(1)
```

### ordemService

```javascript
import { ordemService } from '@/services/ordemService'

// Listar todas
const ordens = await ordemService.listar()

// Buscar por ID
const ordem = await ordemService.buscarPorId(1)

// Buscar por placa
const ordens = await ordemService.buscarPorPlaca('ABC-1234')

// Criar
await ordemService.criar({
  ordem: {
    cliente_id: 1,
    veiculo_id: 1,
    veiculo_placa: 'ABC-1234',
    km_atual: 51000,
    status: 'Aberta',
    descricao_problema: 'Troca de óleo',
    observacoes: 'Cliente solicitou revisão'
  },
  pecas: [{
    nome: 'Óleo 5W30',
    valor: 150.00
  }],
  maoObra: [{
    descricao: 'Troca de óleo',
    valor: 80.00
  }]
})

// Atualizar
await ordemService.atualizar(1, {
  ordem: {
    status: 'Finalizada',
    km_atual: 52000
  },
  pecas: [...],
  maoObra: [...]
})

// Excluir
await ordemService.excluir(1)

// Baixar PDF
await ordemService.baixarPDF(1)
```

### usuarioService (Admin)

```javascript
import { usuarioService } from '@/services/usuarioService'

// Listar todos
const usuarios = await usuarioService.listar()

// Buscar por ID
const usuario = await usuarioService.buscarPorId(1)

// Criar
await usuarioService.criar({
  name: 'Nome',
  username: 'usuario',
  email: 'email@email.com',
  password: 'senha123',
  role: 'user',
  is_active: true
})

// Atualizar
await usuarioService.atualizar(1, {
  name: 'Nome Atualizado',
  email: 'novo@email.com',
  is_active: false
})

// Excluir
await usuarioService.excluir(1)
```

## Tratamento de Erros

Todos os services retornam erros no formato:

```javascript
{
  status: 401,
  message: 'Não autorizado',
  data: {...}
}
```

### Exemplo de uso com try/catch:

```javascript
try {
  const clientes = await clienteService.listar()
} catch (error) {
  console.error(error.message)
  
  // Notificação Quasar
  Notify.create({
    type: 'negative',
    message: error.message,
    position: 'top'
  })
}
```

## Autenticação Automática

O token é automaticamente:
- Salvo no localStorage após login
- Incluído em todas as requisições via header `Authorization: Bearer {token}`
- Removido e redirecionado para login em caso de erro 401

## Status de Ordem

- Aberta
- Em Andamento
- Aguardando Orçamento
- Finalizada
- Cancelada

## Observações Importantes

1. **Placa e Chassi**: Sempre convertidos para MAIÚSCULO automaticamente
2. **Status Cancelada**: Requer campo `motivo_cancelamento`
3. **Total da Ordem**: Calculado automaticamente pela API
4. **KM do Veículo**: Atualizado automaticamente ao finalizar/cancelar ordem
5. **Token**: Todas as rotas (exceto auth) requerem token de autenticação
