<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round dense icon="arrow_back" @click="voltarSeguro" class="q-mr-sm" />
      <div class="text-h6 text-weight-bold">
        {{ isEdit ? 'Editar Cliente' : 'Cadastro de Clientes' }}
      </div>
    </div>

    <q-card class="q-pa-md shadow-2" bordered>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-model="form.nome" label="Nome *" outlined dense />
        </div>

        <div class="col-12 col-md-6">
          <q-input v-model="form.cpf" label="CPF" outlined dense mask="###.###.###-##" />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="form.telefone"
            label="Telefone *"
            outlined
            dense
            mask="(##) #####-####"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-input v-model="form.email" label="E-mail" outlined dense type="email" />
        </div>

        <div class="col-12">
          <q-input v-model="form.endereco" label="Endereço" outlined dense />
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div class="text-subtitle1 text-weight-bold q-mb-sm">Veículos</div>

      <div
        v-for="(veiculo, index) in form.veiculos"
        :key="index"
        class="row q-col-gutter-md q-mb-sm"
      >
        <div class="col-12 col-md-3">
          <q-input
            v-model="veiculo.placa"
            label="Placa *"
            outlined
            dense
            @update:model-value="(val) => (veiculo.placa = formatarPlaca(val))"
            maxlength="8"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-input v-model="veiculo.modelo" label="Modelo *" outlined dense />
        </div>

        <div class="col-12 col-md-2">
          <q-input v-model="veiculo.ano" label="Ano" outlined dense mask="####" />
        </div>

        <div class="col-12 col-md-3">
          <q-input v-model="veiculo.chassi" label="Chassi" outlined dense />
        </div>

        <div class="col-12 col-md-2">
          <q-input v-model="veiculo.cor" label="Cor" outlined dense />
        </div>

        <div class="col-12 col-md-2">
          <q-input v-model.number="veiculo.kmAtual" label="KM Atual" outlined dense type="number" />
        </div>

        <div class="col-12 col-md-1 flex flex-center">
          <q-btn
            v-if="form.veiculos.length > 1"
            icon="delete"
            flat
            round
            color="negative"
            @click="removerVeiculo(index)"
          >
            <q-tooltip>Remover Veículo</q-tooltip>
          </q-btn>
        </div>
      </div>

      <q-btn
        label="Adicionar Veículo"
        flat
        icon="add"
        color="primary"
        @click="adicionarVeiculo"
        class="q-mb-md"
      />

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
import { clienteService } from 'src/services/clienteService'
import { formatarPlaca } from 'src/utils/formatters'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

function voltarSeguro() {
  router.push('/ordens')
}

const salvando = ref(false)
const isEdit = computed(() => !!route.params.id)

const form = ref({
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  endereco: '',
  veiculos: [
    {
      placa: '',
      modelo: '',
      ano: '',
      chassi: '',
      cor: '',
      kmAtual: 0,
    },
  ],
})

function adicionarVeiculo() {
  form.value.veiculos.push({
    placa: '',
    modelo: '',
    ano: '',
    chassi: '',
    cor: '',
    kmAtual: 0,
  })
}

function removerVeiculo(index) {
  $q.dialog({
    title: 'Confirmar',
    message: 'Deseja realmente excluir este veículo?',
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Excluir', color: 'negative' },
  }).onOk(() => {
    form.value.veiculos.splice(index, 1)
  })
}

async function salvar() {
  if (!form.value.nome || !form.value.telefone) {
    $q.notify({ type: 'negative', message: 'Preencha os campos obrigatórios' })
    return
  }

  const veiculosValidos = form.value.veiculos.filter((v) => v.placa && v.modelo)
  if (veiculosValidos.length === 0) {
    $q.notify({ type: 'negative', message: 'Adicione pelo menos um veículo com placa e modelo' })
    return
  }

  salvando.value = true

  try {
    if (isEdit.value) {
      const payload = {
        nome: form.value.nome,
        cpf: form.value.cpf,
        telefone: form.value.telefone,
        email: form.value.email,
        endereco: form.value.endereco
      }
      await clienteService.atualizar(route.params.id, payload)
      $q.notify({ type: 'positive', message: 'Cliente atualizado com sucesso!' })
      router.push('/clientes/consulta').then(() => router.go(0))
    } else {
      const payload = {
        cliente: {
          nome: form.value.nome,
          cpf: form.value.cpf,
          telefone: form.value.telefone,
          email: form.value.email,
          endereco: form.value.endereco
        },
        veiculos: veiculosValidos.map(v => ({
          placa: v.placa,
          modelo: v.modelo,
          ano: v.ano,
          chassi: v.chassi || '',
          cor: v.cor || '',
          km_atual: v.kmAtual || 0
        }))
      }
      await clienteService.criar(payload)
      $q.notify({ type: 'positive', message: 'Cliente cadastrado com sucesso!' })
      router.push('/clientes/consulta')
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message || 'Erro ao salvar cliente' })
  } finally {
    salvando.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      const cliente = await clienteService.buscarPorId(route.params.id)
      if (cliente) {
        form.value = {
          nome: cliente.nome,
          cpf: cliente.cpf,
          telefone: cliente.telefone,
          email: cliente.email,
          endereco: cliente.endereco,
          veiculos: cliente.veiculos?.map(v => ({
            placa: v.placa,
            modelo: v.modelo,
            ano: v.ano,
            chassi: v.chassi,
            cor: v.cor,
            kmAtual: v.km_atual
          })) || [{
            placa: '',
            modelo: '',
            ano: '',
            kmAtual: 0
          }]
        }
      }
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao carregar cliente' })
      router.push('/clientes/consulta')
    }
  }
})
</script>
