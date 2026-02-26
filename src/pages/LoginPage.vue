<template>
  <div class="login-bg flex flex-center">
    <q-card class="login-card shadow-10">
      <q-card-section class="text-center">
        <div class="text-h5 text-weight-bold text-primary">Motrix System</div>
        <div class="text-subtitle2 text-grey-7">Acesse sua conta</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="username" label="Usuário" outlined dense class="q-mb-md" />

        <q-input v-model="password" label="Senha" type="password" outlined dense />
      </q-card-section>

      <q-card-actions>
        <q-btn label="Entrar" color="primary" class="full-width" @click="login" />
      </q-card-actions>

      <q-card-section v-if="error" class="text-negative text-center">
        Usuário ou senha inválidos
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref(false)
const router = useRouter()

function login() {
  if (username.value === 'Admin' && password.value === '1234') {
    localStorage.setItem('user', JSON.stringify({ name: 'Admin' }))
    router.push('/ordens')
  } else {
    error.value = true
  }
}
</script>

<style scoped>
.login-bg {
  height: 100vh;
  background: linear-gradient(135deg, #0d47a1, #1565c0);
}

.login-card {
  width: 380px;
  border-radius: 12px;
}
</style>
