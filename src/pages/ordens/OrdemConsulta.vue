<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round dense icon="arrow_back" @click="$router.back()" class="q-mr-sm" />
      <div class="text-h6 text-weight-bold">Ordens de Serviço</div>
      <q-space />
      <q-btn label="Nova Ordem" color="primary" icon="add" to="/ordens/nova" />
    </div>

    <q-card flat bordered>
      <q-table :rows="ordens" :columns="columns" row-key="id" flat>
        <template v-slot:body-cell-acoes="props">
          <q-td align="center">
            <q-btn icon="edit" flat round color="primary" :to="`/ordens/nova/${props.row.id}`" />
            <q-btn icon="delete" flat round color="negative" @click.stop="excluir(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>
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
  { name: 'total', label: 'Total (R$)', field: 'total', align: 'left', format: (val) => val?.toFixed(2) },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const ordens = ref([])

function carregar() {
  ordens.value = JSON.parse(localStorage.getItem('ordens') || '[]')
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
