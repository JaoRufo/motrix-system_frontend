<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h6 text-weight-bold">Ordens de Serviço</div>
      <q-space />
      <q-btn label="Nova Ordem" color="primary" icon="add" to="/ordens/nova" class="btn-custom" />
    </div>

    <q-card flat bordered>
      <q-table :rows="ordens" :columns="columns" row-key="id" flat>
        <template v-slot:body-cell-id="props">
          <q-td>
            <span @click="verDetalhes(props.row)" class="id-link">
              {{ props.row.id }}
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td>
            <q-badge :color="getStatusColor(props.row.status)" :label="props.row.status" />
          </q-td>
        </template>

        <template v-slot:body-cell-acoes="props">
          <q-td align="center">
            <q-btn icon="visibility" flat round color="info" @click="verDetalhes(props.row)">
              <q-tooltip>Visualizar Detalhes</q-tooltip>
            </q-btn>
            <q-btn icon="edit" flat round color="primary" :to="`/ordens/nova/${props.row.id}`">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn icon="delete" flat round color="negative" @click.stop="excluir(props.row.id)">
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Dialog de Detalhes -->
    <q-dialog v-model="dialogDetalhes" maximized>
      <q-card v-if="ordemSelecionada">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Ordem de Serviço #{{ ordemSelecionada.id }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey">Cliente</div>
              <div class="text-body1">{{ ordemSelecionada.cliente }}</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey">Veículo</div>
              <div class="text-body1">{{ ordemSelecionada.veiculo }}</div>
            </div>

            <div class="col-12 col-md-4">
              <div class="text-subtitle2 text-grey">KM</div>
              <div class="text-body1">{{ ordemSelecionada.kmAtual }}</div>
            </div>

            <div class="col-12 col-md-4">
              <div class="text-subtitle2 text-grey">Status</div>
              <q-badge
                :color="getStatusColor(ordemSelecionada.status)"
                :label="ordemSelecionada.status"
              />
            </div>

            <div class="col-12 col-md-4">
              <div class="text-subtitle2 text-grey">Data</div>
              <div class="text-body1">
                {{ new Date(ordemSelecionada.data).toLocaleDateString() }}
              </div>
            </div>

            <div class="col-12">
              <div class="text-subtitle2 text-grey">Descrição do Problema</div>
              <div class="text-body1">{{ ordemSelecionada.descricaoProblema }}</div>
            </div>

            <div v-if="ordemSelecionada.observacoes" class="col-12">
              <div class="text-subtitle2 text-grey">Observações</div>
              <div class="text-body1">{{ ordemSelecionada.observacoes }}</div>
            </div>

            <div v-if="ordemSelecionada.motivoCancelamento" class="col-12">
              <div class="text-subtitle2 text-negative">Motivo do Cancelamento</div>
              <div class="text-body1">{{ ordemSelecionada.motivoCancelamento }}</div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-h6 q-mb-md">Peças Utilizadas</div>
          <q-list bordered separator v-if="ordemSelecionada.pecas && ordemSelecionada.pecas.length">
            <q-item v-for="(peca, idx) in ordemSelecionada.pecas" :key="idx">
              <q-item-section>{{ peca.nome }}</q-item-section>
              <q-item-section side>R$ {{ peca.valor.toFixed(2) }}</q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-grey">Nenhuma peça utilizada</div>

          <q-separator class="q-my-md" />

          <div class="text-h6 q-mb-md">Mão de Obra</div>
          <q-list
            bordered
            separator
            v-if="ordemSelecionada.maoObra && ordemSelecionada.maoObra.length"
          >
            <q-item v-for="(mao, idx) in ordemSelecionada.maoObra" :key="idx">
              <q-item-section>{{ mao.descricao }}</q-item-section>
              <q-item-section side>R$ {{ mao.valor.toFixed(2) }}</q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-grey">Nenhum serviço realizado</div>

          <q-separator class="q-my-md" />

          <div class="text-h5 text-right text-weight-bold">
            Total: R$ {{ ordemSelecionada.total.toFixed(2) }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left' },
  { name: 'veiculo', label: 'Veículo', field: 'veiculo', align: 'left' },
  { name: 'kmAtual', label: 'KM', field: 'kmAtual', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  {
    name: 'total',
    label: 'Total (R$)',
    field: 'total',
    align: 'left',
    format: (val) => val?.toFixed(2),
  },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const ordens = ref([])
const dialogDetalhes = ref(false)
const ordemSelecionada = ref(null)

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

function carregar() {
  ordens.value = JSON.parse(localStorage.getItem('ordens') || '[]')
}

function verDetalhes(ordem) {
  ordemSelecionada.value = ordem
  dialogDetalhes.value = true
}

function excluir(id) {
  $q.dialog({
    title: 'Confirmar',
    message: 'Deseja realmente excluir esta ordem de serviço?',
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Excluir', color: 'negative' },
  }).onOk(() => {
    const ordens = JSON.parse(localStorage.getItem('ordens') || '[]')
    const novasOrdens = ordens.filter((o) => o.id != id)
    localStorage.setItem('ordens', JSON.stringify(novasOrdens))
    carregar()
    $q.notify({ type: 'positive', message: 'Ordem excluída com sucesso!' })
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

.id-link {
  cursor: pointer;
  color: black;
}

.id-link:hover {
  text-decoration: underline;
}

body.body--dark .id-link {
  color: white;
}
</style>
