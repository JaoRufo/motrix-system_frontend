<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h6 text-weight-bold">Ordens de Serviço</div>
      <q-space />
      <q-btn label="Nova Ordem" color="primary" icon="add" to="/ordens/nova" class="btn-custom" />
    </div>

    <q-card flat bordered>
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-3">
            <q-input v-model="filtro.cliente" label="Cliente" outlined dense clearable />
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="filtro.placa" label="Placa" outlined dense clearable />
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="filtro.id" label="Nº O.S" outlined dense clearable type="number" />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="filtro.status"
              :options="statusOptions"
              label="Status"
              outlined
              dense
              clearable
            />
          </div>
          <div class="col-12 col-md-3 flex items-center">
            <q-btn label="Limpar Filtros" flat color="grey" @click="limparFiltros" />
          </div>
        </div>
      </q-card-section>

      <q-table :rows="ordensFiltradas" :columns="columns" row-key="id" flat :loading="loading">
        <template v-slot:body-cell-id="props">
          <q-td>
            <span @click="verDetalhes(props.row)" class="id-link">
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
            <q-btn icon="visibility" flat round color="info" @click="verDetalhes(props.row)">
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

    <!-- Dialog de Detalhes -->
    <q-dialog v-model="dialogDetalhes" maximized>
      <q-card v-if="ordemSelecionada">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Ordem de Serviço #{{ ordemSelecionada.id }}</div>
          <q-space />
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

            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey">Veículo</div>
              <div class="text-body1">{{ ordemSelecionada.veiculo }}</div>
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
              <q-item-section side>R$ {{ peca.valor.toFixed(2) }}</q-item-section>
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
              <q-item-section side>R$ {{ mao.valor.toFixed(2) }}</q-item-section>
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
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { ordemService } from '../../services/ordemService'

const $q = useQuasar()
const router = useRouter()

const filtro = ref({
  cliente: '',
  placa: '',
  id: '',
  status: '',
})

const statusOptions = ['Aberta', 'Em Andamento', 'Aguardando Orçamento', 'Finalizada', 'Cancelada']

function limparFiltros() {
  filtro.value = {
    cliente: '',
    placa: '',
    id: '',
    status: '',
  }
}

const ordensFiltradas = computed(() => {
  let resultado = ordens.value

  if (filtro.value.cliente) {
    const needle = filtro.value.cliente.toLowerCase()
    resultado = resultado.filter((o) => o.cliente?.toLowerCase().includes(needle))
  }

  if (filtro.value.placa) {
    const needle = filtro.value.placa.toLowerCase()
    resultado = resultado.filter((o) => o.veiculoPlaca?.toLowerCase().includes(needle))
  }

  if (filtro.value.id) {
    resultado = resultado.filter((o) => o.id.toString().includes(filtro.value.id))
  }

  if (filtro.value.status) {
    resultado = resultado.filter((o) => o.status === filtro.value.status)
  }

  return resultado
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left' },
  { name: 'veiculo', label: 'Veículo', field: 'veiculo', align: 'left' },
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
    const data = await ordemService.listar()
    ordens.value = data.map((ordem) => ({
      id: ordem.id,
      cliente: ordem.cliente?.nome || ordem.cliente_nome || 'N/A',
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
      oficina: ordem.oficina || null,
    }))
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar ordens' })
  } finally {
    loading.value = false
  }
}

function verDetalhes(ordem) {
  ordemSelecionada.value = ordem
  dialogDetalhes.value = true
}

function editarOrdem(id) {
  router.push(`/ordens/nova/${id}`)
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
