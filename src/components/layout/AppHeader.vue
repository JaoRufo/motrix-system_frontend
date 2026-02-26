<template>
  <q-header elevated :class="headerClass">
    <q-toolbar>
      <q-toolbar-title class="text-weight-bold"> Sistema de Gestão </q-toolbar-title>

      <q-space />

      <!-- Dark Mode Toggle -->
      <q-btn flat round :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'" @click="toggleDark" />

      <!-- Perfil -->
      <q-btn flat round>
        <q-avatar size="32px">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>

        <q-menu>
          <q-list style="min-width: 150px">
            <q-item clickable v-close-popup>
              <q-item-section> Meu Perfil </q-item-section>
            </q-item>

            <q-separator />

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
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const headerClass = computed(() => {
  return $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-dark'
})

function toggleDark() {
  $q.dark.set(!$q.dark.isActive)
}

function logout() {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
