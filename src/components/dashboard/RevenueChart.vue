<template>
  <q-card class="chart-card">
    <q-card-section class="q-pb-none">
      <div class="row items-center justify-between">
        <div>
          <div class="chart-title">Faturamento dos Últimos 7 Dias</div>
          <div class="chart-subtitle">Receita diária em R$</div>
        </div>
        <q-icon name="bar_chart" size="28px" color="primary" />
      </div>
    </q-card-section>

    <q-card-section>
      <div v-if="loading" class="chart-skeleton">
        <q-skeleton v-for="i in 7" :key="i" type="rect" :height="`${30 + i * 15}px`" width="12%" />
      </div>
      <canvas v-else ref="canvasRef" height="220" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const canvasRef = ref(null)
let chartInstance = null

async function renderChart() {
  if (!canvasRef.value || !props.data.length) return

  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)

  if (chartInstance) chartInstance.destroy()

  const labels = props.data.map((d) => d.label || d.date || d.dia)
  const values = props.data.map((d) => d.value || d.total || d.faturamento || 0)

  chartInstance = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Faturamento (R$)',
          data: values,
          backgroundColor: 'rgba(13, 71, 161, 0.75)',
          borderColor: '#0d47a1',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              ' R$ ' + ctx.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            callback: (v) => 'R$ ' + v.toLocaleString('pt-BR'),
            font: { size: 11 },
          },
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } },
        },
      },
    },
  })
}

watch(
  () => [props.data, props.loading],
  async ([, loading]) => {
    if (!loading) {
      await nextTick()
      renderChart()
    }
  },
)

onUnmounted(() => chartInstance?.destroy())
</script>

<style scoped>
.chart-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.chart-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a237e;
}

.chart-subtitle {
  font-size: 0.78rem;
  color: #90a4ae;
}

.chart-skeleton {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 220px;
  gap: 8px;
  padding: 0 8px;
}

canvas {
  width: 100% !important;
  height: 220px !important;
}
</style>
