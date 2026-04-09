<template>
  <q-header elevated :class="headerClass">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
        class="lt-md"
      />

      <q-toolbar-title class="text-weight-bold toolbar-title">
        <span class="title-full">Sistema de Gestão</span>
        <span class="title-short">Motrix</span>
      </q-toolbar-title>

      <q-space />

      <div
        v-if="oficinaUsuario"
        class="oficina-info text-subtitle2 q-mr-md text-primary text-weight-bold"
      >
        Oficina: {{ oficinaUsuario }}
      </div>

      <div class="user-greeting text-subtitle2 q-mr-md">{{ saudacao }} {{ nomeUsuario }}</div>

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
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { authService } from '../../services/authService'
import { oficinaService } from '../../services/oficinaService'

const $q = useQuasar()
const router = useRouter()
const oficinaUsuario = ref(null)

const emit = defineEmits(['toggle-drawer'])

function toggleLeftDrawer() {
  emit('toggle-drawer')
}

const headerClass = computed(() => {
  return $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-dark'
})

const saudacao = computed(() => {
  const hora = new Date().getHours()
  if (hora >= 6 && hora < 12) return 'Bom dia'
  if (hora >= 12 && hora < 18) return 'Boa tarde'
  return 'Boa noite'
})

const nomeUsuario = computed(() => {
  const user = authService.getUser()
  return user?.username || user?.nome || 'Usuário'
})

async function carregarOficina() {
  const user = authService.getUser()
  if (user?.role === 'user' && user?.id) {
    try {
      const mecanicos = await oficinaService.buscarMecanicos()
      const mecanicoLogado = mecanicos.find((m) => m.id === user.id)
      if (mecanicoLogado?.oficina_nome) {
        oficinaUsuario.value = mecanicoLogado.oficina_nome
      }
    } catch (error) {
      console.error('Erro ao carregar oficina:', error)
    }
  }
}

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
  carregarOficina()
})
</script>

<style scoped>
.toolbar-title {
  transition: all 0.3s ease-in-out;
}

.title-short {
  display: none;
}

@media (max-width: 800px) {
  .toolbar-title {
    font-size: 1rem;
  }

  .title-full {
    display: none;
  }

  .title-short {
    display: inline;
  }

  .oficina-info {
    display: none;
  }

  .user-greeting {
    display: none;
  }
}

@media (min-width: 801px) and (max-width: 1024px) {
  .oficina-info {
    font-size: 0.85rem;
  }

  .user-greeting {
    font-size: 0.85rem;
  }
}
</style>
