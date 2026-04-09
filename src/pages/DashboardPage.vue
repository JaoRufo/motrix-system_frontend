<template>
  <q-page class="dashboard-page q-pa-md">
    <!-- Header -->
    <div class="page-header q-mb-lg">
      <div>
        <div class="page-title">Dashboard</div>
        <div class="page-subtitle">Visão geral da oficina</div>
      </div>
      <div class="row items-center gap-sm">
        <q-badge color="positive" class="q-mr-sm">
          <q-icon name="autorenew" size="12px" class="q-mr-xs" />
          Auto-refresh 30s
        </q-badge>
        <q-btn
          flat
          round
          icon="refresh"
          color="primary"
          :loading="loading"
          @click="loadAll"
          size="sm"
        />
      </div>
    </div>

    <!-- Linha 1: Cards de resumo -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <DashboardCard
          title="Faturamento do Dia"
          :value="summary.faturamentoDia ?? 0"
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
          :value="summary.faturamentoMes ?? 0"
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
          :value="summary.ordensAbertas ?? 0"
          icon="assignment"
          color="#e65100"
          :loading="loading"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <DashboardCard
          title="Em Andamento"
          :value="summary.ordensEmAndamento ?? 0"
          icon="build"
          color="#6a1b9a"
          :loading="loading"
        />
      </div>
    </div>

    <!-- Linha 2: Gráfico -->
    <div class="row q-mb-md">
      <div class="col-12">
        <RevenueChart :data="chartData" :loading="loading" />
      </div>
    </div>

    <!-- Linha 3: Cards de status -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6">
        <DashboardCard
          title="Ordens Finalizadas"
          :value="summary.ordensFinalizadas ?? 0"
          icon="check_circle"
          color="#00695c"
          :loading="loading"
          subtitle="Total do mês"
        />
      </div>
      <div class="col-12 col-sm-6">
        <DashboardCard
          title="Ordens Atrasadas"
          :value="summary.ordensAtrasadas ?? 0"
          icon="schedule"
          color="#b71c1c"
          :loading="loading"
          subtitle="Requerem atenção"
        />
      </div>
    </div>

    <!-- Linha 4: Alertas -->
    <div class="row">
      <div class="col-12">
        <AlertsList :alerts="alerts" :loading="loading" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { dashboardService } from 'src/services/dashboardService'
import DashboardCard from 'src/components/dashboard/DashboardCard.vue'
import RevenueChart from 'src/components/dashboard/RevenueChart.vue'
import AlertsList from 'src/components/dashboard/AlertsList.vue'

const loading = ref(true)
const summary = ref({})
const chartData = ref([])
const alerts = ref([])

let refreshTimer = null

async function loadAll() {
  loading.value = true
  try {
    const [s, c, a] = await Promise.allSettled([
      dashboardService.getSummary(),
      dashboardService.getRevenueChart(7),
      dashboardService.getAlerts(),
    ])

    if (s.status === 'fulfilled') summary.value = s.value?.data ?? s.value ?? {}
    if (c.status === 'fulfilled') {
      const raw = c.value?.data ?? c.value ?? []
      chartData.value = Array.isArray(raw) ? raw : []
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
  refreshTimer = setInterval(loadAll, 30000)
})

onUnmounted(() => clearInterval(refreshTimer))
</script>

<style scoped>
.dashboard-page {
  background: #f4f6f9;
  min-height: 100vh;
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

.gap-sm {
  gap: 8px;
}
</style>
