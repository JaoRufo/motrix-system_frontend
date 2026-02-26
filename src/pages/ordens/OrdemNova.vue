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
        <div class="col-12 col-md-4">
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
                <q-item-section class="text-grey">
                  Nenhum cliente encontrado
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-4">
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

        <div class="col-12 col-md-4">
          <q-input v-model.number="kmAtual" label="KM Atual *" outlined dense type="number" />
        </div>

        <div class="col-12">
          <q-input v-model="observacoes" label="Observações / Relato do Cliente" outlined dense type="textarea" rows="3" />
        </div>
      </div>

      <!-- HISTÓRICO DO VEÍCULO -->
      <div v-if="historicoVeiculo.length > 0" class="q-mt-md">
        <q-expansion-item label="Último Serviço" icon="history" header-class="bg-blue-1">
          <q-card>
            <q-card-section>
              <div class="text-weight-bold">Data: {{ new Date(historicoVeiculo[0].data).toLocaleDateString() }}</div>
              <div>KM: {{ historicoVeiculo[0].kmAtual }}</div>
              <div class="q-mt-sm text-weight-bold">Serviços:</div>
              <ul>
                <li v-for="(servico, idx) in historicoVeiculo[0].maoObra" :key="idx">
                  {{ servico.descricao }} - R$ {{ servico.valor.toFixed(2) }}
                </li>
              </ul>
              <div class="text-weight-bold q-mt-sm">Peças:</div>
              <ul>
                <li v-for="(peca, idx) in historicoVeiculo[0].pecas" :key="idx">
                  {{ peca.nome }} - R$ {{ peca.valor.toFixed(2) }}
                </li>
              </ul>
              <div class="text-weight-bold q-mt-sm">Total: R$ {{ historicoVeiculo[0].total.toFixed(2) }}</div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>

      <q-separator class="q-my-md" />

      <!-- PEÇAS -->
      <div class="text-subtitle1 text-weight-bold q-mb-sm">Peças</div>

      <div v-for="(peca, index) in pecas" :key="index" class="row q-col-gutter-md q-mb-sm">
        <div class="col-5">
          <q-input v-model="peca.nome" label="Peça" dense outlined />
        </div>

        <div class="col-3">
          <q-input v-model.number="peca.valor" type="number" label="Valor" dense outlined />
        </div>

        <div class="col-2 flex flex-center">
          <q-btn icon="delete" flat color="negative" @click="removerPeca(index)" />
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
          <q-input v-model.number="mao.valor" type="number" label="Valor" dense outlined />
        </div>

        <div class="col-2 flex flex-center">
          <q-btn icon="delete" flat color="negative" @click="removerMao(index)" />
        </div>
      </div>

      <q-btn label="Adicionar Serviço" flat icon="add" color="primary" @click="adicionarMao" />

      <q-separator class="q-my-md" />

      <div class="text-right text-h6 text-weight-bold">Total: R$ {{ total.toFixed(2) }}</div>

      <div class="q-mt-md text-right">
        <q-btn label="Cancelar" flat color="grey" @click="$router.back()" class="q-mr-sm" />
        <q-btn label="Salvar" color="primary" @click="salvar" :loading="salvando" />
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
const pecas = ref([])
const maoObra = ref([])
const clientesOptions = ref([])
const todosClientes = ref([])
const veiculosOptions = ref([])
const historicoVeiculo = ref([])
const salvando = ref(false)
const observacoes = ref('')

const isEdit = computed(() => !!route.params.id)

const total = computed(() => {
  const totalPecas = pecas.value.reduce((acc, p) => acc + (p.valor || 0), 0)
  const totalMao = maoObra.value.reduce((acc, m) => acc + (m.valor || 0), 0)
  return totalPecas + totalMao
})

function filtrarClientes(val, update) {
  update(() => {
    if (val === '') {
      clientesOptions.value = todosClientes.value
    } else {
      const needle = val.toLowerCase()
      clientesOptions.value = todosClientes.value.filter(
        (c) => c.nome.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

function selecionarCliente(cliente) {
  veiculoSelecionado.value = null
  historicoVeiculo.value = []
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
    carregarHistorico()
  }
}

function carregarHistorico() {
  if (!clienteSelecionado.value || !veiculoSelecionado.value) return

  const ordens = JSON.parse(localStorage.getItem('ordens') || '[]')
  historicoVeiculo.value = ordens
    .filter(
      (o) =>
        o.clienteId == clienteSelecionado.value.id &&
        o.veiculoPlaca === veiculoSelecionado.value.value.placa
    )
    .sort((a, b) => b.data - a.data)
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

  salvando.value = true

  try {
    const ordens = JSON.parse(localStorage.getItem('ordens') || '[]')

    const ordemData = {
      clienteId: clienteSelecionado.value.id,
      cliente: clienteSelecionado.value.nome,
      veiculo: veiculoSelecionado.value.label,
      veiculoPlaca: veiculoSelecionado.value.value.placa,
      kmAtual: kmAtual.value,
      observacoes: observacoes.value,
      pecas: pecas.value.filter((p) => p.nome),
      maoObra: maoObra.value.filter((m) => m.descricao),
      total: total.value,
      data: Date.now(),
      status: 'Aberta',
    }

    if (isEdit.value) {
      const index = ordens.findIndex((o) => o.id == route.params.id)
      ordens[index] = { ...ordens[index], ...ordemData }
    } else {
      ordens.push({ id: Date.now(), ...ordemData })
    }

    localStorage.setItem('ordens', JSON.stringify(ordens))

    // Atualizar KM do veículo
    const cliente = clienteService.buscarPorId(clienteSelecionado.value.id)
    if (cliente) {
      const veiculoIndex = cliente.veiculos.findIndex(
        (v) => v.placa === veiculoSelecionado.value.value.placa
      )
      if (veiculoIndex !== -1) {
        cliente.veiculos[veiculoIndex].kmAtual = kmAtual.value
        clienteService.atualizar(cliente.id, cliente)
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
      observacoes.value = ordem.observacoes || ''
      pecas.value = ordem.pecas || []
      maoObra.value = ordem.maoObra || []
      carregarHistorico()
    }
  }
})
</script>
