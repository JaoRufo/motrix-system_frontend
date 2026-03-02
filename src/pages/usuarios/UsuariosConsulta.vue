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
        <template v-slot:body-cell-role="props">
          <q-td>
            <q-badge :color="props.row.role === 'admin' ? 'purple' : 'blue'">
              {{ props.row.role === 'admin' ? 'Administrador' : 'Usuário' }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-is_active="props">
          <q-td>
            <q-badge :color="props.row.is_active ? 'green' : 'grey'">
              {{ props.row.is_active ? 'Ativo' : 'Inativo' }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-acoes="props">
          <q-td align="center">
            <q-btn
              icon="edit"
              flat
              round
              color="primary"
              :to="`/usuarios/cadastro/${props.row.id}`"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn icon="delete" flat round color="negative" @click.stop="excluir(props.row.id)">
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
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
    resultado = resultado.filter(u => u.name?.toLowerCase().includes(needle))
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
    const ativo = filtro.value.status === 'Ativo'
    resultado = resultado.filter(u => u.is_active === ativo)
  }
  
  return resultado
})

function voltarSeguro() {
  router.push('/ordens')
}

const columns = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left' },
  { name: 'username', label: 'Usuário', field: 'username', align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'role', label: 'Tipo', field: 'role', align: 'left' },
  { name: 'is_active', label: 'Status', field: 'is_active', align: 'left' },
  { name: 'acoes', label: 'Ações', align: 'center' },
]

const usuarios = ref([])

async function carregar() {
  loading.value = true
  try {
    usuarios.value = await usuarioService.listar()
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar usuários' })
  } finally {
    loading.value = false
  }
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
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao excluir usuário' })
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
</style>
