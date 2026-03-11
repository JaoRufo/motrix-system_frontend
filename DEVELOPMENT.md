# 👨‍💻 Guia de Desenvolvimento - Motrix System

Este guia fornece informações detalhadas para desenvolvedores que desejam contribuir ou entender melhor o projeto.

---

## 📋 Índice

- [Configuração do Ambiente](#configuração-do-ambiente)
- [Estrutura de Código](#estrutura-de-código)
- [Padrões e Convenções](#padrões-e-convenções)
- [Criando Novos Módulos](#criando-novos-módulos)
- [Trabalhando com a API](#trabalhando-com-a-api)
- [Componentes Quasar](#componentes-quasar)
- [Debugging](#debugging)
- [Boas Práticas](#boas-práticas)

---

## 🛠️ Configuração do Ambiente

### 1. Ferramentas Recomendadas

#### Editor de Código
- **VS Code** (recomendado)
  - Extensões essenciais:
    - Volar (Vue Language Features)
    - ESLint
    - Prettier
    - Quasar Snippets

#### Navegador
- **Chrome** ou **Firefox** com Vue DevTools

### 2. Configuração do VS Code

Crie `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "vue"
  ]
}
```

### 3. Instalação e Setup

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/oficina-system.git
cd oficina-system

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 📁 Estrutura de Código

### Anatomia de um Componente Vue

```vue
<template>
  <!-- Template HTML -->
  <q-page class="q-pa-md">
    <div class="text-h6">{{ titulo }}</div>
    <q-btn @click="handleClick">Clique aqui</q-btn>
  </q-page>
</template>

<script setup>
// Imports
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { meuService } from 'src/services/meuService'

// Composables
const $q = useQuasar()

// Estado reativo
const titulo = ref('Meu Componente')
const dados = ref([])
const loading = ref(false)

// Computed properties
const dadosFiltrados = computed(() => {
  return dados.value.filter(/* lógica */)
})

// Métodos
async function carregar() {
  loading.value = true
  try {
    dados.value = await meuService.listar()
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar' })
  } finally {
    loading.value = false
  }
}

function handleClick() {
  // Lógica do clique
}

// Lifecycle hooks
onMounted(() => {
  carregar()
})
</script>

<style scoped>
/* Estilos específicos do componente */
.minha-classe {
  color: blue;
}
</style>
```

### Anatomia de um Service

```javascript
// src/services/meuService.js
import { http } from '../utils/http'

export const meuService = {
  /**
   * Lista todos os itens
   * @param {number} page - Número da página
   * @param {number} perPage - Itens por página
   * @returns {Promise<Object>} Dados paginados
   */
  async listar(page = 1, perPage = 10) {
    return await http.get(`/meus-itens?page=${page}&perPage=${perPage}`)
  },

  /**
   * Busca um item por ID
   * @param {number} id - ID do item
   * @returns {Promise<Object>} Item encontrado
   */
  async buscarPorId(id) {
    return await http.get(`/meus-itens/${id}`)
  },

  /**
   * Cria um novo item
   * @param {Object} dados - Dados do item
   * @returns {Promise<Object>} Item criado
   */
  async criar(dados) {
    return await http.post('/meus-itens', dados)
  },

  /**
   * Atualiza um item existente
   * @param {number} id - ID do item
   * @param {Object} dados - Novos dados
   * @returns {Promise<Object>} Item atualizado
   */
  async atualizar(id, dados) {
    return await http.put(`/meus-itens/${id}`, dados)
  },

  /**
   * Exclui um item
   * @param {number} id - ID do item
   * @returns {Promise<void>}
   */
  async excluir(id) {
    return await http.delete(`/meus-itens/${id}`)
  }
}
```

---

## 📏 Padrões e Convenções

### Nomenclatura

#### Arquivos
- **Componentes**: PascalCase - `MeuComponente.vue`
- **Serviços**: camelCase - `meuService.js`
- **Utilitários**: camelCase - `formatters.js`
- **Páginas**: PascalCase - `MinhaPage.vue`

#### Variáveis e Funções
```javascript
// Variáveis: camelCase
const minhaVariavel = 'valor'
const dadosUsuario = {}

// Constantes: UPPER_SNAKE_CASE
const API_URL = 'http://api.com'
const MAX_ITEMS = 100

// Funções: camelCase com verbo
function buscarDados() {}
function atualizarUsuario() {}
function validarFormulario() {}

// Booleans: prefixo is/has/should
const isLoading = ref(false)
const hasError = ref(false)
const shouldShow = computed(() => true)
```

#### Componentes
```javascript
// Props: camelCase
defineProps({
  userId: Number,
  userName: String,
  isActive: Boolean
})

// Events: kebab-case
emit('update-user', userData)
emit('item-selected', item)
```

### Estrutura de Imports

```javascript
// 1. Vue core
import { ref, computed, onMounted, watch } from 'vue'

// 2. Vue Router
import { useRouter, useRoute } from 'vue-router'

// 3. Quasar
import { useQuasar } from 'quasar'

// 4. Services
import { meuService } from 'src/services/meuService'

// 5. Utils
import { formatCPF } from 'src/utils/formatters'

// 6. Componentes locais
import MeuComponente from './MeuComponente.vue'
```

### Comentários

```javascript
// ✅ BOM: Explica o "porquê"
// Carrega todos os dados de uma vez para permitir filtros em todas as páginas
const response = await service.listar(1, 9999)

// ❌ RUIM: Explica o "o quê" (óbvio)
// Atribui a resposta para a variável dados
const dados = response

// ✅ BOM: Documenta função complexa
/**
 * Calcula o valor total da ordem de serviço
 * incluindo peças e mão de obra com desconto aplicado
 * @param {Array} pecas - Lista de peças
 * @param {Array} maoObra - Lista de serviços
 * @param {number} desconto - Percentual de desconto (0-100)
 * @returns {number} Valor total calculado
 */
function calcularTotal(pecas, maoObra, desconto) {
  // implementação
}
```

---

## 🆕 Criando Novos Módulos

### Passo a Passo: Criar Módulo "Fornecedores"

#### 1. Criar Service

```javascript
// src/services/fornecedorService.js
import { http } from '../utils/http'

export const fornecedorService = {
  async listar(page = 1, perPage = 10) {
    return await http.get(`/fornecedores?page=${page}&perPage=${perPage}`)
  },

  async buscarPorId(id) {
    return await http.get(`/fornecedores/${id}`)
  },

  async criar(fornecedor) {
    return await http.post('/fornecedores', fornecedor)
  },

  async atualizar(id, fornecedor) {
    return await http.put(`/fornecedores/${id}`, fornecedor)
  },

  async excluir(id) {
    return await http.delete(`/fornecedores/${id}`)
  }
}
```

#### 2. Criar Páginas

```vue
<!-- src/pages/fornecedores/FornecedoresConsulta.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h6 text-weight-bold">Fornecedores</div>
      <q-space />
      <q-btn 
        label="Novo Fornecedor" 
        color="primary" 
        icon="add" 
        to="/fornecedores/cadastro"
      />
    </div>

    <q-card flat bordered>
      <q-table
        :rows="fornecedores"
        :columns="columns"
        row-key="id"
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { fornecedorService } from 'src/services/fornecedorService'

const $q = useQuasar()
const fornecedores = ref([])
const loading = ref(false)
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const columns = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'cnpj', label: 'CNPJ', field: 'cnpj', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'acoes', label: 'Ações', align: 'center' }
]

async function carregar() {
  loading.value = true
  try {
    const response = await fornecedorService.listar(
      pagination.value.page,
      pagination.value.rowsPerPage
    )
    fornecedores.value = response.data
    pagination.value.rowsNumber = response.total
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar fornecedores' })
  } finally {
    loading.value = false
  }
}

function onRequest(props) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  carregar()
}

onMounted(() => {
  carregar()
})
</script>
```

```vue
<!-- src/pages/fornecedores/FornecedoresCadastro.vue -->
<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">
          {{ isEdicao ? 'Editar' : 'Novo' }} Fornecedor
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="salvar">
          <q-input
            v-model="form.nome"
            label="Nome *"
            outlined
            :rules="[val => !!val || 'Campo obrigatório']"
          />

          <q-input
            v-model="form.cnpj"
            label="CNPJ *"
            outlined
            mask="##.###.###/####-##"
            :rules="[val => !!val || 'Campo obrigatório']"
          />

          <q-input
            v-model="form.telefone"
            label="Telefone"
            outlined
            mask="(##) #####-####"
          />

          <div class="row q-gutter-sm q-mt-md">
            <q-btn label="Cancelar" flat @click="voltar" />
            <q-btn label="Salvar" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { fornecedorService } from 'src/services/fornecedorService'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const form = ref({
  nome: '',
  cnpj: '',
  telefone: ''
})

const isEdicao = ref(false)

async function carregar() {
  if (route.params.id) {
    isEdicao.value = true
    try {
      const fornecedor = await fornecedorService.buscarPorId(route.params.id)
      form.value = fornecedor
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Erro ao carregar fornecedor' })
    }
  }
}

async function salvar() {
  try {
    if (isEdicao.value) {
      await fornecedorService.atualizar(route.params.id, form.value)
      $q.notify({ type: 'positive', message: 'Fornecedor atualizado!' })
    } else {
      await fornecedorService.criar(form.value)
      $q.notify({ type: 'positive', message: 'Fornecedor cadastrado!' })
    }
    voltar()
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao salvar fornecedor' })
  }
}

function voltar() {
  router.push('/fornecedores')
}

onMounted(() => {
  carregar()
})
</script>
```

#### 3. Adicionar Rotas

```javascript
// src/router/routes.js
{
  path: '/fornecedores',
  component: () => import('pages/fornecedores/FornecedoresConsulta.vue'),
},
{
  path: '/fornecedores/cadastro/:id?',
  component: () => import('pages/fornecedores/FornecedoresCadastro.vue'),
}
```

#### 4. Adicionar ao Menu

```vue
<!-- src/layouts/MainLayout.vue -->
<q-item clickable to="/fornecedores">
  <q-item-section avatar>
    <q-icon name="business" />
  </q-item-section>
  <q-item-section>
    <q-item-label>Fornecedores</q-item-label>
  </q-item-section>
</q-item>
```

---

## 🌐 Trabalhando com a API

### Fazendo Requisições

```javascript
// GET simples
const dados = await http.get('/endpoint')

// GET com parâmetros
const dados = await http.get('/endpoint', { 
  params: { page: 1, search: 'termo' } 
})

// POST
const resultado = await http.post('/endpoint', { 
  nome: 'Valor',
  email: 'email@example.com'
})

// PUT
const atualizado = await http.put('/endpoint/123', dados)

// DELETE
await http.delete('/endpoint/123')
```

### Tratamento de Erros

```javascript
try {
  const dados = await meuService.buscar()
} catch (error) {
  // Error já foi tratado pelo http.js
  // Apenas exiba notificação ao usuário
  $q.notify({
    type: 'negative',
    message: error.message || 'Erro ao buscar dados'
  })
}
```

### Upload de Arquivos

```javascript
async function uploadArquivo(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  return await http.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
```

### Download de Arquivos

```javascript
async function baixarPDF(id) {
  try {
    const response = await fetch(`${API_URL}/ordens/${id}/pdf`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ordem-${id}.pdf`
    a.click()
  } catch (error) {
    console.error('Erro ao baixar PDF:', error)
  }
}
```

---

## 🎨 Componentes Quasar

### Componentes Mais Usados

#### QTable - Tabelas

```vue
<q-table
  :rows="dados"
  :columns="columns"
  row-key="id"
  :loading="loading"
  v-model:pagination="pagination"
  @request="onRequest"
  :rows-per-page-options="[10, 25, 50]"
>
  <template v-slot:body-cell-acoes="props">
    <q-td>
      <q-btn icon="edit" flat round @click="editar(props.row)" />
      <q-btn icon="delete" flat round @click="excluir(props.row.id)" />
    </q-td>
  </template>
</q-table>
```

#### QForm - Formulários

```vue
<q-form @submit="salvar" @reset="limpar">
  <q-input
    v-model="form.nome"
    label="Nome *"
    outlined
    :rules="[
      val => !!val || 'Campo obrigatório',
      val => val.length >= 3 || 'Mínimo 3 caracteres'
    ]"
  />
  
  <q-select
    v-model="form.tipo"
    :options="['Tipo 1', 'Tipo 2']"
    label="Tipo"
    outlined
  />
  
  <div class="q-gutter-sm">
    <q-btn label="Salvar" type="submit" color="primary" />
    <q-btn label="Limpar" type="reset" flat />
  </div>
</q-form>
```

#### QDialog - Modais

```vue
<q-dialog v-model="dialogAberto">
  <q-card style="min-width: 400px">
    <q-card-section>
      <div class="text-h6">Título do Modal</div>
    </q-card-section>
    
    <q-card-section>
      Conteúdo do modal
    </q-card-section>
    
    <q-card-actions align="right">
      <q-btn label="Cancelar" flat v-close-popup />
      <q-btn label="Confirmar" color="primary" @click="confirmar" />
    </q-card-actions>
  </q-card>
</q-dialog>
```

#### Notificações

```javascript
// Sucesso
$q.notify({
  type: 'positive',
  message: 'Operação realizada com sucesso!'
})

// Erro
$q.notify({
  type: 'negative',
  message: 'Erro ao realizar operação'
})

// Aviso
$q.notify({
  type: 'warning',
  message: 'Atenção: verifique os dados'
})

// Info
$q.notify({
  type: 'info',
  message: 'Informação importante'
})
```

#### Dialog de Confirmação

```javascript
$q.dialog({
  title: 'Confirmar',
  message: 'Deseja realmente excluir?',
  cancel: { label: 'Cancelar', flat: true },
  ok: { label: 'Excluir', color: 'negative' }
}).onOk(() => {
  // Usuário confirmou
  excluirItem()
})
```

---

## 🐛 Debugging

### Vue DevTools

1. Instale a extensão Vue DevTools no navegador
2. Abra o DevTools (F12)
3. Vá para a aba "Vue"
4. Inspecione componentes, estado e eventos

### Console Logging

```javascript
// Debug simples
console.log('Valor:', minhaVariavel)

// Debug de objetos
console.table(arrayDeObjetos)

// Debug com grupo
console.group('Meu Grupo')
console.log('Item 1')
console.log('Item 2')
console.groupEnd()

// Debug condicional
if (process.env.DEV) {
  console.log('Apenas em desenvolvimento')
}
```

### Breakpoints

```javascript
// Adicione debugger para pausar a execução
function minhaFuncao() {
  debugger // Execução pausa aqui
  // resto do código
}
```

### Network Tab

Use a aba Network do DevTools para:
- Ver todas as requisições HTTP
- Verificar headers e payloads
- Analisar tempos de resposta
- Debugar erros de API

---

## ✅ Boas Práticas

### 1. Sempre use Composition API

```javascript
// ✅ BOM
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

// ❌ EVITE Options API
<script>
export default {
  data() {
    return { count: 0 }
  }
}
</script>
```

### 2. Extraia lógica complexa para composables

```javascript
// composables/useOrdemForm.js
export function useOrdemForm() {
  const form = ref({})
  const errors = ref({})
  
  function validar() {
    // lógica de validação
  }
  
  function calcularTotal() {
    // lógica de cálculo
  }
  
  return {
    form,
    errors,
    validar,
    calcularTotal
  }
}

// Uso no componente
const { form, validar, calcularTotal } = useOrdemForm()
```

### 3. Use computed para valores derivados

```javascript
// ✅ BOM
const total = computed(() => {
  return pecas.value.reduce((sum, p) => sum + p.valor, 0)
})

// ❌ RUIM
function calcularTotal() {
  return pecas.value.reduce((sum, p) => sum + p.valor, 0)
}
```

### 4. Sempre trate erros

```javascript
// ✅ BOM
try {
  await service.criar(dados)
  $q.notify({ type: 'positive', message: 'Sucesso!' })
} catch (error) {
  $q.notify({ type: 'negative', message: 'Erro ao criar' })
}

// ❌ RUIM
await service.criar(dados) // Sem tratamento de erro
```

### 5. Use loading states

```javascript
const loading = ref(false)

async function carregar() {
  loading.value = true
  try {
    dados.value = await service.listar()
  } finally {
    loading.value = false // Sempre executa
  }
}
```

### 6. Valide formulários

```vue
<q-input
  v-model="form.email"
  label="Email"
  :rules="[
    val => !!val || 'Campo obrigatório',
    val => /.+@.+\..+/.test(val) || 'Email inválido'
  ]"
/>
```

### 7. Use v-if vs v-show corretamente

```vue
<!-- Use v-if para condições que mudam raramente -->
<div v-if="isAdmin">Conteúdo admin</div>

<!-- Use v-show para condições que mudam frequentemente -->
<div v-show="isVisible">Conteúdo que alterna</div>
```

### 8. Evite lógica no template

```vue
<!-- ❌ RUIM -->
<div>{{ user.name.split(' ')[0].toUpperCase() }}</div>

<!-- ✅ BOM -->
<div>{{ primeiroNome }}</div>

<script setup>
const primeiroNome = computed(() => {
  return user.value.name.split(' ')[0].toUpperCase()
})
</script>
```

---

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint

# Format
npm run format

# Preview build
npm run preview

# Limpar cache
rm -rf node_modules .quasar
npm install
```

---

## 📚 Recursos Adicionais

- [Vue 3 Documentation](https://vuejs.org/)
- [Quasar Documentation](https://quasar.dev/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)

---

**Mantenha este guia atualizado conforme o projeto evolui!**
