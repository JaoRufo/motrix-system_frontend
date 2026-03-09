<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat round dense icon="arrow_back" @click="voltarSeguro" class="q-mr-sm" />
      <div class="text-h6 text-weight-bold">
        {{ isEdit ? `Editar Ordem #${route.params.id}` : 'Nova Ordem de Serviço' }}
      </div>
    </div>

    <q-card class="q-pa-md shadow-2" bordered>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <q-select
            v-model="clienteSelecionado"
            :options="clientesOptions"
            label="Cliente *"
            outlined
            dense
            use-input
            @filter="filtrarClientes"
            @update:model-value="selecionarCliente"
            option-label="label"
            option-value="id"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.nome }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.info }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> Nenhum cliente encontrado </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="veiculoSelecionado"
            :options="veiculosOptions"
            label="Veículo *"
            outlined
            dense
            :disable="!clienteSelecionado"
            @update:model-value="selecionarVeiculo"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption>KM: {{ scope.opt.kmAtual }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-3">
          <q-input v-model.number="kmAtual" label="KM Atual *" outlined dense type="number" />
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="status"
            :options="statusOptions"
            label="Status *"
            outlined
            dense
            @update:model-value="onStatusChange"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="oficinaSelecionada"
            :options="oficinasOptions"
            label="Oficina *"
            outlined
            dense
            option-label="nome"
            option-value="id"
            @update:model-value="selecionarOficina"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="mecanicoSelecionado"
            :options="mecanicosOptions"
            label="Mecânico *"
            outlined
            dense
            option-label="nome"
            option-value="id"
            :disable="!oficinaSelecionada"
          />
        </div>

        <div class="col-12">
          <q-input
            v-model="descricaoProblema"
            label="Descrição do Problema *"
            outlined
            dense
            type="textarea"
            rows="3"
          />
        </div>

        <div class="col-12">
          <q-input
            v-model="observacoes"
            label="Observações Adicionais"
            outlined
            dense
            type="textarea"
            rows="2"
          />
        </div>

        <div v-if="status === 'Cancelada'" class="col-12">
          <q-input
            v-model="motivoCancelamento"
            label="Motivo do Cancelamento *"
            outlined
            dense
            type="textarea"
            rows="2"
            class="input-cancelamento"
            color="negative"
          />
        </div>
      </div>

      <q-separator class="q-my-md" />

      <!-- PEÇAS -->
      <div class="text-subtitle1 text-weight-bold q-mb-sm">Peças Utilizadas</div>

      <div v-for="(peca, index) in pecas" :key="index" class="row q-col-gutter-md q-mb-sm">
        <div class="col-5">
          <q-input v-model="peca.nome" label="Peça" dense outlined />
        </div>

        <div class="col-3">
          <q-input v-model.number="peca.valor" type="number" label="Valor (R$)" dense outlined />
        </div>

        <div class="col-2 flex flex-center">
          <q-btn icon="delete" flat color="negative" @click="removerPeca(index)">
            <q-tooltip>Remover Peça</q-tooltip>
          </q-btn>
        </div>
      </div>

      <q-btn
        label="Adicionar Peça"
        flat
        icon="add"
        color="primary"
        @click="adicionarPeca"
        class="q-mb-md"
      />

      <q-separator class="q-my-md" />

      <!-- MÃO DE OBRA -->
      <div class="text-subtitle1 text-weight-bold q-mb-sm">Mão de Obra</div>

      <div v-for="(mao, index) in maoObra" :key="index" class="row q-col-gutter-md q-mb-sm">
        <div class="col-5">
          <q-input v-model="mao.descricao" label="Descrição" dense outlined />
        </div>

        <div class="col-3">
          <q-input v-model.number="mao.valor" type="number" label="Valor (R$)" dense outlined />
        </div>

        <div class="col-2 flex flex-center">
          <q-btn icon="delete" flat color="negative" @click="removerMao(index)">
            <q-tooltip>Remover Serviço</q-tooltip>
          </q-btn>
        </div>
      </div>

      <q-btn label="Adicionar Serviço" flat icon="add" color="primary" @click="adicionarMao" />

      <q-separator class="q-my-md" />

      <div class="text-right text-h6 text-weight-bold">Total: R$ {{ total.toFixed(2) }}</div>

      <div class="q-mt-md text-right">
        <q-btn label="Cancelar" flat color="grey" @click="voltarSeguro" class="q-mr-sm" />
        <q-btn
          label="Salvar"
          color="primary"
          @click="salvar"
          :loading="salvando"
          class="btn-save"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { clienteService } from 'src/services/clienteService'
import { ordemService } from 'src/services/ordemService'
import { oficinaService } from 'src/services/oficinaService'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

function voltarSeguro() {
  if (window.history.length > 2) {
    router.push('/ordens')
  }
}

const clienteSelecionado = ref(null)
const veiculoSelecionado = ref(null)
const oficinaSelecionada = ref(null)
const mecanicoSelecionado = ref(null)
const kmAtual = ref(0)
const status = ref('Aberta')
const descricaoProblema = ref('')
const observacoes = ref('')
const motivoCancelamento = ref('')
const pecas = ref([])
const maoObra = ref([])
const clientesOptions = ref([])
const todosClientes = ref([])
const veiculosOptions = ref([])
const oficinasOptions = ref([])
const mecanicosOptions = ref([])
const todosUsuarios = ref([])
const salvando = ref(false)

const statusOptions = ['Aberta', 'Em Andamento', 'Aguardando Orçamento', 'Finalizada', 'Cancelada']

const isEdit = computed(() => !!route.params.id)

const total = computed(() => {
  const totalPecas = pecas.value.reduce((acc, p) => acc + (p.valor || 0), 0)
  const totalMao = maoObra.value.reduce((acc, m) => acc + (m.valor || 0), 0)
  return totalPecas + totalMao
})

function onStatusChange(newStatus) {
  if (newStatus !== 'Cancelada') {
    motivoCancelamento.value = ''
  }
}

function filtrarClientes(val, update) {
  update(() => {
    if (val === '') {
      clientesOptions.value = todosClientes.value
    } else {
      const needle = val.toLowerCase()
      clientesOptions.value = todosClientes.value.filter((c) => {
        const nome = c.nome?.toLowerCase() || ''
        const cpf = c.cpf?.toLowerCase() || ''
        const email = c.email?.toLowerCase() || ''
        const placas = c.veiculos?.map((v) => v.placa?.toLowerCase()).join(' ') || ''
        return (
          nome.includes(needle) ||
          cpf.includes(needle) ||
          email.includes(needle) ||
          placas.includes(needle)
        )
      })
    }
  })
}

function selecionarCliente(cliente) {
  veiculoSelecionado.value = null
  if (cliente && cliente.veiculos) {
    veiculosOptions.value = cliente.veiculos.map((v) => ({
      label: `${v.modelo} - ${v.placa}`,
      value: v,
      kmAtual: v.kmAtual || 0,
    }))
  } else {
    veiculosOptions.value = []
  }
}

function selecionarVeiculo(veiculo) {
  if (veiculo && veiculo.value) {
    kmAtual.value = veiculo.value.kmAtual || 0
  }
}

function selecionarOficina(oficina) {
  mecanicoSelecionado.value = null
  if (oficina) {
    mecanicosOptions.value = todosUsuarios.value
      .filter((u) => u.oficina_nome === oficina.nome && u.role === 'user')
      .map((u) => ({
        id: u.id,
        nome: u.mecanico_nome,
        mecanico_id: u.mecanico_id,
      }))
  } else {
    mecanicosOptions.value = []
  }
}

function adicionarPeca() {
  pecas.value.push({ nome: '', valor: 0 })
}

function removerPeca(index) {
  pecas.value.splice(index, 1)
}

function adicionarMao() {
  maoObra.value.push({ descricao: '', valor: 0 })
}

function removerMao(index) {
  maoObra.value.splice(index, 1)
}

async function salvar() {
  if (!clienteSelecionado.value) {
    $q.notify({
      type: 'negative',
      message: 'Selecione um cliente. Caso não exista, cadastre-o primeiro.',
      actions: [
        {
          label: 'Cadastrar',
          color: 'white',
          handler: () => router.push('/clientes/cadastro'),
        },
      ],
    })
    return
  }

  if (!veiculoSelecionado.value) {
    $q.notify({ type: 'negative', message: 'Selecione um veículo' })
    return
  }

  if (!oficinaSelecionada.value) {
    $q.notify({ type: 'negative', message: 'Selecione uma oficina' })
    return
  }

  if (!mecanicoSelecionado.value) {
    $q.notify({ type: 'negative', message: 'Selecione um mecânico' })
    return
  }

  if (!kmAtual.value || kmAtual.value <= 0) {
    $q.notify({ type: 'negative', message: 'Informe a quilometragem atual' })
    return
  }

  if (!descricaoProblema.value) {
    $q.notify({ type: 'negative', message: 'Descreva o problema relatado' })
    return
  }

  if (status.value === 'Cancelada' && !motivoCancelamento.value) {
    $q.notify({ type: 'negative', message: 'Informe o motivo do cancelamento' })
    return
  }

  salvando.value = true

  try {
    await clienteService.atualizar(clienteSelecionado.value.id, {
      veiculos: [
        {
          id: veiculoSelecionado.value.value.id,
          km_atual: kmAtual.value,
        },
      ],
    })

    const payload = {
      ordem: {
        cliente_id: clienteSelecionado.value.id,
        veiculo_id: veiculoSelecionado.value.value.id,
        veiculo_placa: veiculoSelecionado.value.value.placa,
        km_atual: kmAtual.value,
        status: status.value,
        descricao_problema: descricaoProblema.value,
        observacoes: observacoes.value || null,
        motivo_cancelamento: status.value === 'Cancelada' ? motivoCancelamento.value : null,
        oficina_id: oficinaSelecionada.value?.id || null,
        mecanico_id: mecanicoSelecionado.value?.id || null,
      },
      pecas: pecas.value
        .filter((p) => p.nome)
        .map((p) => ({
          nome: p.nome,
          valor: p.valor || 0,
        })),
      maoObra: maoObra.value
        .filter((m) => m.descricao)
        .map((m) => ({
          descricao: m.descricao,
          valor: m.valor || 0,
        })),
    }

    if (isEdit.value) {
      await ordemService.atualizar(route.params.id, payload)
      $q.notify({ type: 'positive', message: 'Ordem atualizada com sucesso!' })
    } else {
      await ordemService.criar(payload)
      $q.notify({ type: 'positive', message: 'Ordem criada com sucesso!' })
    }

    router.push('/ordens')
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message || 'Erro ao salvar ordem' })
  } finally {
    salvando.value = false
  }
}

