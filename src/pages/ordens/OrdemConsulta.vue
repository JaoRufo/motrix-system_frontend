<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h6 text-weight-bold">Ordens de Serviço</div>
      <q-space />
      <q-btn label="Nova Ordem" color="primary" icon="add" to="/ordens/nova" class="btn-custom" />
    </div>

    <q-card flat bordered>
      <q-card-section class="row items-center">
        <q-btn
          label="Filtros"
          icon="filter_list"
          color="primary"
          outline
          @click="dialogFiltros = true"
        />
        <q-space />
        <q-chip v-if="temFiltrosAtivos" color="primary" text-color="white" icon="filter_alt">
          Filtros ativos
        </q-chip>
      </q-card-section>

      <q-table
        :rows="ordens"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
        :rows-per-page-options="[10, 25, 50]"
      >
        <template v-slot:body-cell-id="props">
          <q-td>
            <span @click="verDetalhes(props.row.id)" class="id-link">
              {{ props.row.id }}
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td>
            <q-badge :color="getStatusColor(props.row.status)" :label="props.row.status" />
          </q-td>
        </template>

        <template v-slot:body-cell-acoes="props">
          <q-td align="center">
            <q-btn icon="visibility" flat round color="info" @click="verDetalhes(props.row.id)">
              <q-tooltip>Visualizar Detalhes</q-tooltip>
            </q-btn>
            <q-btn icon="edit" flat round color="primary" @click="editarOrdem(props.row.id)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn icon="picture_as_pdf" flat round color="red" @click="baixarPDF(props.row.id)">
              <q-tooltip>Baixar PDF</q-tooltip>
            </q-btn>
            <q-btn icon="delete" flat round color="negative" @click.stop="excluir(props.row.id)">
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Dialog de Filtros -->
    <q-dialog v-model="dialogFiltros">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Filtros</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div v-if="!temCamposFiltro" class="text-center text-grey q-pa-md">
            Nenhum campo de filtro disponível
          </div>
          <div v-else>
            <q-input v-model="filtro.placa" label="Placa" outlined dense class="q-mb-md" />
            <q-input
              v-model="filtro.id"
              label="Nº O.S"
              outlined
              dense
              type="number"
              class="q-mb-md"
            />
            <q-select
              v-model="filtro.status"
              :options="statusOptions"
              label="Status"
              outlined
              dense
              clearable
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Limpar" flat color="grey" @click="limparFiltros" />
          <q-btn label="Aplicar" color="primary" @click="dialogFiltros = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de Detalhes -->
    <q-dialog v-model="dialogDetalhes" maximized>
      <q-card v-if="ordemSelecionada">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Ordem de Serviço #{{ ordemSelecionada.id }}</div>
          <q-space />
          <q-btn icon="edit" flat round color="primary" @click="editarOrdem(ordemSelecionada.id)">
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            icon="picture_as_pdf"
            flat
            round
            color="red"
            @click="baixarPDF(ordemSelecionada.id)"
          >
            <q-tooltip>Baixar PDF</q-tooltip>
          </q-btn>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey">Cliente</div>
              <div class="text-body1">{{ ordemSelecionada.cliente }}</div>
            </div>

            <div v-if="ordemSelecionada.telefone" class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey">Telefone</div>
              <div class="text-body1">{{ ordemSelecionada.telefone }}</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey">Veículo</div>
              <div class="text-body1">{{ ordemSelecionada.veiculo }}</div>
            </div>

            <div v-if="ordemSelecionada.veiculoModelo" class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey">Modelo</div>
              <div class="text-body1">{{ ordemSelecionada.veiculoModelo }}</div>
            </div>

            <div v-if="ordemSelecionada.veiculoAno" class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey">Ano</div>
              <div class="text-body1">{{ ordemSelecionada.veiculoAno }}</div>
            </div>

            <div v-if="ordemSelecionada.veiculoChassi" class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey">Chassi</div>
              <div class="text-body1">{{ ordemSelecionada.veiculoChassi }}</div>
            </div>

            <div v-if="ordemSelecionada.veiculoCor" class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey">Cor</div>
              <div class="text-body1">{{ ordemSelecionada.veiculoCor }}</div>
            </div>

            <div v-if="ordemSelecionada.oficina" class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey">Oficina</div>
              <div class="text-body1">{{ ordemSelecionada.oficina.nome }}</div>
            </div>

            <div class="col-12 col-md-4">
              <div class="text-subtitle2 text-grey">KM</div>
              <div class="text-body1">{{ ordemSelecionada.kmAtual }}</div>
            </div>

            <div class="col-12 col-md-4">
              <div class="text-subtitle2 text-grey">Status</div>
              <q-badge
                :color="getStatusColor(ordemSelecionada.status)"
                :label="ordemSelecionada.status"
              />
            </div>

            <div class="col-12 col-md-4">
              <div class="text-subtitle2 text-grey">Data</div>
              <div class="text-body1">
                {{ new Date(ordemSelecionada.data).toLocaleString('pt-BR') }}
              </div>
            </div>

            <div class="col-12">
              <div class="text-subtitle2 text-grey">Descrição do Problema</div>
              <div class="text-body1">{{ ordemSelecionada.descricaoProblema }}</div>
            </div>

            <div v-if="ordemSelecionada.observacoes" class="col-12">
              <div class="text-subtitle2 text-grey">Observações</div>
              <div class="text-body1">{{ ordemSelecionada.observacoes }}</div>
            </div>

            <div v-if="ordemSelecionada.motivoCancelamento" class="col-12">
              <div class="text-subtitle2 text-negative">Motivo do Cancelamento</div>
              <div class="text-body1">{{ ordemSelecionada.motivoCancelamento }}</div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-h6 q-mb-md">Peças Utilizadas</div>
          <q-list bordered separator v-if="ordemSelecionada.pecas && ordemSelecionada.pecas.length">
            <q-item v-for="(peca, idx) in ordemSelecionada.pecas" :key="idx">
              <q-item-section>{{ peca.nome }}</q-item-section>
              <q-item-section side>R$ {{ parseFloat(peca.valor || 0).toFixed(2) }}</q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-grey">Nenhuma peça utilizada</div>

          <q-separator class="q-my-md" />

          <div class="text-h6 q-mb-md">Mão de Obra</div>
          <q-list
            bordered
            separator
            v-if="ordemSelecionada.maoObra && ordemSelecionada.maoObra.length"
          >
            <q-item v-for="(mao, idx) in ordemSelecionada.maoObra" :key="idx">
              <q-item-section>{{ mao.descricao }}</q-item-section>
              <q-item-section side>R$ {{ parseFloat(mao.valor || 0).toFixed(2) }}</q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-grey">Nenhum serviço realizado</div>

          <q-separator class="q-my-md" />

          <div class="text-h5 text-right text-weight-bold">
            Total: R$ {{ ordemSelecionada.total.toFixed(2) }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { ordemService } from '../../services/ordemService'
import { clienteService } from '../../services/clienteService'
import { oficinaService } from '../../services/oficinaService'

const $q = useQuasar()
const router = useRouter()

const dialogFiltros = ref(false)
const filtro = ref({
  placa: '',
  id: '',
  status: '',
})

const statusOptions = ['Aberta', 'Em Andamento', 'Aguardando Orçamento', 'Finalizada', 'Cancelada']

function limparFiltros() {
  filtro.value = {
    placa: '',
    id: '',
    status: '',
  }
}

const ordensFiltradas = computed(() => {
  let resultado = todasOrdens.value

  if (filtro.value.placa) {
    const needle = filtro.value.placa.toLowerCase()
    resultado = resultado.filter((o) => o.veiculoPlaca?.toLowerCase().includes(needle))
  }

  if (filtro.value.id) {
    resultado = resultado.filter((o) => o.id.toString().includes(filtro.value.id))
  }

  if (filtro.value.status) {
    const needle = filtro.value.status.toLowerCase()
    resultado = resultado.filter((o) => o.status?.toLowerCase() === needle)
  }

  return resultado
})

const totalFiltrado = computed(() => ordensFiltradas.value.length)

const temFiltrosAtivos = computed(() => {
  return !!(filtro.value.placa || filtro.value.id || filtro.value.status)
})

const temCamposFiltro = computed(() => {
  return true
})

const columns = [
  { name: 'id', label: 'O.S', field: 'id', align: 'left' },
  { name: 'veiculo', label: 'Placa', field: 'veiculo', align: 'left' },
  { name: 'kmAtual', label: 'KM', field: 'kmAtual', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  {
    name: 'total',
    label: 'Total (R$)',
    field: 'total',
    align: 'left',
    format: (val) => (typeof val === 'number' ? val.toFixed(2) : '0.00'),
  },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const ordens = ref([])
const todasOrdens = ref([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})
const dialogDetalhes = ref(false)
const ordemSelecionada = ref(null)
const loading = ref(false)

const statusColors = {
  Aberta: 'blue',
  'Em Andamento': 'orange',
  'Aguardando Orçamento': 'purple',
  Finalizada: 'green',
  Cancelada: 'red',
}

function getStatusColor(status) {
  return statusColors[status] || 'grey'
}

async function carregar() {
  loading.value = true
  try {
    const response = await ordemService.listar(1, 9999)
    todasOrdens.value = response.data.map((ordem) => {
      const clienteNome = ordem.cliente?.nome || ordem.cliente_nome || 'N/A'
      const oficinaNome = ordem.oficina?.nome || null

      return {
        id: ordem.id,
        cliente: clienteNome,
        clienteId: ordem.cliente_id,
        veiculo: ordem.veiculo
          ? `${ordem.veiculo.modelo} - ${ordem.veiculo.placa}`
          : ordem.veiculo_placa || 'N/A',
        veiculoId: ordem.veiculo_id,
        veiculoPlaca: ordem.veiculo_placa,
        kmAtual: ordem.km_atual,
        status: ordem.status,
        descricaoProblema: ordem.descricao_problema,
        observacoes: ordem.observacoes,
        motivoCancelamento: ordem.motivo_cancelamento,
        data: ordem.created_at || ordem.data,
        total: parseFloat(ordem.total) || 0,
        pecas: ordem.pecas || [],
        maoObra: ordem.maoObra || ordem.mao_obra || [],
        oficina: oficinaNome ? { nome: oficinaNome } : null,
      }
    })
    atualizarPaginacao()
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar ordens' })
  } finally {
    loading.value = false
  }
}

function atualizarPaginacao() {
  const filtered = ordensFiltradas.value
  const startIndex = (pagination.value.page - 1) * pagination.value.rowsPerPage
  const endIndex = startIndex + pagination.value.rowsPerPage
  ordens.value = filtered.slice(startIndex, endIndex)
  pagination.value.rowsNumber = filtered.length
}

function onRequest(props) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  atualizarPaginacao()
}

async function verDetalhes(ordemId) {
  try {
    const ordem = await ordemService.buscarPorId(ordemId)

    let clienteNome = 'N/A'
    let clienteTelefone = null
    let oficinaNome = null
    let veiculoInfo = {}

    if (ordem.cliente_id) {
      try {
        const cliente = await clienteService.buscarPorId(ordem.cliente_id)
        clienteNome = cliente.nome || 'N/A'
        clienteTelefone = cliente.telefone || null

        if (ordem.veiculo_id && cliente.veiculos) {
          const veiculo = cliente.veiculos.find((v) => v.id === ordem.veiculo_id)
          if (veiculo) {
            veiculoInfo = {
              modelo: veiculo.modelo,
              ano: veiculo.ano,
              chassi: veiculo.chassi,
              cor: veiculo.cor,
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar cliente:', error)
      }
    }

    if (ordem.oficina_id) {
      try {
        const oficinas = await oficinaService.buscar()
        const oficinasArray = Array.isArray(oficinas) ? oficinas : [oficinas]
        const oficina = oficinasArray.find((o) => o.id === ordem.oficina_id)
        if (oficina) oficinaNome = oficina.nome
      } catch (error) {
        console.error('Erro ao buscar oficina:', error)
      }
    }

    ordemSelecionada.value = {
      id: ordem.id,
      cliente: clienteNome,
      telefone: clienteTelefone,
      veiculo: ordem.veiculo
        ? `${ordem.veiculo.modelo} - ${ordem.veiculo.placa}`
        : ordem.veiculo_placa || 'N/A',
      veiculoModelo: veiculoInfo.modelo || null,
      veiculoAno: veiculoInfo.ano || null,
      veiculoChassi: veiculoInfo.chassi || null,
      veiculoCor: veiculoInfo.cor || null,
      kmAtual: ordem.km_atual,
      status: ordem.status,
      descricaoProblema: ordem.descricao_problema,
      observacoes: ordem.observacoes,
      motivoCancelamento: ordem.motivo_cancelamento,
      data: ordem.created_at || ordem.data,
      total: parseFloat(ordem.total) || 0,
      pecas: (ordem.pecas || []).map((p) => ({ ...p, valor: parseFloat(p.valor || 0) })),
      maoObra: (ordem.maoObra || ordem.mao_obra || []).map((m) => ({
        ...m,
        valor: parseFloat(m.valor || 0),
      })),
      oficina: oficinaNome ? { nome: oficinaNome } : null,
    }
    dialogDetalhes.value = true
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar detalhes da ordem' })
  }
}

function editarOrdem(id) {
  router.push(`/ordens/nova/${id}`).then(() => {
    router.go(0)
  })
}

async function baixarPDF(id) {
  try {
    await ordemService.baixarPDF(id)
    $q.notify({ type: 'positive', message: 'PDF baixado com sucesso!' })
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao baixar PDF' })
  }
}

function excluir(id) {
  $q.dialog({
    title: 'Confirmar',
    message: 'Deseja realmente excluir esta ordem de serviço?',
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Excluir', color: 'negative' },
  }).onOk(async () => {
    try {
      await ordemService.excluir(id)
      $q.notify({ type: 'positive', message: 'Ordem excluída com sucesso!' })
      carregar()
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao excluir ordem' })
    }
  })
}

onMounted(() => {
  carregar()
})

watch(
  [totalFiltrado, () => filtro.value],
  () => {
    pagination.value.page = 1
    atualizarPaginacao()
  },
  { deep: true },
)
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

.id-link {
  cursor: pointer;
  color: black;
}

.id-link:hover {
  text-decoration: underline;
}

body.body--dark .id-link {
  color: white;
}
</style>
