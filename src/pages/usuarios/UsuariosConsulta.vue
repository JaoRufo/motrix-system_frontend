<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round dense icon="arrow_back" @click="voltarSeguro" class="q-mr-sm">
        <q-tooltip>Voltar</q-tooltip>
      </q-btn>
      <div class="text-h6 text-weight-bold">Gerenciar Usuários</div>
      <q-space />
      <q-btn
        label="Novo Usuário"
        color="primary"
        icon="add"
        to="/usuarios/cadastro"
        class="btn-custom"
      />
    </div>

    <q-card flat bordered>
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-3">
            <q-input v-model="filtro.nome" label="Nome" outlined dense clearable />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="filtro.email" label="E-mail" outlined dense clearable />
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="filtro.username" label="Usuário" outlined dense clearable />
          </div>
          <div class="col-12 col-md-2">
            <q-select v-model="filtro.status" :options="['Ativo', 'Inativo']" label="Status" outlined dense clearable />
          </div>
          <div class="col-12 col-md-2 flex items-center">
            <q-btn label="Limpar" flat color="grey" @click="limparFiltros" />
          </div>
        </div>
      </q-card-section>

      <q-table :rows="usuariosFiltrados" :columns="columns" row-key="id" flat :loading="loading">
        <template v-slot:body="props">
          <q-tr :props="props" :class="isUsuarioLogado(props.row.id) ? 'row-bloqueada' : ''">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name === 'role'">
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
                <q-btn
                  icon="edit"
                  flat
                  round
                  :color="isUsuarioLogado(props.row.id) ? 'grey' : 'primary'"
                  :disable="isUsuarioLogado(props.row.id)"
                  @click="editarUsuario(props.row.id)"
                >
                  <q-tooltip>{{ isUsuarioLogado(props.row.id) ? 'Não pode editar seu próprio perfil' : 'Editar' }}</q-tooltip>
                </q-btn>
                <q-btn
                  icon="delete"
                  flat
                  round
                  :color="isUsuarioLogado(props.row.id) ? 'grey' : 'negative'"
                  :disable="isUsuarioLogado(props.row.id)"
                  @click.stop="excluir(props.row.id)"
                >
                  <q-tooltip>{{ isUsuarioLogado(props.row.id) ? 'Não pode excluir seu próprio perfil' : 'Excluir' }}</q-tooltip>
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
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { usuarioService } from '../../services/usuarioService'
import { authService } from '../../services/authService'
import { getErrorMessage } from '../../utils/errorHandler'

const $q = useQuasar()
const router = useRouter()
const loading = ref(false)

const filtro = ref({
  nome: '',
  email: '',
  username: '',
  status: ''
})

function limparFiltros() {
  filtro.value = {
    nome: '',
    email: '',
    username: '',
    status: ''
  }
}

const usuariosFiltrados = computed(() => {
  let resultado = usuarios.value
  
  if (filtro.value.nome) {
    const needle = filtro.value.nome.toLowerCase()
    resultado = resultado.filter(u => u.nome?.toLowerCase().includes(needle))
  }
  
  if (filtro.value.email) {
    const needle = filtro.value.email.toLowerCase()
    resultado = resultado.filter(u => u.email?.toLowerCase().includes(needle))
  }
  
  if (filtro.value.username) {
    const needle = filtro.value.username.toLowerCase()
    resultado = resultado.filter(u => u.username?.toLowerCase().includes(needle))
  }
  
  if (filtro.value.status) {
    const statusFiltro = filtro.value.status === 'Ativo' ? 'ativo' : 'inativo'
    resultado = resultado.filter(u => u.status === statusFiltro)
  }
  
  return resultado
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

function isUsuarioLogado(id) {
  const userLogado = authService.getUser()
  return userLogado && userLogado.id === id
}

async function carregar() {
  loading.value = true
  try {
    usuarios.value = await usuarioService.listar()
  } catch (error) {
    $q.notify({ type: 'negative', message: getErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

function editarUsuario(id) {
  const userLogado = authService.getUser()
  if (userLogado && userLogado.id === id) {
    $q.notify({ type: 'warning', message: 'Você não pode editar seu próprio perfil' })
    return
  }
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

.row-bloqueada {
  opacity: 0.5;
  background-color: rgba(0, 0, 0, 0.05);
}

body.body--dark .row-bloqueada {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
