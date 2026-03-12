<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Sidebar -->
    <AppSidebar v-model="leftDrawerOpen" />

    <!-- Header -->
    <AppHeader @toggle-drawer="leftDrawerOpen = !leftDrawerOpen" />

    <!-- Conteúdo -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from 'src/components/layout/AppSidebar.vue'
import AppHeader from 'src/components/layout/AppHeader.vue'

const leftDrawerOpen = ref(false)
</script>
