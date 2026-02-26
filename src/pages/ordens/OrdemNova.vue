<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round dense icon="arrow_back" @click="$router.back()" class="q-mr-sm" />
      <div class="text-h6 text-weight-bold">
        {{ isEdit ? 'Editar Ordem' : 'Nova Ordem de Serviço' }}
      </div>
    </div>

    <q-card class="q-pa-md shadow-2" bordered>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <q-select
            v-model="clienteSelecionado"
            :options="clientesOptions"
            label="Cliente *"
            outlined
            dense
            use-input
            @filter="filtrarClientes"
            @update:model-value="selecionarCliente"
            option-label="nome"
            option-value="id"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> Nenhum cliente encontrado </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="veiculoSelecionado"
            :options="veiculosOptions"
            label="Veículo *"
            outlined
            dense
            :disable="!clienteSelecionado"
            @update:model-value="selecionarVeiculo"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption>KM: {{ scope.opt.kmAtual }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-3">
          <q-input v-model.number="kmAtual" label="KM Atual *" outlined dense type="number" />
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="status"
            :options="statusOptions"
            label="Status *"
            outlined
            dense
            @update:model-value="onStatusChange"
          />
        </div>

        <div class="col-12">
          <q-input
            v-model="descricaoProblema"
            label="Descrição do Problema *"
            outlined
            dense
            type="textarea"
            rows="3"
          />
        </div>

        <div class="col-12">
          <q-input
            v-model="observacoes"
            label="Observações Adicionais"
            outlined
            dense
            type="textarea"
            rows="2"
          />
        </div>

        <div v-if="status === 'Cancelada'" class="col-12">
          <q-input
            v-model="motivoCancelamento"
            label="Motivo do Cancelamento *"
            outlined
            dense
            type="textarea"
            rows="2"
          />
        </div>
      </div>

      <q-separator class="q-my-md" />

      <!-- PEÇAS -->
      <div class="text-subtitle1 text-weight-bold q-mb-sm">Peças Utilizadas</div>

      <div v-for="(peca, index) in pecas" :key="index" class="row q-col-gutter-md q-mb-sm">
        <div class="col-5">
          <q-input v-model="peca.nome" label="Peça" dense outlined />
        </div>

        <div class="col-3">
          <q-input v-model.number="peca.valor" type="number" label="Valor (R$)" dense outlined />
        </div>

        <div class="col-2 flex flex-center">
          <q-btn icon="delete" flat color="negative" @click="removerPeca(index)">
            <q-tooltip>Remover Peça</q-tooltip>
          </q-btn>
        </div>
      </div>

      <q-btn
        label="Adicionar Peça"
        flat
        icon="add"
        color="primary"
        @click="adicionarPeca"
        class="q-mb-md"
      />

      <q-separator class="q-my-md" />

      <!-- MÃO DE OBRA -->
      <div class="text-subtitle1 text-weight-bold q-mb-sm">Mão de Obra</div>

      <div v-for="(mao, index) in maoObra" :key="index" class="row q-col-gutter-md q-mb-sm">
        <div class="col-5">
          <q-input v-model="mao.descricao" label="Descrição" dense outlined />
        </div>

        <div class="col-3">
          <q-input v-model.number="mao.valor" type="number" label="Valor (R$)" dense outlined />
        </div>

        <div class="col-2 flex flex-center">
          <q-btn icon="delete" flat color="negative" @click="removerMao(index)">
            <q-tooltip>Remover Serviço</q-tooltip>
          </q-btn>
        </div>
      </div>

      <q-btn label="Adicionar Serviço" flat icon="add" color="primary" @click="adicionarMao" />

      <q-separator class="q-my-md" />

      <div class="text-right text-h6 text-weight-bold">Total: R$ {{ total.toFixed(2) }}</div>

      <div class="q-mt-md text-right">
        <q-btn label="Cancelar" flat color="grey" @click="$router.back()" class="q-mr-sm" />
        <q-btn
          label="Salvar"
          color="primary"
          @click="salvar"
          :loading="salvando"
          class="btn-save"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { clienteService } from 'src/services/clienteService'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const clienteSelecionado = ref(null)
const veiculoSelecionado = ref(null)
const kmAtual = ref(0)
const status = ref('Aberta')
const descricaoProblema = ref('')
const observacoes = ref('')
const motivoCancelamento = ref('')
const pecas = ref([])
const maoObra = ref([])
const clientesOptions = ref([])
const todosClientes = ref([])
const veiculosOptions = ref([])
const salvando = ref(false)

const statusOptions = ['Aberta', 'Em Andamento', 'Aguardando Orçamento', 'Finalizada', 'Cancelada']

const isEdit = computed(() => !!route.params.id)

const total = computed(() => {
  const totalPecas = pecas.value.reduce((acc, p) => acc + (p.valor || 0), 0)
  const totalMao = maoObra.value.reduce((acc, m) => acc + (m.valor || 0), 0)
  return totalPecas + totalMao
})

function onStatusChange(newStatus) {
  if (newStatus !== 'Cancelada') {
    motivoCancelamento.value = ''
  }
}

function filtrarClientes(val, update) {
  update(() => {
    if (val === '') {
      clientesOptions.value = todosClientes.value
    } else {
      const needle = val.toLowerCase()
      clientesOptions.value = todosClientes.value.filter(
        (c) => c.nome.toLowerCase().indexOf(needle) > -1,
      )
    }
  })
}

function selecionarCliente(cliente) {
  veiculoSelecionado.value = null
  if (cliente && cliente.veiculos) {
    veiculosOptions.value = cliente.veiculos.map((v) => ({
      label: `${v.modelo} - ${v.placa}`,
      value: v,
      kmAtual: v.kmAtual || 0,
    }))
  } else {
    veiculosOptions.value = []
  }
}

function selecionarVeiculo(veiculo) {
  if (veiculo && veiculo.value) {
    kmAtual.value = veiculo.value.kmAtual || 0
  }
}

function adicionarPeca() {
  pecas.value.push({ nome: '', valor: 0 })
}

function removerPeca(index) {
  pecas.value.splice(index, 1)
}

function adicionarMao() {
  maoObra.value.push({ descricao: '', valor: 0 })
}

function removerMao(index) {
  maoObra.value.splice(index, 1)
}

function salvar() {
  if (!clienteSelecionado.value) {
    $q.notify({
      type: 'negative',
      message: 'Selecione um cliente. Caso não exista, cadastre-o primeiro.',
      actions: [
        {
          label: 'Cadastrar',
          color: 'white',
          handler: () => router.push('/clientes/cadastro'),
        },
      ],
    })
    return
  }

  if (!veiculoSelecionado.value) {
    $q.notify({ type: 'negative', message: 'Selecione um veículo' })
    return
  }

  if (!kmAtual.value || kmAtual.value <= 0) {
    $q.notify({ type: 'negative', message: 'Informe a quilometragem atual' })
    return
  }

  if (!descricaoProblema.value) {
    $q.notify({ type: 'negative', message: 'Descreva o problema relatado' })
    return
  }

  if (status.value === 'Cancelada' && !motivoCancelamento.value) {
    $q.notify({ type: 'negative', message: 'Informe o motivo do cancelamento' })
    return
  }

  salvando.value = true

  try {
    const ordens = JSON.parse(localStorage.getItem('ordens') || '[]')

    const ordemData = {
      clienteId: clienteSelecionado.value.id,
      cliente: clienteSelecionado.value.nome,
      veiculo: veiculoSelecionado.value.label,
      veiculoPlaca: veiculoSelecionado.value.value.placa,
      kmAtual: kmAtual.value,
      status: status.value,
      descricaoProblema: descricaoProblema.value,
      observacoes: observacoes.value,
      motivoCancelamento: status.value === 'Cancelada' ? motivoCancelamento.value : null,
      pecas: pecas.value.filter((p) => p.nome),
      maoObra: maoObra.value.filter((m) => m.descricao),
      total: total.value,
      data: Date.now(),
    }

    if (isEdit.value) {
      const index = ordens.findIndex((o) => o.id == route.params.id)
      ordens[index] = { ...ordens[index], ...ordemData }
    } else {
      ordens.push({ id: Date.now(), ...ordemData })
    }

    localStorage.setItem('ordens', JSON.stringify(ordens))

    // Atualizar KM do veículo se finalizada ou cancelada
    if (status.value === 'Finalizada' || status.value === 'Cancelada') {
      const cliente = clienteService.buscarPorId(clienteSelecionado.value.id)
      if (cliente) {
        const veiculoIndex = cliente.veiculos.findIndex(
          (v) => v.placa === veiculoSelecionado.value.value.placa,
        )
        if (veiculoIndex !== -1) {
          cliente.veiculos[veiculoIndex].kmAtual = kmAtual.value
          clienteService.atualizar(cliente.id, cliente)
        }
      }
    }

    $q.notify({ type: 'positive', message: 'Ordem salva com sucesso!' })
    setTimeout(() => {
      router.push('/ordens')
    }, 300)
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao salvar ordem' })
  } finally {
    salvando.value = false
  }
}

onMounted(() => {
  todosClientes.value = clienteService.listar()
  clientesOptions.value = todosClientes.value

  if (isEdit.value) {
    const ordens = JSON.parse(localStorage.getItem('ordens') || '[]')
    const ordem = ordens.find((o) => o.id == route.params.id)
    if (ordem) {
      const cliente = todosClientes.value.find((c) => c.id == ordem.clienteId)
      if (cliente) {
        clienteSelecionado.value = cliente
        selecionarCliente(cliente)

        const veiculo = veiculosOptions.value.find((v) => v.value.placa === ordem.veiculoPlaca)
        if (veiculo) {
          veiculoSelecionado.value = veiculo
          kmAtual.value = ordem.kmAtual
        }
      }
      status.value = ordem.status || 'Aberta'
      descricaoProblema.value = ordem.descricaoProblema || ''
      observacoes.value = ordem.observacoes || ''
      motivoCancelamento.value = ordem.motivoCancelamento || ''
      pecas.value = ordem.pecas || []
      maoObra.value = ordem.maoObra || []
    }
  }
})
</script>

<style scoped>
.btn-save {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.btn-save:hover {
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
  transform: translateY(-2px);
}
</style>
