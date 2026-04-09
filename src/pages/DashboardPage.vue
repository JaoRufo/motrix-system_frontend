<template>
  <q-page class="dashboard-page q-pa-md">
    <!-- Header -->
    <div class="page-header q-mb-lg">
      <div>
        <div class="page-title">Dashboard</div>
        <div class="page-subtitle">Visão geral da oficina</div>
      </div>
      <div class="row items-center q-gutter-sm">
        <q-badge color="positive">
          <q-icon name="autorenew" size="12px" class="q-mr-xs" />
          Auto-refresh 1h
        </q-badge>
        <q-btn
          flat
          round
          icon="refresh"
          color="primary"
          :loading="loading"
          @click="loadAll"
          size="sm"
        >
          <q-tooltip>Atualizar agora</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Linha 1: Cards de resumo -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <DashboardCard
          title="Faturamento do Dia"
          :value="get(summary, 'faturamentoDia')"
          icon="today"
          color="#1565c0"
          prefix="R$ "
          :loading="loading"
          :is-float="true"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <DashboardCard
          title="Faturamento do Mês"
          :value="get(summary, 'faturamentoMes')"
          icon="attach_money"
          color="#2e7d32"
          prefix="R$ "
          :loading="loading"
          :is-float="true"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <DashboardCard
          title="Ordens Abertas"
          :value="get(summary, 'ordensAbertas')"
          icon="assignment"
          color="#e65100"
          :loading="loading"
          :clickable="true"
          subtitle="Clique para ver"
          @click="openModal('Aberta')"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <DashboardCard
          title="Em Andamento"
          :value="get(summary, 'ordensEmAndamento')"
          icon="build"
          color="#6a1b9a"
          :loading="loading"
          :clickable="true"
          subtitle="Clique para ver"
          @click="openModal('Em Andamento')"
        />
      </div>
    </div>

    <!-- Linha 2: Gráfico -->
    <div class="row q-mb-md">
      <div class="col-12">
        <RevenueChart
          :data="chartData"
          :loading="loading"
          :days="chartDays"
          @period-change="onPeriodChange"
        />
      </div>
    </div>

    <!-- Linha 3: Alertas -->
    <div class="row q-mb-md">
      <div class="col-12">
        <AlertsList :alerts="alerts" :loading="loading" />
      </div>
    </div>

    <!-- Linha 4: Cards de status -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6">
        <DashboardCard
          title="Ordens Finalizadas"
          :value="get(summary, 'ordensFinalizadas')"
          icon="check_circle"
          color="#00695c"
          :loading="loading"
          :clickable="true"
          subtitle="Clique para ver"
          @click="openModal('Finalizada')"
        />
      </div>
      <div class="col-12 col-sm-6">
        <DashboardCard
          title="Ordens Atrasadas"
          :value="get(summary, 'ordensAtrasadas')"
          icon="schedule"
          color="#b71c1c"
          :loading="loading"
          :clickable="true"
          subtitle="Clique para ver"
          @click="openModal('Atrasada')"
        />
      </div>
    </div>

    <!-- Modal de Ordens por Status -->
    <q-dialog v-model="modalOpen">
      <q-card
        style="
          width: 900px;
          max-width: 95vw;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
        "
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 row items-center q-gutter-sm">
            <q-badge :color="statusColor(modalStatus)" :label="modalStatus" />
            <span>Ordens — {{ modalStatus }}</span>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section style="overflow-y: auto; flex: 1">
          <q-table
            :rows="modalRows"
            :columns="modalColumns"
            row-key="id"
            flat
            :loading="modalLoading"
            :rows-per-page-options="[10, 25, 50]"
            dense
          >
            <template v-slot:body-cell-status="props">
              <q-td>
                <q-badge :color="statusColor(props.row.status)" :label="props.row.status" />
              </q-td>
            </template>
            <template v-slot:body-cell-total="props">
              <q-td>
                R$
                {{
                  parseFloat(props.row.total || 0).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })
                }}
              </q-td>
            </template>
            <template v-slot:body-cell-data="props">
              <q-td>{{ formatDate(props.row.data) }}</q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { dashboardService } from 'src/services/dashboardService'
import { ordemService } from 'src/services/ordemService'
import { clienteService } from 'src/services/clienteService'
import DashboardCard from 'src/components/dashboard/DashboardCard.vue'
import RevenueChart from 'src/components/dashboard/RevenueChart.vue'
import AlertsList from 'src/components/dashboard/AlertsList.vue'

const $q = useQuasar()

const loading = ref(true)
const summary = ref({})
const chartData = ref([])
const alerts = ref([])
const chartDays = ref(7)

// Modal
const modalOpen = ref(false)
const modalStatus = ref('')
const modalLoading = ref(false)
const modalRows = ref([])

