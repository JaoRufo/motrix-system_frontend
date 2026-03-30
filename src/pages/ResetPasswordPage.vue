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
          <h2 class="login-title">Nova Senha</h2>
          <p class="login-subtitle">Defina sua nova senha de acesso</p>
        </q-card-section>

        <q-card-section class="card-body">
          <!-- Validando token -->
          <div v-if="validando" class="text-center q-py-lg">
            <q-spinner color="primary" size="40px" />
            <p class="q-mt-md text-grey">Validando link...</p>
          </div>

          <!-- Formulário -->
          <template v-else-if="tokenValido">
            <q-input
              v-model="novaSenha"
              label="Nova senha"
              :type="showSenha ? 'text' : 'password'"
              outlined
              dense
              class="input-field"
              :error="!!errorMessage"
              hide-bottom-space
              no-error-icon
              @focus="errorMessage = ''"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="blue-7" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showSenha ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showSenha = !showSenha"
                />
              </template>
            </q-input>

            <q-input
              v-model="confirmarSenha"
              label="Confirmar senha"
              :type="showConfirmar ? 'text' : 'password'"
              outlined
              dense
              class="input-field"
              :error="!!errorMessage"
              hide-bottom-space
              no-error-icon
              @focus="errorMessage = ''"
              @keyup.enter="redefinir"
            >
              <template v-slot:prepend>
                <q-icon name="lock_reset" color="blue-7" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showConfirmar ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showConfirmar = !showConfirmar"
                />
              </template>
            </q-input>

            <div v-if="errorMessage" class="error-message">
              <q-icon name="error" size="20px" />
              {{ errorMessage }}
            </div>

            <q-btn
              label="Redefinir senha"
              color="primary"
              class="login-btn"
              @click="redefinir"
              :loading="loading"
              :disable="loading"
              unelevated
              size="lg"
            />
          </template>

          <div class="text-center q-mt-md">
            <router-link to="/login" class="back-link">Voltar para o login</router-link>
          </div>
        </q-card-section>
      </q-card>

      <div class="footer-text">© 2026 Motrix System. Todos os direitos reservados.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../services/authService'

const router = useRouter()
const route = useRoute()

const token = route.query.token
const validando = ref(true)
const tokenValido = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const novaSenha = ref('')
const confirmarSenha = ref('')
const showSenha = ref(false)
const showConfirmar = ref(false)

onMounted(async () => {
  if (!token) {
    router.replace({ path: '/forgot-password', query: { erro: 'link-invalido' } })
    return
  }

  try {
    await authService.validateResetToken(token)
    tokenValido.value = true
  } catch {
    router.replace({ path: '/forgot-password', query: { erro: 'link-invalido' } })
  } finally {
    validando.value = false
  }
})

async function redefinir() {
  if (!novaSenha.value || !confirmarSenha.value) {
    errorMessage.value = 'Preencha todos os campos'
    return
  }
  if (novaSenha.value.length < 6) {
    errorMessage.value = 'A senha deve ter no mínimo 6 caracteres'
    return
  }
  if (novaSenha.value !== confirmarSenha.value) {
    errorMessage.value = 'As senhas não coincidem'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await authService.resetPassword(token, novaSenha.value)
    router.replace({ path: '/login', query: { sucesso: 'senha-redefinida' } })
  } catch (err) {
    errorMessage.value = err?.data?.error || 'Link inválido ou expirado'
  } finally {
    loading.value = false
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
}

.brand-subtitle {
  font-size: 1.2rem;
  color: #2a5298;
  margin: 0;
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

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #dc3545;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 20px;
  padding: 14px 16px;
  background: rgba(220, 53, 69, 0.12);
  border-radius: 8px;
  border-left: 4px solid #dc3545;
  animation: slideIn 0.3s ease;
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
}

.back-link {
  color: #2a5298;
  font-size: 0.9rem;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.footer-text {
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  text-align: center;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 800px) {
  .login-container {
    flex-direction: column;
  }
  .login-left {
    flex: 0;
    padding: 16px 12px;
    min-height: 200px;
  }
  .brand-logo {
    max-width: 160px;
    margin-bottom: 12px;
  }
  .brand-title {
    font-size: 1.2rem;
  }
  .brand-subtitle {
    font-size: 0.85rem;
  }
  .login-right {
    flex: 1;
    padding: 20px 12px;
  }
  .login-card {
    max-width: 100%;
  }
  .card-header {
    padding: 24px 20px 16px 20px;
  }
  .card-body {
    padding: 16px 20px 24px 20px;
  }
  .login-title {
    font-size: 1.5rem;
  }
}
</style>
