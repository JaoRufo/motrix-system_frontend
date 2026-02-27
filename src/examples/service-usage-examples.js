// Exemplo de uso dos services em componentes Vue

// ============================================
// 1. EXEMPLO BÁSICO - Lista de Clientes
// ============================================
/*
<script setup>
import { ref, onMounted } from 'vue'
import { clienteService } from '@/services/clienteService'
import { Notify } from 'quasar'

const clientes = ref([])
const loading = ref(false)

async function carregarClientes() {
  loading.value = true
  try {
    clientes.value = await clienteService.listar()
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.message || 'Erro ao carregar clientes'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  carregarClientes()
})
</script>
*/

// ============================================
// 2. EXEMPLO - Criar Ordem de Serviço
// ============================================
/*
<script setup>
import { ref } from 'vue'
import { ordemService } from '@/services/ordemService'
import { Notify } from 'quasar'

const loading = ref(false)

const ordem = ref({
  ordem: {
    cliente_id: null,
    veiculo_id: null,
    veiculo_placa: '',
    km_atual: 0,
    status: 'Aberta',
    descricao_problema: '',
    observacoes: ''
  },
  pecas: [],
  maoObra: []
})

async function salvarOrdem() {
  loading.value = true
  try {
    await ordemService.criar(ordem.value)
    
    Notify.create({
      type: 'positive',
      message: 'Ordem criada com sucesso!'
    })
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.message
    })
  } finally {
    loading.value = false
  }
}
</script>
*/

// ============================================
// 3. EXEMPLO - Baixar PDF da Ordem
// ============================================
/*
<script setup>
import { ordemService } from '@/services/ordemService'

async function baixarPDF(ordemId) {
  try {
    await ordemService.baixarPDF(ordemId)
  } catch (error) {
    console.error(error)
  }
}
</script>
*/
