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
          <q-input v-model="form.username" label="Usuário *" outlined dense />
        </div>

        <div class="col-12 col-md-6">
          <q-input v-model="form.email" label="E-mail *" outlined dense type="email" />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="form.password"
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
          <q-toggle
            v-model="form.is_active"
            label="Usuário Ativo"
            color="primary"
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
import { usuarioService } from '../../services/usuarioService'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const salvando = ref(false)
const isEdit = computed(() => !!route.params.id)
const isPwd = ref(true)

const roleOptions = ['user', 'admin']

const form = ref({
  username: '',
  email: '',
  password: '',
  role: 'user',
  is_active: true
})

function voltarSeguro() {
  router.push('/usuarios/consulta')
}

async function salvar() {
  if (!form.value.username || !form.value.email || !form.value.role) {
    $q.notify({ type: 'negative', message: 'Preencha todos os campos obrigatórios' })
    return
  }

  if (!isEdit.value && !form.value.password) {
    $q.notify({ type: 'negative', message: 'Informe a senha' })
    return
  }

  salvando.value = true

  try {
    const payload = {
      username: form.value.username,
      email: form.value.email,
      role: form.value.role,
      is_active: form.value.is_active
    }

    if (form.value.password) {
      payload.password = form.value.password
    }

    if (isEdit.value) {
      await usuarioService.atualizar(route.params.id, payload)
      $q.notify({ type: 'positive', message: 'Usuário atualizado com sucesso!' })
    } else {
      await usuarioService.criar(payload)
      $q.notify({ type: 'positive', message: 'Usuário cadastrado com sucesso!' })
    }

    router.push('/usuarios/consulta')
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message || 'Erro ao salvar usuário' })
  } finally {
    salvando.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      const usuario = await usuarioService.buscarPorId(route.params.id)
      form.value = {
        username: usuario.username,
        email: usuario.email,
        password: '',
        role: usuario.role,
        is_active: usuario.is_active
      }
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao carregar usuário' })
      router.push('/usuarios/consulta')
    }
  }
})
</script>
