# 📐 Arquitetura do Sistema - Motrix System

## Visão Geral

O Motrix System segue uma arquitetura moderna baseada em componentes Vue 3 com Composition API, utilizando o Quasar Framework para UI e integração com API REST.

---

## 🏛️ Arquitetura em Camadas

```
┌─────────────────────────────────────────┐
│         Camada de Apresentação          │
│    (Components, Pages, Layouts)         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Camada de Lógica                │
│    (Composables, Services, Utils)       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Camada de Dados                 │
│    (API REST, LocalStorage)             │
└─────────────────────────────────────────┘
```

---

## 📦 Estrutura de Diretórios Detalhada

### `/src/pages/` - Páginas da Aplicação

Páginas são componentes de nível superior que representam rotas específicas.

#### Ordens de Serviço
- **OrdemConsulta.vue**: Listagem e gerenciamento de ordens
  - Paginação inteligente (10 itens por página)
  - Filtros: placa, número da OS, status
  - Ações: visualizar, editar, gerar PDF, excluir
  
- **OrdemNova.vue**: Criação e edição de ordens
  - Seleção de cliente e veículo
  - Adição de peças e mão de obra
  - Cálculo automático de valores
  - Validações em tempo real

#### Clientes
- **ClientesConsulta.vue**: Listagem de clientes
  - Filtros: nome, CPF, placa
  - Histórico completo de serviços
  - Visualização de múltiplos veículos
  
- **ClientesCadastro.vue**: Cadastro de clientes
  - Dados pessoais completos
  - Gerenciamento de veículos
  - Validação de CPF

#### Usuários
- **UsuariosConsulta.vue**: Gerenciamento de usuários
  - Filtros: nome, email, usuário, status
  - Controle de perfis (Admin/Usuário)
  - Proteção contra auto-exclusão
  
- **UsuariosCadastro.vue**: Cadastro de usuários
  - Criação de credenciais
  - Definição de permissões
  - Validações de segurança

#### Configurações
- **ConfiguracoesPage.vue**: Menu de configurações
- **ConfiguracoesOficina.vue**: Dados da oficina

#### Autenticação
- **LoginPage.vue**: Tela de login
  - Autenticação JWT
  - Validação de credenciais
  - Redirecionamento automático

---

### `/src/services/` - Camada de Serviços

Serviços encapsulam a lógica de comunicação com a API.

#### authService.js
```javascript
- login(username, password)
- register(userData)
- logout()
- getUser()
- isAuthenticated()
```

#### ordemService.js
```javascript
- listar(page, perPage)
- buscarPorId(id)
- criar(ordem)
- atualizar(id, ordem)
- excluir(id)
- baixarPDF(id)
```

#### clienteService.js
```javascript
- listar(page, perPage)
- buscarPorId(id)
- criar(cliente)
- atualizar(id, cliente)
- excluir(id)
- buscarHistorico(id)
```

#### usuarioService.js
```javascript
- listar(page, perPage)
- buscarPorId(id)
- criar(usuario)
- atualizar(id, usuario)
- excluir(id)
```

#### oficinaService.js
```javascript
- buscar()
- atualizar(dados)
- buscarMecanicos()
```

#### veiculoService.js
```javascript
- buscarPorCliente(clienteId)
- criar(veiculo)
- atualizar(id, veiculo)
- excluir(id)
```

---

### `/src/composables/` - Composables Vue

#### useApi.js
Composable para requisições HTTP com tratamento de erros.

```javascript
const { data, loading, error, execute } = useApi()
```

**Funcionalidades:**
- Gerenciamento de estado de loading
- Tratamento automático de erros
- Interceptors para autenticação
- Retry automático em caso de falha

---

### `/src/utils/` - Utilitários

#### http.js
Cliente HTTP baseado em fetch com interceptors.

**Funcionalidades:**
- Adiciona token JWT automaticamente
- Tratamento de erros HTTP
- Conversão de respostas
- Timeout configurável

