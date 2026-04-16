<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round dense icon="arrow_back" @click="voltarSeguro" class="q-mr-sm">
        <q-tooltip>Voltar</q-tooltip>
      </q-btn>
      <div class="text-h6 text-weight-bold">Gerenciar Usuários</div>
      <q-space />
      <!-- Botão removido: cadastro via menu lateral (Usuários > Cadastro)
      <q-btn
        label="Novo Usuário"
        color="primary"
        icon="add"
        to="/usuarios/cadastro"
        class="btn-custom"
      />
      -->
    </div>

    <q-card flat bordered>
      <q-card-section class="row items-center">
        <q-btn
          label="Filtros"
          icon="filter_list"
          color="primary"
          outline
          @click="dialogFiltros = true"
        />
        <q-space />
        <q-chip v-if="temFiltrosAtivos" color="primary" text-color="white" icon="filter_alt">
          Filtros ativos
        </q-chip>
      </q-card-section>

      <q-table
        :rows="usuarios"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
        :rows-per-page-options="[10, 25, 50]"
      >
        <template v-slot:body="props">
          <q-tr :props="props" :class="isUsuarioLogado(props.row.id) ? 'row-logado' : ''">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name === 'nome'">
                <div :class="isUsuarioLogado(props.row.id) ? 'nome-logado' : ''">
                  {{ col.value }}
                </div>
              </template>
              <template v-else-if="col.name === 'role'">
                <q-badge :color="props.row.role === 'admin' ? 'purple' : 'blue'">
                  {{ props.row.role === 'admin' ? 'Administrador' : 'Usuário' }}
                </q-badge>
              </template>
              <template v-else-if="col.name === 'is_active'">
                <q-badge :color="props.row.status === 'ativo' ? 'green' : 'grey'">
                  {{ props.row.status === 'ativo' ? 'Ativo' : 'Inativo' }}
                </q-badge>
              </template>
              <template v-else-if="col.name === 'acoes'">
                <q-btn icon="edit" flat round color="primary" @click="editarUsuario(props.row.id)">
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  icon="delete"
                  flat
                  round
                  :color="isUsuarioLogado(props.row.id) ? 'grey' : 'negative'"
                  :disable="isUsuarioLogado(props.row.id)"
                  @click.stop="excluir(props.row.id)"
                >
                  <q-tooltip>{{
                    isUsuarioLogado(props.row.id)
                      ? 'Não pode excluir seu próprio perfil'
                      : 'Excluir'
                  }}</q-tooltip>
                </q-btn>
              </template>
              <template v-else>
                {{ col.value }}
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>

    <!-- Dialog de Filtros -->
    <q-dialog v-model="dialogFiltros">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Filtros</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div v-if="!temCamposFiltro" class="text-center text-grey q-pa-md">
            Nenhum campo de filtro disponível
          </div>
          <div v-else>
            <q-input v-model="filtro.nome" label="Nome" outlined dense class="q-mb-md" />
            <q-input v-model="filtro.email" label="E-mail" outlined dense class="q-mb-md" />
            <q-input v-model="filtro.username" label="Usuário" outlined dense class="q-mb-md" />
            <q-select
              v-model="filtro.status"
              :options="['Ativo', 'Inativo']"
              label="Status"
              outlined
              dense
              clearable
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Limpar" flat color="grey" @click="limparFiltros" />
          <q-btn label="Aplicar" color="primary" @click="dialogFiltros = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { usuarioService } from '../../services/usuarioService'
import { authService } from '../../services/authService'
import { getErrorMessage } from '../../utils/errorHandler'

const $q = useQuasar()
const router = useRouter()
const loading = ref(false)
const dialogFiltros = ref(false)

const filtro = ref({
  nome: '',
  email: '',
  username: '',
  status: '',
})

function limparFiltros() {
  filtro.value = {
    nome: '',
    email: '',
    username: '',
    status: '',
  }
}

const usuariosFiltrados = computed(() => {
  let resultado = todosUsuarios.value

  if (filtro.value.nome) {
    const needle = filtro.value.nome.toLowerCase()
    resultado = resultado.filter((u) => u.nome?.toLowerCase().includes(needle))
  }

  if (filtro.value.email) {
    const needle = filtro.value.email.toLowerCase()
    resultado = resultado.filter((u) => u.email?.toLowerCase().includes(needle))
  }

  if (filtro.value.username) {
    const needle = filtro.value.username.toLowerCase()
    resultado = resultado.filter((u) => u.username?.toLowerCase().includes(needle))
  }

  if (filtro.value.status) {
    const statusFiltro = filtro.value.status === 'Ativo' ? 'ativo' : 'inativo'
    resultado = resultado.filter((u) => u.status === statusFiltro)
  }

  return resultado
})

const totalUsuariosFiltrado = computed(() => usuariosFiltrados.value.length)

const temFiltrosAtivos = computed(() => {
  return !!(filtro.value.nome || filtro.value.email || filtro.value.username || filtro.value.status)
})

const temCamposFiltro = computed(() => {
  return true
})

function voltarSeguro() {
  router.push('/ordens')
}

const columns = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'username', label: 'Usuário', field: 'username', align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'role', label: 'Tipo', field: 'role', align: 'left' },
  { name: 'is_active', label: 'Status', field: 'is_active', align: 'left' },
  { name: 'acoes', label: 'Ações', align: 'center' },
]

const usuarios = ref([])
const todosUsuarios = ref([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

function isUsuarioLogado(id) {
  const userLogado = authService.getUser()
  return userLogado && userLogado.id === id
}

async function carregar() {
  loading.value = true
  try {
    const response = await usuarioService.listar(1, 9999)
    todosUsuarios.value = response.data
    atualizarPaginacao()
  } catch (error) {
    $q.notify({ type: 'negative', message: getErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

function atualizarPaginacao() {
  const filtered = usuariosFiltrados.value
  const startIndex = (pagination.value.page - 1) * pagination.value.rowsPerPage
  const endIndex = startIndex + pagination.value.rowsPerPage
  usuarios.value = filtered.slice(startIndex, endIndex)
  pagination.value.rowsNumber = filtered.length
}

function onRequest(props) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  atualizarPaginacao()
}

function editarUsuario(id) {
  router.push(`/usuarios/cadastro/${id}`)
}

function excluir(id) {
  $q.dialog({
    title: 'Confirmar',
    message: 'Deseja realmente excluir este usuário?',
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Excluir', color: 'negative' },
  }).onOk(async () => {
    try {
      await usuarioService.excluir(id)
      $q.notify({ type: 'positive', message: 'Usuário excluído com sucesso!' })
      carregar()
    } catch (error) {
      $q.notify({ type: 'negative', message: getErrorMessage(error) })
    }
  })
}

onMounted(() => {
  carregar()
})

watch(
  [totalUsuariosFiltrado, () => filtro.value],
  () => {
    pagination.value.page = 1
    atualizarPaginacao()
  },
  { deep: true },
)
</script>

<style scoped>
.btn-custom {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.btn-custom:hover {
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
  transform: translateY(-2px);
}

.row-logado {
  border-left: 4px solid #103dc3;
}

.nome-logado {
  font-weight: bold;
  color: #103dc3;
}
</style>
