<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'

// Migração de dados antigos
onMounted(() => {
  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]')
  let migrado = false

  clientes.forEach((cliente) => {
    // Converter veiculo único para array de veiculos
    if (cliente.veiculo && !cliente.veiculos) {
      cliente.veiculos = [{ ...cliente.veiculo, kmAtual: cliente.veiculo.kmAtual || 0 }]
      delete cliente.veiculo
      migrado = true
    }
    // Garantir que veiculos é um array
    if (!Array.isArray(cliente.veiculos)) {
      cliente.veiculos = []
      migrado = true
    }
  })

  if (migrado) {
    localStorage.setItem('clientes', JSON.stringify(clientes))
  }
})
</script>