#### errorHandler.js
Tratamento centralizado de erros.

```javascript
- getErrorMessage(error)
- handleApiError(error)
- showErrorNotification(error)
```

#### formatters.js
Funções de formatação de dados.

```javascript
- formatCPF(cpf)
- formatCNPJ(cnpj)
- formatPhone(phone)
- formatCurrency(value)
- formatDate(date)
```

---

### `/src/router/` - Roteamento

#### routes.js
Definição de todas as rotas da aplicação.

```javascript
/ (redirect para /ordens)
/login
/ordens
/ordens/nova/:id?
/clientes/cadastro/:id?
/clientes/consulta
/usuarios/cadastro/:id?
/usuarios/consulta
/configuracoes
/configuracoes/oficina
```

#### index.js
Configuração do Vue Router com guards de navegação.

**Guards:**
- Verificação de autenticação
- Redirecionamento para login
- Proteção de rotas privadas

---

### `/src/layouts/` - Layouts

#### MainLayout.vue
Layout principal da aplicação.

**Componentes:**
- Header com logo e informações do usuário
- Menu lateral (drawer) com navegação
- Área de conteúdo principal
- Footer (opcional)

**Funcionalidades:**
- Menu responsivo
- Indicador de usuário logado
- Logout
- Navegação entre módulos

---

### `/src/components/` - Componentes Reutilizáveis

#### `/components/clientes/`
Componentes específicos para o módulo de clientes.

#### `/components/ordens/`
Componentes específicos para ordens de serviço.

#### `/components/layout/`
Componentes de layout reutilizáveis.

---

## 🔄 Fluxo de Dados

### 1. Autenticação

```
LoginPage → authService.login()
    ↓
API REST (/auth/login)
    ↓
Token JWT armazenado no localStorage
    ↓
Redirecionamento para /ordens
```

### 2. Listagem de Dados (Exemplo: Ordens)

```
OrdemConsulta.vue (mounted)
    ↓
ordemService.listar(1, 9999)
    ↓
http.get('/ordens?page=1&perPage=9999')
    ↓
API REST retorna dados
    ↓
Dados armazenados em todasOrdens (ref)
    ↓
Filtros aplicados (computed)
    ↓
Paginação no frontend (slice)
    ↓
Exibição na q-table (10 itens por página)
```

### 3. Criação de Ordem de Serviço

```
OrdemNova.vue (formulário preenchido)
    ↓
Validações locais
    ↓
ordemService.criar(ordem)
    ↓
http.post('/ordens', ordem)
    ↓
API REST processa e retorna
    ↓
Notificação de sucesso
    ↓
Redirecionamento para /ordens
```

### 4. Filtros e Paginação

```
Usuário aplica filtro
    ↓
filtro.value atualizado (ref)
    ↓
ordensFiltradas recalculado (computed)
    ↓
watch detecta mudança
    ↓
pagination.page = 1
    ↓
atualizarPaginacao()
    ↓
ordens.value = slice dos dados filtrados
    ↓
q-table renderiza nova página
```

---

## 🔐 Segurança

### Autenticação JWT

1. **Login**: Usuário envia credenciais
2. **Token**: API retorna JWT
3. **Armazenamento**: Token salvo no localStorage
4. **Requisições**: Token enviado no header Authorization
5. **Expiração**: Token expira após período configurado
6. **Renovação**: Usuário precisa fazer login novamente

### Proteção de Rotas

```javascript
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !authService.isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})
```

### Controle de Permissões

- **Admin**: Acesso total ao sistema
- **Usuário**: Acesso limitado (sem gerenciar usuários)

---

## 📊 Gerenciamento de Estado

### Estado Local (ref/reactive)

Cada componente gerencia seu próprio estado local:

```javascript
const ordens = ref([])
const loading = ref(false)
const filtro = ref({ placa: '', status: '' })
```

### Estado Computado (computed)

Valores derivados calculados automaticamente:

