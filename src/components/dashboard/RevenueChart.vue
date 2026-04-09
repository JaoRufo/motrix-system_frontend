<template>
  <q-card class="chart-card">
    <q-card-section class="q-pb-none">
      <div class="row items-center justify-between">
        <div>
          <div class="chart-title">Faturamento — Últimos {{ selectedDays }} dias</div>
          <div class="chart-subtitle">Receita diária em R$</div>
        </div>
        <div class="row items-center q-gutter-sm">
          <q-select
            v-model="selectedDays"
            :options="periodOptions"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            dense
            outlined
            style="min-width: 130px"
            @update:model-value="$emit('period-change', $event)"
          />
          <q-icon name="bar_chart" size="28px" color="primary" />
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <div v-if="loading" class="chart-skeleton">
        <q-skeleton
          v-for="i in selectedDays"
          :key="i"
          type="rect"
          :height="`${20 + i * 5}px`"
          style="flex: 1; max-width: 40px"
        />
      </div>
      <canvas v-else ref="canvasRef" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'

const props = defineProps({
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  days: { type: Number, default: 7 },
})

defineEmits(['period-change'])

const $q = useQuasar()
const canvasRef = ref(null)
const selectedDays = ref(props.days)

const periodOptions = [
  { label: 'Últimos 7 dias', value: 7 },
  { label: 'Últimos 30 dias', value: 30 },
]

let chartInstance = null

async function renderChart() {
  if (!canvasRef.value) return

  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)

  if (chartInstance) chartInstance.destroy()

  const isDark = $q.dark.isActive
  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'
  const tickColor = isDark ? '#90a4ae' : '#607d8b'

  const labels = props.data.map((d) => d.label || d.date || d.dia || '')
  const values = props.data.map((d) => parseFloat(d.value ?? d.total ?? d.faturamento ?? 0))

  chartInstance = new Chart(canvasRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Faturamento (R$)',
          data: values,
          backgroundColor: isDark ? 'rgba(66,165,245,0.7)' : 'rgba(13,71,161,0.75)',
          borderColor: isDark ? '#42a5f5' : '#0d47a1',
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
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            callback: (v) => {
              if (v >= 1000) return 'R$ ' + (v / 1000).toFixed(0) + 'k'
              return 'R$ ' + v.toLocaleString('pt-BR')
            },
            font: { size: 11 },
          },
        },
        x: {
          grid: { display: false },
          ticks: { color: tickColor, font: { size: 11 } },
        },
      },
    },
  })
}

watch(
  () => [props.data, props.loading, $q.dark.isActive],
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
  gap: 6px;
  padding: 0 8px;
}

canvas {
  width: 100% !important;
  height: 220px !important;
  display: block;
}

body.body--dark .chart-title {
  color: #e3f2fd;
}
</style>
