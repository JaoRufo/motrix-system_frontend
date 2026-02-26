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
      <q-table :rows="usuarios" :columns="columns" row-key="id" flat>
        <template v-slot:body-cell-role="props">
          <q-td>
            <q-badge :color="props.row.role === 'admin' ? 'purple' : 'blue'">
              {{ props.row.role === 'admin' ? 'Administrador' : 'Usuário' }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td>
            <q-badge :color="props.row.status === 'ativo' ? 'green' : 'grey'">
              {{ props.row.status === 'ativo' ? 'Ativo' : 'Inativo' }}
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
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

function voltarSeguro() {
  router.push('/ordens')
}

const columns = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'username', label: 'Usuário', field: 'username', align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'role', label: 'Tipo', field: 'role', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', align: 'center' },
]

const usuarios = ref([])

function carregar() {
  usuarios.value = JSON.parse(localStorage.getItem('usuarios') || '[]')
}

function excluir(id) {
  $q.dialog({
    title: 'Confirmar',
    message: 'Deseja realmente excluir este usuário?',
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Excluir', color: 'negative' },
  }).onOk(() => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const novosUsuarios = usuarios.filter((u) => u.id != id)
    localStorage.setItem('usuarios', JSON.stringify(novosUsuarios))
    carregar()
    $q.notify({ type: 'positive', message: 'Usuário excluído com sucesso!' })
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
