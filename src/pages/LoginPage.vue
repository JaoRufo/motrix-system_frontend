<template>
  <div class="login-container">
    <div class="login-left">
      <div class="brand-section">
        <img src="../assets/motriz-system-logo-new.png" alt="Motrix System" class="brand-logo" />
        <h2 class="brand-title">Sistema de Gestão Automotiva</h2>
        <p class="brand-subtitle">Controle completo da sua oficina em um só lugar</p>
      </div>
    </div>

    <div class="login-right">
      <q-card flat class="login-card">
        <q-card-section class="card-header">
          <h2 class="login-title">Bem-vindo</h2>
          <p class="login-subtitle">Faça login para continuar</p>
        </q-card-section>

        <q-card-section class="card-body">
          <q-input
            v-model="username"
            label="Usuário"
            outlined
            dense
            class="input-field"
            :error="error"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="blue-7" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            label="Senha"
            :type="isPwd ? 'password' : 'text'"
            outlined
            dense
            class="input-field"
            :error="error"
            @keyup.enter="login"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="blue-7" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div v-if="error" class="error-message">
            <q-icon name="error" size="18px" />
            Usuário ou senha inválidos
          </div>

          <q-btn
            label="Entrar"
            color="primary"
            class="login-btn"
            @click="login"
            unelevated
            size="lg"
          />
        </q-card-section>
      </q-card>

      <div class="footer-text">© 2026 Motrix System. Todos os direitos reservados.</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref(false)
const isPwd = ref(true)
const router = useRouter()

function login() {
  if ((username.value === 'Admin' || username.value === 'user') && password.value === '1234') {
    localStorage.setItem('user', JSON.stringify({ name: username.value, role: username.value === 'Admin' ? 'admin' : 'user' }))
    router.push('/ordens')
  } else {
    error.value = true
    setTimeout(() => {
      error.value = false
    }, 3000)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.login-left {
  flex: 1;
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #f5f7fa 25%,
    #e8ecf1 50%,
    #d4dce5 75%,
    #c0cad6 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(42, 82, 152, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  top: -200px;
  right: -200px;
}

.login-left::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(42, 82, 152, 0.03) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -150px;
  left: -150px;
}

.brand-section {
  text-align: center;
  z-index: 1;
  max-width: 500px;
}

.brand-logo {
  width: 100%;
  max-width: 350px;
  height: auto;
  margin-bottom: 30px;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e3c72;
  margin: 0 0 15px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.brand-subtitle {
  font-size: 1.2rem;
  color: #2a5298;
  margin: 0;
  font-weight: 400;
}

.login-right {
  flex: 1;
  background: linear-gradient(
    135deg,
    #1e3c72 0%,
    #234a7d 25%,
    #2a5298 50%,
    #3461a8 75%,
    #3d6fb8 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-card {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(200, 200, 200, 0.2);
}

.card-header {
  padding: 40px 40px 20px 40px;
  text-align: center;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3c72;
  margin: 0 0 10px 0;
}

.login-subtitle {
  font-size: 1rem;
  color: #2a5298;
  margin: 0;
  font-weight: 400;
}

.card-body {
  padding: 20px 40px 40px 40px;
}

.input-field {
  margin-bottom: 20px;
}

.input-field :deep(.q-field__control) {
  border-radius: 10px;
  height: 50px;
}

.input-field :deep(.q-field__control):before {
  border-color: #d1d5db;
}

.input-field :deep(.q-field__control):hover:before {
  border-color: #2a5298;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #dc3545;
  font-size: 0.9rem;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 8px;
}

.login-btn {
  width: 100%;
  height: 50px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: none;
  background: linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);
  box-shadow: 0 4px 15px rgba(42, 82, 152, 0.3);
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 82, 152, 0.4);
}

.footer-text {
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  text-align: center;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-left {
    flex: 0;
    padding: 30px 20px;
  }

  .brand-logo {
    max-width: 200px;
  }

  .brand-title {
    font-size: 1.5rem;
  }

  .brand-subtitle {
    font-size: 1rem;
  }

  .login-right {
    flex: 1;
  }

  .card-header,
  .card-body {
    padding: 30px 25px;
  }
}
</style>