onMounted(async () => {
  try {
    const mecanicos = await oficinaService.buscarMecanicos()
    todosUsuarios.value = mecanicos

    const oficinasUnicas = [
      ...new Set(
        todosUsuarios.value
          .filter((u) => u.role === 'user' && u.oficina_nome)
          .map((u) => u.oficina_nome),
      ),
    ]

    oficinasOptions.value = oficinasUnicas.map((nome, index) => ({
      id: index + 1,
      nome: nome,
    }))

    const response = await clienteService.listar(1, 1000)
    const clientes = response.data || response
    todosClientes.value = clientes.map((c) => ({
      ...c,
      label: c.nome,
      info: `${c.cpf || 'Sem CPF'} | ${c.email || 'Sem email'} | Veículos: ${c.veiculos?.map((v) => v.placa).join(', ') || 'Nenhum'}`,
      veiculos: c.veiculos?.map((v) => ({
        ...v,
        id: v.id,
        placa: v.placa,
        modelo: v.modelo,
        kmAtual: v.km_atual || v.kmAtual || 0,
      })),
    }))
    clientesOptions.value = todosClientes.value

    if (isEdit.value) {
      const ordem = await ordemService.buscarPorId(route.params.id)

      if (ordem.mecanico_id) {
        const usuario = todosUsuarios.value.find((u) => u.id === ordem.mecanico_id)
        if (usuario) {
          oficinaSelecionada.value = oficinasOptions.value.find(
            (o) => o.nome === usuario.oficina_nome,
          )
          if (oficinaSelecionada.value) {
            selecionarOficina(oficinaSelecionada.value)
            mecanicoSelecionado.value = mecanicosOptions.value.find(
              (m) => m.id === ordem.mecanico_id,
            )
          }
        }
      }

      const cliente = todosClientes.value.find((c) => c.id == ordem.cliente_id)
      if (cliente) {
        clienteSelecionado.value = cliente
        selecionarCliente(cliente)

        await new Promise((resolve) => setTimeout(resolve, 100))

        const veiculo = veiculosOptions.value.find((v) => v.value.id === ordem.veiculo_id)
        if (veiculo) {
          veiculoSelecionado.value = veiculo
        }
      }

      kmAtual.value = ordem.km_atual || 0
      status.value = ordem.status || 'Aberta'
      descricaoProblema.value = ordem.descricao_problema || ''
      observacoes.value = ordem.observacoes || ''
      motivoCancelamento.value = ordem.motivo_cancelamento || ''
      pecas.value = (ordem.pecas || []).map((p) => ({
        nome: p.nome,
        valor: parseFloat(p.valor) || 0,
      }))
      maoObra.value = (ordem.maoObra || ordem.mao_obra || []).map((m) => ({
        descricao: m.descricao,
        valor: parseFloat(m.valor) || 0,
      }))
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar dados: ' + (error.message || '') })
  }
})
</script>

<style scoped>
.btn-save {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.btn-save:hover {
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
  transform: translateY(-2px);
}

.input-cancelamento :deep(.q-field__control) {
  border: 2px solid #c10015 !important;
  border-radius: 4px;
}

.input-cancelamento :deep(.q-field__label) {
  color: #c10015;
  font-weight: bold;
}
</style>
