<template>
  <q-header elevated :class="headerClass">
    <q-toolbar>
      <q-toolbar-title class="text-weight-bold"> Sistema de Gestão </q-toolbar-title>

      <q-space />

      <!-- Dark Mode Toggle -->
      <q-btn flat round :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'" @click="toggleDark" />

      <!-- Perfil -->
      <q-btn flat round icon="account_circle">
        <q-menu>
          <q-list style="min-width: 150px">
            <q-item clickable v-close-popup @click="logout">
              <q-item-section class="text-negative"> Sair </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { authService } from '../../services/authService'

const $q = useQuasar()
const router = useRouter()

const headerClass = computed(() => {
  return $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-dark'
})

function toggleDark() {
  const newValue = !$q.dark.isActive
  $q.dark.set(newValue)
  localStorage.setItem('darkMode', newValue)
}

function logout() {
  authService.logout()
  router.push('/login')
}

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    $q.dark.set(savedDarkMode === 'true')
  }
})
</script>
