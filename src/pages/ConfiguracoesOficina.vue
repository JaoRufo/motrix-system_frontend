<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round dense icon="arrow_back" @click="voltarSeguro" class="q-mr-sm" />
      <div class="text-h6 text-weight-bold">Configurações da Oficina</div>
    </div>

    <q-card class="q-pa-md shadow-2" bordered>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-model="form.nome" label="Nome da Oficina *" outlined dense />
        </div>

        <div class="col-12 col-md-6">
          <q-input v-model="form.cnpj" label="CNPJ *" outlined dense mask="##.###.###/####-##" />
        </div>

        <div class="col-12 col-md-6">
          <q-input v-model="form.telefone" label="Telefone *" outlined dense mask="(##) #####-####" />
        </div>

        <div class="col-12 col-md-6">
          <q-input v-model="form.email" label="E-mail" outlined dense type="email" />
        </div>

        <div class="col-12">
          <q-input v-model="form.endereco" label="Endereço Completo *" outlined dense />
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { oficinaService } from 'src/services/oficinaService'

const router = useRouter()
const $q = useQuasar()

const salvando = ref(false)
const oficinaId = ref(null)

const form = ref({
  nome: '',
  cnpj: '',
  telefone: '',
  email: '',
  endereco: ''
})

function voltarSeguro() {
  router.push('/ordens')
}

async function salvar() {
  if (!form.value.nome || !form.value.cnpj || !form.value.telefone || !form.value.endereco) {
    $q.notify({ type: 'negative', message: 'Preencha todos os campos obrigatórios' })
    return
  }

  salvando.value = true

  try {
    await oficinaService.atualizar(oficinaId.value, form.value)
    $q.notify({ type: 'positive', message: 'Oficina atualizada com sucesso!' })
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message || 'Erro ao salvar oficina' })
  } finally {
    salvando.value = false
  }
}

onMounted(async () => {
  try {
    const oficinas = await oficinaService.buscar()
    if (oficinas && oficinas.length > 0) {
      const oficina = oficinas[0]
      oficinaId.value = oficina.id
      form.value = {
        nome: oficina.nome || '',
        cnpj: oficina.cnpj || '',
        telefone: oficina.telefone || '',
        email: oficina.email || '',
        endereco: oficina.endereco || ''
      }
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar dados da oficina' })
  }
})
</script>
