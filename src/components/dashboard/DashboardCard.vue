<template>
  <q-card
    class="dashboard-card"
    :style="`--card-color: ${color}`"
    :class="{ 'cursor-pointer': clickable }"
    @click="clickable && $emit('click')"
  >
    <q-card-section class="card-inner">
      <div class="card-icon-wrap">
        <q-icon :name="icon" size="22px" color="white" />
      </div>
      <div class="card-content">
        <div class="card-title">{{ title }}</div>
        <q-skeleton v-if="loading" type="text" width="60px" height="24px" class="q-mt-xs" />
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
  clickable: { type: Boolean, default: false },
})

defineEmits(['click'])

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
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-top: 4px solid var(--card-color);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  height: 100%;
}

.dashboard-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

/* Mobile: layout vertical, compacto */
.card-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
}

.card-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--card-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

.card-content {
  width: 100%;
  min-width: 0;
}

.card-title {
  font-size: 0.65rem;
  font-weight: 600;
  color: #78909c;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a237e;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-subtitle {
  font-size: 0.65rem;
  color: #90a4ae;
  margin-top: 1px;
}

/* Tablet e desktop: layout horizontal */
@media (min-width: 600px) {
  .card-inner {
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }

  .card-icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: 14px;
  }

  .card-title {
    font-size: 0.78rem;
    margin-bottom: 4px;
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }

  .card-value {
    font-size: 1.6rem;
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }

  .card-subtitle {
    font-size: 0.75rem;
  }
}

/* Dark mode */
body.body--dark .card-title {
  color: #90a4ae;
}

body.body--dark .card-value {
  color: #e3f2fd;
}

body.body--dark .card-subtitle {
  color: #607d8b;
}
</style>
