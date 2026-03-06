<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round dense icon="arrow_back" @click="voltarSeguro" class="q-mr-sm">
        <q-tooltip>Voltar</q-tooltip>
      </q-btn>
      <div class="text-h6 text-weight-bold">Consulta de Clientes</div>
      <q-space />
      <q-btn
        label="Novo Cliente"
        color="primary"
        icon="add"
        to="/clientes/cadastro"
        class="btn-custom"
      />
    </div>

    <q-card flat bordered>
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-3">
            <q-input v-model="filtro.nome" label="Nome" outlined dense clearable />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="filtro.cpf" label="CPF" outlined dense clearable />
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="filtro.placa" label="Placa" outlined dense clearable />
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="filtro.email" label="E-mail" outlined dense clearable />
          </div>
          <div class="col-12 col-md-2 flex items-center">
            <q-btn label="Limpar" flat color="grey" @click="limparFiltros" />
          </div>
        </div>
      </q-card-section>

      <q-table :rows="clientesFiltrados" :columns="columns" row-key="id" flat :loading="loading">
        <template v-slot:body-cell-veiculos="props">
          <q-td>
            <div v-for="(veiculo, idx) in props.row.veiculos" :key="idx">
              {{ veiculo.modelo }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-placas="props">
          <q-td>
            <div v-for="(veiculo, idx) in props.row.veiculos" :key="idx">
              {{ veiculo.placa }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-acoes="props">
          <q-td align="center">
            <q-btn icon="history" flat round color="info" @click="verHistorico(props.row)">
              <q-tooltip>Histórico de Serviços</q-tooltip>
            </q-btn>
            <q-btn
              icon="edit"
              flat
              round
              color="primary"
              @click="editarCliente(props.row.id)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn icon="delete" flat round color="negative" @click.stop="excluir(props.row.id)">
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Dialog de Histórico -->
    <q-dialog v-model="dialogHistorico" maximized>
      <q-card v-if="clienteSelecionado">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Histórico de Serviços - {{ clienteSelecionado.nome }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup>
            <q-tooltip>Fechar</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-card-section>
          <div v-if="historicoOrdens.length === 0" class="text-center text-grey q-pa-lg">
            Nenhum serviço realizado para este cliente
          </div>

          <div v-else>
            <q-list bordered separator>
              <q-expansion-item
                v-for="ordem in historicoOrdens"
                :key="ordem.id"
                :label="`O.S #${ordem.id} - ${ordem.veiculo}`"
                :caption="`${new Date(ordem.data).toLocaleDateString()} - ${ordem.status}`"
                expand-separator
              >
                <q-card>
                  <q-card-section>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-md-4">
                        <div class="text-subtitle2 text-grey">Veículo</div>
                        <div class="text-body1">{{ ordem.veiculo }}</div>
                      </div>

                      <div class="col-12 col-md-4">
                        <div class="text-subtitle2 text-grey">KM</div>
                        <div class="text-body1">{{ ordem.kmAtual }}</div>
                      </div>

                      <div class="col-12 col-md-4">
                        <div class="text-subtitle2 text-grey">Status</div>
                        <q-badge :color="getStatusColor(ordem.status)" :label="ordem.status" />
                      </div>

                      <div class="col-12">
                        <div class="text-subtitle2 text-grey">Descrição do Problema</div>
                        <div class="text-body1">{{ ordem.descricaoProblema }}</div>
                      </div>

                      <div v-if="ordem.observacoes" class="col-12">
                        <div class="text-subtitle2 text-grey">Observações</div>
                        <div class="text-body1">{{ ordem.observacoes }}</div>
                      </div>

                      <div v-if="ordem.motivoCancelamento" class="col-12">
                        <div class="text-subtitle2 text-negative">Motivo do Cancelamento</div>
                        <div class="text-body1">{{ ordem.motivoCancelamento }}</div>
                      </div>
                    </div>

                    <q-separator class="q-my-md" />

                    <div class="text-subtitle1 text-weight-bold q-mb-sm">Peças Utilizadas</div>
                    <q-list bordered separator v-if="ordem.pecas && ordem.pecas.length">
                      <q-item v-for="(peca, idx) in ordem.pecas" :key="idx">
                        <q-item-section>{{ peca.nome }}</q-item-section>
                        <q-item-section side>R$ {{ parseFloat(peca.valor || 0).toFixed(2) }}</q-item-section>
                      </q-item>
                    </q-list>
                    <div v-else class="text-grey q-mb-md">Nenhuma peça utilizada</div>

                    <q-separator class="q-my-md" />

                    <div class="text-subtitle1 text-weight-bold q-mb-sm">Mão de Obra</div>
                    <q-list bordered separator v-if="ordem.maoObra && ordem.maoObra.length">
                      <q-item v-for="(mao, idx) in ordem.maoObra" :key="idx">
                        <q-item-section>{{ mao.descricao }}</q-item-section>
                        <q-item-section side>R$ {{ parseFloat(mao.valor || 0).toFixed(2) }}</q-item-section>
                      </q-item>
                    </q-list>
                    <div v-else class="text-grey q-mb-md">Nenhum serviço realizado</div>

                    <q-separator class="q-my-md" />

                    <div class="text-h6 text-right text-weight-bold">
                      Total: R$ {{ ordem.total.toFixed(2) }}
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { clienteService } from 'src/services/clienteService'
import { ordemService } from 'src/services/ordemService'

const $q = useQuasar()
const router = useRouter()

const filtro = ref({
  nome: '',
  cpf: '',
  placa: '',
  email: ''
})

function limparFiltros() {
  filtro.value = {
    nome: '',
    cpf: '',
    placa: '',
    email: ''
  }
}

const clientesFiltrados = computed(() => {
  let resultado = clientes.value
  
  if (filtro.value.nome) {
    const needle = filtro.value.nome.toLowerCase()
    resultado = resultado.filter(c => c.nome?.toLowerCase().includes(needle))
  }
  
  if (filtro.value.cpf) {
    const needle = filtro.value.cpf.toLowerCase()
    resultado = resultado.filter(c => c.cpf?.toLowerCase().includes(needle))
  }
  
  if (filtro.value.placa) {
    const needle = filtro.value.placa.toLowerCase()
    resultado = resultado.filter(c => 
      c.veiculos?.some(v => v.placa?.toLowerCase().includes(needle))
    )
  }
  
  if (filtro.value.email) {
    const needle = filtro.value.email.toLowerCase()
    resultado = resultado.filter(c => c.email?.toLowerCase().includes(needle))
  }
  
  return resultado
})

function voltarSeguro() {
  router.push('/ordens')
}

const columns = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'veiculos', label: 'Veículos', align: 'left' },
  { name: 'placas', label: 'Placa', align: 'left' },
  { name: 'acoes', label: 'Ações', align: 'center' },
]

const clientes = ref([])
const dialogHistorico = ref(false)
const clienteSelecionado = ref(null)
const historicoOrdens = ref([])
const loading = ref(false)

const statusColors = {
  Aberta: 'blue',
  'Em Andamento': 'orange',
  'Aguardando Orçamento': 'purple',
  Finalizada: 'green',
  Cancelada: 'red',
}

function getStatusColor(status) {
  return statusColors[status] || 'grey'
}

async function carregar() {
  loading.value = true
  try {
    clientes.value = await clienteService.listar()
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar clientes' })
  } finally {
    loading.value = false
  }
}

async function verHistorico(cliente) {
  clienteSelecionado.value = cliente
  try {
    const historico = await clienteService.buscarHistorico(cliente.id)
    
    const ordensCompletas = await Promise.all(
      historico.map(async (ordem) => {
        try {
          const ordemCompleta = await ordemService.buscarPorId(ordem.id)
          return {
            id: ordemCompleta.id,
            veiculo: ordem.modelo ? `${ordem.modelo} - ${ordem.placa}` : ordem.veiculo_placa || 'N/A',
            kmAtual: ordemCompleta.km_atual,
            status: ordemCompleta.status,
            descricaoProblema: ordemCompleta.descricao_problema,
            observacoes: ordemCompleta.observacoes,
            motivoCancelamento: ordemCompleta.motivo_cancelamento,
            data: ordemCompleta.created_at || ordemCompleta.data,
            total: parseFloat(ordemCompleta.total) || 0,
            pecas: (ordemCompleta.pecas || []).map(p => ({ ...p, valor: parseFloat(p.valor || 0) })),
            maoObra: (ordemCompleta.maoObra || ordemCompleta.mao_obra || []).map(m => ({ ...m, valor: parseFloat(m.valor || 0) }))
          }
        } catch {
          return {
            id: ordem.id,
            veiculo: ordem.modelo ? `${ordem.modelo} - ${ordem.placa}` : ordem.veiculo_placa || 'N/A',
            kmAtual: ordem.km_atual,
            status: ordem.status,
            descricaoProblema: ordem.descricao_problema,
            observacoes: ordem.observacoes,
            motivoCancelamento: ordem.motivo_cancelamento,
            data: ordem.created_at || ordem.data,
            total: parseFloat(ordem.total) || 0,
            pecas: [],
            maoObra: []
          }
        }
      })
    )
    
    historicoOrdens.value = ordensCompletas
    dialogHistorico.value = true
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar histórico' })
  }
}

function editarCliente(id) {
  router.push(`/clientes/cadastro/${id}`).then(() => {
    router.go(0)
  })
}

function excluir(id) {
  $q.dialog({
    title: 'Confirmar',
    message: 'Deseja realmente excluir este cliente?',
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Excluir', color: 'negative' },
  }).onOk(async () => {
    try {
      await clienteService.excluir(id)
      $q.notify({ type: 'positive', message: 'Cliente excluído com sucesso!' })
      carregar()
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao excluir cliente' })
    }
  })
}

onMounted(() => {
  carregar()
})
</script>

<style scoped>
.btn-custom {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.btn-custom:hover {
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
  transform: translateY(-2px);
}
</style>
