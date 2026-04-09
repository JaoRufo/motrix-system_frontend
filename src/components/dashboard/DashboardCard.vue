<template>
  <q-card class="dashboard-card" :style="`--card-color: ${color}`">
    <q-card-section class="card-inner">
      <div class="card-icon-wrap">
        <q-icon :name="icon" size="28px" color="white" />
      </div>
      <div class="card-content">
        <div class="card-title">{{ title }}</div>
        <q-skeleton v-if="loading" type="text" width="80px" height="32px" class="q-mt-xs" />
        <div v-else class="card-value">{{ displayValue }}</div>
        <div v-if="subtitle && !loading" class="card-subtitle">{{ subtitle }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  title: String,
  value: { type: [Number, String], default: 0 },
  icon: { type: String, default: 'info' },
  color: { type: String, default: '#1565c0' },
  loading: { type: Boolean, default: false },
  prefix: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  isFloat: { type: Boolean, default: false },
})

const displayValue = ref(props.prefix + '0')
let animFrame = null

function animateCount(target) {
  const numericTarget = parseFloat(String(target).replace(/[^\d.]/g, '')) || 0
  const duration = 800
  const start = performance.now()

  function step(now) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = numericTarget * eased

    displayValue.value = props.isFloat
      ? props.prefix +
        current.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : props.prefix + Math.round(current).toLocaleString('pt-BR')

    if (progress < 1) animFrame = requestAnimationFrame(step)
  }

  animFrame = requestAnimationFrame(step)
}

watch(
  () => [props.value, props.loading],
  ([val, loading]) => {
    if (!loading && val !== undefined) {
      cancelAnimationFrame(animFrame)
      animateCount(val)
    }
  },
  { immediate: true },
)

onUnmounted(() => cancelAnimationFrame(animFrame))
</script>

<style scoped>
.dashboard-card {
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-top: 4px solid var(--card-color);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  height: 100%;
}

.dashboard-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.card-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--card-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 0.78rem;
  font-weight: 600;
  color: #78909c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.card-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a237e;
  line-height: 1.2;
}

.card-subtitle {
  font-size: 0.75rem;
  color: #90a4ae;
  margin-top: 2px;
}
</style>
