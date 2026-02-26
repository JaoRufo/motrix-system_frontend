<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round dense icon="arrow_back" @click="$router.back()" class="q-mr-sm" />
      <div class="text-h6 text-weight-bold">Consulta de Clientes</div>
      <q-space />
      <q-btn label="Novo Cliente" color="primary" icon="add" to="/clientes/cadastro" />
    </div>

    <q-card flat bordered>
      <q-table :rows="clientes" :columns="columns" row-key="id" flat>
        <template v-slot:body-cell-veiculos="props">
          <q-td>
            <div v-for="(veiculo, idx) in props.row.veiculos" :key="idx">
              {{ veiculo.modelo }} - {{ veiculo.placa }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-acoes="props">
          <q-td align="center">
            <q-btn icon="edit" flat round color="primary" :to="`/clientes/cadastro/${props.row.id}`" />
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
import { clienteService } from 'src/services/clienteService'

const $q = useQuasar()

const columns = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'veiculos', label: 'Veículos', align: 'left' },
  { name: 'acoes', label: 'Ações', align: 'center' },
]

const clientes = ref([])

function carregar() {
  clientes.value = clienteService.listar()
}

function excluir(id) {
  $q.dialog({
    title: 'Confirmar',
    message: 'Deseja realmente excluir este cliente?',
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Excluir', color: 'negative' },
  }).onOk(() => {
    clienteService.excluir(id)
    carregar()
    $q.notify({ type: 'positive', message: 'Cliente excluído com sucesso!' })
  })
}

onMounted(() => {
  carregar()
})
</script>
