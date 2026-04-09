<template>
  <q-card class="alerts-card">
    <q-card-section class="q-pb-none">
      <div class="row items-center justify-between">
        <div>
          <div class="alerts-title">Alertas Inteligentes</div>
          <div class="alerts-subtitle">Atenção aos itens abaixo</div>
        </div>
        <q-icon name="notifications_active" size="28px" color="warning" />
      </div>
    </q-card-section>

    <q-card-section>
      <div v-if="loading" class="q-gutter-sm">
        <q-skeleton v-for="i in 4" :key="i" type="rect" height="52px" class="rounded-borders" />
      </div>

      <div v-else-if="!alerts.length" class="no-alerts">
        <q-icon name="check_circle" size="36px" color="positive" />
        <span>Nenhum alerta no momento</span>
      </div>

      <q-list v-else separator>
        <q-item
          v-for="(alert, i) in alerts"
          :key="i"
          class="alert-item"
          :class="`alert-${alert.type || 'info'}`"
        >
          <q-item-section avatar>
            <q-icon
              :name="iconMap[alert.type] || 'info'"
              :color="colorMap[alert.type] || 'info'"
              size="22px"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="alert-message">{{ alert.message || alert.mensagem }}</q-item-label>
            <q-item-label caption v-if="alert.detail || alert.detalhe">
              {{ alert.detail || alert.detalhe }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge
              :color="colorMap[alert.type] || 'info'"
              :label="labelMap[alert.type] || alert.type"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  alerts: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const iconMap = {
  warning: 'warning',
  error: 'error',
  info: 'info',
  success: 'check_circle',
}

const colorMap = {
  warning: 'warning',
  error: 'negative',
  info: 'info',
  success: 'positive',
}

const labelMap = {
  warning: 'Atenção',
  error: 'Urgente',
  info: 'Info',
  success: 'OK',
}
</script>

<style scoped>
.alerts-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.alerts-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a237e;
}

.alerts-subtitle {
  font-size: 0.78rem;
  color: #90a4ae;
}

.alert-item {
  border-radius: 8px;
  margin: 4px 0;
  padding: 10px 12px;
}

.alert-warning {
  background: rgba(242, 192, 55, 0.08);
  border-left: 3px solid #f2c037;
}

.alert-error {
  background: rgba(193, 0, 21, 0.07);
  border-left: 3px solid #c10015;
}

.alert-info {
  background: rgba(49, 204, 236, 0.08);
  border-left: 3px solid #31ccec;
}

.alert-success {
  background: rgba(33, 186, 69, 0.08);
  border-left: 3px solid #21ba45;
}

.alert-message {
  font-size: 0.88rem;
  font-weight: 500;
  color: #37474f;
}

.no-alerts {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 0;
  color: #90a4ae;
  font-size: 0.9rem;
}
</style>
