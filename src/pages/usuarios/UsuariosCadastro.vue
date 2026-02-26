<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round dense icon="arrow_back" @click="voltarSeguro" class="q-mr-sm" />
      <div class="text-h6 text-weight-bold">
        {{ isEdit ? 'Editar Usuário' : 'Cadastro de Usuários' }}
      </div>
    </div>

    <q-card class="q-pa-md shadow-2" bordered>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-model="form.nome" label="Nome *" outlined dense />
        </div>

        <div class="col-12 col-md-6">
          <q-input v-model="form.email" label="E-mail *" outlined dense type="email" />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="form.senha"
            :label="isEdit ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'"
            outlined
            dense
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-6">
          <q-select
            v-model="form.role"
            :options="roleOptions"
            label="Tipo de Usuário *"
            outlined
            dense
          />
        </div>

        <div class="col-12 col-md-6">
          <q-select
            v-model="form.status"
            :options="statusOptions"
            label="Status *"
            outlined
            dense
          />
        </div>
      </div>

      <div class="q-mt-md text-right">
        <q-btn label="Cancelar" flat color="grey" @click="voltarSeguro" class="q-mr-sm" />
        <q-btn label="Salvar" color="primary" @click="salvar" :loading="salvando" />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const salvando = ref(false)
const isEdit = computed(() => !!route.params.id)
const isPwd = ref(true)

const roleOptions = [
  { label: 'Usuário', value: 'user' },
  { label: 'Administrador', value: 'admin' },
]

const statusOptions = [
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
]

const form = ref({
  nome: '',
  username: '',
  email: '',
  senha: '',
  role: { label: 'Usuário', value: 'user' },
  status: { label: 'Ativo', value: 'ativo' },
})

function voltarSeguro() {
  router.push('/usuarios/consulta')
}

function salvar() {
  if (!form.value.nome || !form.value.username || !form.value.email) {
    $q.notify({ type: 'negative', message: 'Preencha os campos obrigatórios' })
    return
  }

  if (!isEdit.value && !form.value.senha) {
    $q.notify({ type: 'negative', message: 'Informe a senha' })
    return
  }

  salvando.value = true

  setTimeout(() => {
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')

      const usuarioData = {
        nome: form.value.nome,
        username: form.value.username,
        email: form.value.email,
        role: form.value.role.value,
        status: form.value.status.value,
      }

      if (isEdit.value) {
        const index = usuarios.findIndex((u) => u.id == route.params.id)
        if (form.value.senha) {
          usuarioData.senha = form.value.senha
        } else {
          usuarioData.senha = usuarios[index].senha
        }
        usuarios[index] = { ...usuarios[index], ...usuarioData }
        $q.notify({ type: 'positive', message: 'Usuário atualizado com sucesso!' })
      } else {
        usuarioData.senha = form.value.senha
        usuarios.push({ id: Date.now(), ...usuarioData })
        $q.notify({ type: 'positive', message: 'Usuário cadastrado com sucesso!' })
      }

      localStorage.setItem('usuarios', JSON.stringify(usuarios))
      router.push('/usuarios/consulta')
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao salvar usuário' })
      salvando.value = false
    }
  }, 300)
}

onMounted(() => {
  if (isEdit.value) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const usuario = usuarios.find((u) => u.id == route.params.id)
    if (usuario) {
      form.value = {
        nome: usuario.nome,
        username: usuario.username,
        email: usuario.email,
        senha: '',
        role: roleOptions.find((r) => r.value === usuario.role) || roleOptions[0],
        status: statusOptions.find((s) => s.value === usuario.status) || statusOptions[0],
      }
    }
  }
})
</script>
