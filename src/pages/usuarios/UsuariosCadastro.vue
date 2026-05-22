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
          <q-input v-model="form.name" label="Nome *" outlined dense />
        </div>

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
          <div class="q-mb-sm text-subtitle2">Status do Usuário</div>
          <q-toggle
            v-model="form.is_active"
            :label="form.is_active ? 'Ativo' : 'Inativo'"
            color="primary"
            true-value="ativo"
            false-value="inativo"
          />
        </div>

        <!-- Campos adicionais para role 'user' -->
        <template v-if="form.role === 'user'">
          <div class="col-12">
            <q-separator class="q-my-md" />
            <div class="text-subtitle1 text-weight-bold q-mb-md">Informações da Oficina</div>
          </div>

          <div class="col-12 col-md-4">
            <q-input v-model="form.oficina_nome" label="Nome da Oficina *" outlined dense />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="form.oficina_telefone"
              label="Telefone da Oficina *"
              outlined
              dense
              mask="(##) #####-####"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input v-model="form.mecanico_nome" label="Nome do Mecânico *" outlined dense />
          </div>

          <div class="col-12">
            <q-input v-model="form.oficina_endereco" label="Endereço da Oficina *" outlined dense />
          </div>
        </template>
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
import { getErrorMessage } from '../../utils/errorHandler'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const salvando = ref(false)
const isEdit = computed(() => !!route.params.id)
const isPwd = ref(true)

const roleOptions = ['user', 'admin']

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'user',
  is_active: 'ativo',
  oficina_nome: '',
  oficina_telefone: '',
  oficina_endereco: '',
  mecanico_nome: '',
})

function voltarSeguro() {
  router.push('/usuarios/consulta')
}

async function salvar() {
  if (!form.value.name || !form.value.email) {
    $q.notify({ type: 'negative', message: 'Preencha todos os campos obrigatórios' })
    return
  }

  if (!isEdit.value && (!form.value.username || !form.value.password || !form.value.role)) {
    $q.notify({ type: 'negative', message: 'Preencha todos os campos obrigatórios' })
    return
  }

  if (
    form.value.role === 'user' &&
    (!form.value.oficina_nome ||
      !form.value.oficina_telefone ||
      !form.value.oficina_endereco ||
      !form.value.mecanico_nome)
  ) {
    $q.notify({ type: 'negative', message: 'Preencha as informações da oficina' })
    return
  }

  salvando.value = true

  try {
    if (isEdit.value) {
      const payload = {
        nome: form.value.name,
        username: form.value.username,
        email: form.value.email,
        status: form.value.is_active,
        role: form.value.role,
      }
      if (form.value.role === 'user') {
        payload.oficina_nome = form.value.oficina_nome
        payload.oficina_telefone = form.value.oficina_telefone
        payload.oficina_endereco = form.value.oficina_endereco
        payload.mecanico_nome = form.value.mecanico_nome
      }
      await usuarioService.atualizar(route.params.id, payload)
      $q.notify({ type: 'positive', message: 'Usuário atualizado com sucesso!' })
      router.push('/usuarios/consulta')
    } else {
      const payload = {
        nome: form.value.name,
        username: form.value.username,
        email: form.value.email,
        senha: form.value.password,
        role: form.value.role,
        status: form.value.is_active,
      }
      if (form.value.role === 'user') {
        payload.oficina_nome = form.value.oficina_nome
        payload.oficina_telefone = form.value.oficina_telefone
        payload.oficina_endereco = form.value.oficina_endereco
        payload.mecanico_nome = form.value.mecanico_nome
      }
      await usuarioService.criar(payload)
      $q.notify({ type: 'positive', message: 'Usuário cadastrado com sucesso!' })
      router.push('/usuarios/consulta')
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: getErrorMessage(error) })
  } finally {
    salvando.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      const usuario = await usuarioService.buscarPorId(route.params.id)
      form.value = {
        name: usuario.nome || '',
        username: usuario.username,
        email: usuario.email,
        password: '',
        role: usuario.role,
        is_active: usuario.status || 'ativo',
        oficina_nome: usuario.oficina_nome || '',
        oficina_telefone: usuario.oficina_telefone || '',
        oficina_endereco: usuario.oficina_endereco || '',
        mecanico_nome: usuario.mecanico_nome || '',
      }
    } catch (error) {
      $q.notify({ type: 'negative', message: getErrorMessage(error) })
      router.push('/usuarios/consulta')
    }
  }
})
</script>