const modalColumns = [
  { name: 'id', label: 'O.S', field: 'id', align: 'left', sortable: true },
  { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left' },
  { name: 'veiculo', label: 'Veículo / Placa', field: 'veiculo', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'total', label: 'Total', field: 'total', align: 'left', sortable: true },
  { name: 'data', label: 'Data', field: 'data', align: 'left', sortable: true },
]

const statusColors = {
  Aberta: 'blue',
  'Em Andamento': 'orange',
  'Aguardando Orçamento': 'purple',
  Finalizada: 'green',
  Cancelada: 'red',
  Atrasada: 'deep-orange',
}

// Mapa direto das chaves da API
const summaryMap = {
  faturamentoDia: 'totalRevenueToday',
  faturamentoMes: 'totalRevenueMonth',
  ordensAbertas: 'totalOrdersOpen',
  ordensEmAndamento: 'totalOrdersInProgress',
  ordensFinalizadas: 'totalOrdersCompleted',
  ordensAtrasadas: 'totalOrdersLate',
}

function get(obj, key, fallback = 0) {
  const apiKey = summaryMap[key]
  const val = obj[apiKey] ?? obj[key]
  return val !== undefined && val !== null ? val : fallback
}

function statusColor(s) {
  return statusColors[s] || 'grey'
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('pt-BR')
}

async function openModal(status) {
  modalStatus.value = status
  modalOpen.value = true
  modalLoading.value = true
  modalRows.value = []

  try {
    const res = await ordemService.listar(1, 9999)
    const todas = Array.isArray(res) ? res : (res.data ?? [])

    const filtradas = todas.filter((o) => {
      const s = (o.status || '').trim()
      if (status === 'Atrasada') {
        // Filtra ordens com data_prevista vencida e status ainda aberto/em andamento
        if (!o.data_prevista) return false
        const prevista = new Date(o.data_prevista)
        const abertaOuAndamento = s === 'Aberta' || s === 'Em Andamento'
        return abertaOuAndamento && prevista < new Date()
      }
      return s === status
    })

    // Busca o nome do cliente para cada ordem em paralelo
    const clienteCache = {}
    await Promise.all(
      [...new Set(filtradas.map((o) => o.cliente_id).filter(Boolean))].map(async (id) => {
        try {
          const c = await clienteService.buscarPorId(id)
          clienteCache[id] = c?.nome || c?.data?.nome || 'N/A'
        } catch {
          clienteCache[id] = 'N/A'
        }
      }),
    )

    modalRows.value = filtradas.map((o) => ({
      id: o.id,
      cliente: clienteCache[o.cliente_id] || 'N/A',
      veiculo: o.veiculo
        ? `${o.veiculo.modelo || ''} - ${o.veiculo.placa || ''}`.trim()
        : o.veiculo_placa || 'N/A',
      status: o.status,
      total: parseFloat(o.total) || 0,
      data: o.created_at || o.data,
    }))
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar ordens' })
  } finally {
    modalLoading.value = false
  }
}

async function onPeriodChange(days) {
  chartDays.value = days
  loading.value = true
  try {
    const c = await dashboardService.getRevenueChart(days)
    const payload = c ?? {}
    const raw = payload.data ?? payload.revenue ?? payload.chart ?? payload
    const arr = Array.isArray(raw) ? raw : []
    chartData.value = arr.map((d) => ({
      label: d.label ?? d.date ?? d.dia ?? d.data ?? '',
      value: parseFloat(d.value ?? d.total ?? d.faturamento ?? d.revenue ?? d.amount ?? 0),
    }))
  } catch {
    chartData.value = []
  } finally {
    loading.value = false
  }
}

let refreshTimer = null

async function loadAll() {
  loading.value = true
  try {
    const [s, c, a] = await Promise.allSettled([
      dashboardService.getSummary(),
      dashboardService.getRevenueChart(chartDays.value),
      dashboardService.getAlerts(),
    ])

    if (s.status === 'fulfilled') {
      // Normaliza: aceita { data: {...} } ou o objeto direto
      const raw = s.value?.data ?? s.value ?? {}
      summary.value = raw
    }

    if (c.status === 'fulfilled') {
      // O endpoint pode retornar { data: [...] }, { revenue: [...] }, ou o array direto
      const payload = c.value ?? {}
      const raw = payload.data ?? payload.revenue ?? payload.chart ?? payload
      chartData.value = Array.isArray(raw) ? raw : []
      if (chartData.value.length) {
        // Normaliza as chaves para o que o RevenueChart espera: { label, value }
        chartData.value = chartData.value.map((d) => ({
          label: d.label ?? d.date ?? d.dia ?? d.data ?? '',
          value: parseFloat(d.value ?? d.total ?? d.faturamento ?? d.revenue ?? d.amount ?? 0),
        }))
      }
    }

    if (a.status === 'fulfilled') {
      const raw = a.value?.data ?? a.value ?? []
      alerts.value = Array.isArray(raw) ? raw : []
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAll()
  refreshTimer = setInterval(loadAll, 3600000)
})

onUnmounted(() => clearInterval(refreshTimer))
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f4f6f9;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a237e;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 0.85rem;
  color: #90a4ae;
}

body.body--dark .dashboard-page {
  background: #121212;
}

body.body--dark .page-title {
  color: #e3f2fd;
}
</style>
