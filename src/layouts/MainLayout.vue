<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Header -->
    <AppHeader />

    <!-- Conteúdo -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppSidebar from 'src/components/layout/AppSidebar.vue'
import AppHeader from 'src/components/layout/AppHeader.vue'
</script>