```javascript
const ordensFiltradas = computed(() => {
  return ordens.value.filter(/* lógica de filtro */)
})
```

### Estado Persistente (localStorage)

Dados que precisam persistir entre sessões:

```javascript
- token (JWT)
- user (dados do usuário logado)
```

---

## 🎨 Padrões de Design Utilizados

### 1. Service Layer Pattern
Separação da lógica de API em serviços dedicados.

### 2. Composition API
Uso de composables para reutilização de lógica.

### 3. Single Responsibility Principle
Cada componente/serviço tem uma responsabilidade única.

### 4. DRY (Don't Repeat Yourself)
Reutilização de código através de composables e utils.

### 5. Separation of Concerns
Separação clara entre apresentação, lógica e dados.

---

## 🚀 Performance

### Otimizações Implementadas

1. **Lazy Loading de Rotas**
   ```javascript
   component: () => import('pages/OrdemConsulta.vue')
   ```

2. **Paginação Frontend**
   - Carrega todos os dados uma vez
   - Pagina no cliente (10 itens por página)
   - Evita múltiplas requisições

3. **Computed Properties**
   - Cache automático de valores calculados
   - Recalcula apenas quando dependências mudam

4. **Debounce em Filtros**
   - Evita requisições excessivas
   - Melhora experiência do usuário

5. **Build Otimizado**
   - Tree shaking
   - Code splitting
   - Minificação
   - Compressão

---

## 🧪 Testabilidade

### Estrutura Testável

- **Serviços isolados**: Fácil de mockar
- **Composables puros**: Testáveis independentemente
- **Componentes desacoplados**: Testáveis em isolamento

### Exemplo de Teste (Jest)

```javascript
import { ordemService } from '@/services/ordemService'

describe('ordemService', () => {
  it('deve listar ordens', async () => {
    const ordens = await ordemService.listar(1, 10)
    expect(ordens).toBeDefined()
    expect(Array.isArray(ordens.data)).toBe(true)
  })
})
```

---

## 📱 Responsividade

### Breakpoints Quasar

- **xs**: < 600px (mobile)
- **sm**: 600px - 1023px (tablet)
- **md**: 1024px - 1439px (desktop pequeno)
- **lg**: 1440px - 1919px (desktop)
- **xl**: > 1920px (desktop grande)

### Estratégias

1. **Grid System**: Uso de col-12, col-md-6, etc.
2. **Menu Responsivo**: Drawer que se adapta ao tamanho
3. **Tabelas**: Scroll horizontal em telas pequenas
4. **Formulários**: Campos empilhados em mobile

---

## 🔧 Manutenibilidade

### Convenções de Código

1. **Nomenclatura**
   - Componentes: PascalCase (OrdemConsulta.vue)
   - Serviços: camelCase (ordemService.js)
   - Variáveis: camelCase (ordensFiltradas)

2. **Estrutura de Componentes**
   ```vue
   <template>...</template>
   <script setup>...</script>
   <style scoped>...</style>
   ```

3. **Comentários**
   - Documentar lógica complexa
   - Explicar decisões de design
   - Manter atualizado

4. **Versionamento**
   - Commits descritivos
   - Branches por feature
   - Pull requests com revisão

---

## 📈 Escalabilidade

### Preparado para Crescimento

1. **Modular**: Fácil adicionar novos módulos
2. **Extensível**: Serviços podem ser estendidos
3. **Configurável**: Variáveis de ambiente
4. **Documentado**: Código bem documentado

### Próximos Passos

- [ ] Implementar testes automatizados
- [ ] Adicionar PWA (Progressive Web App)
- [ ] Implementar cache de dados
- [ ] Adicionar modo offline
- [ ] Implementar notificações push
- [ ] Adicionar dashboard com gráficos
- [ ] Implementar relatórios avançados
- [ ] Adicionar integração com WhatsApp

---

**Documentação mantida por:** João Rufo  
**Última atualização:** 2024
