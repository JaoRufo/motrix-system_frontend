<template>
  <q-drawer show-if-above side="left" bordered :width="260" class="sidebar">
    <div class="sidebar-header">
      <q-icon name="build_circle" size="48px" class="logo-icon" />
      <div class="text-h5 text-weight-bold q-mt-sm">Motrix System</div>
      <div class="text-caption text-grey-4">Gestão Inteligente</div>
    </div>

    <q-separator class="main-separator" />

    <q-list padding class="menu-list">
      <q-item clickable v-ripple to="/ordens" active-class="item-active" class="menu-item">
        <q-item-section avatar>
          <q-icon name="assignment" size="22px" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Ordens de Serviço</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator class="category-separator" />

      <q-expansion-item
        icon="people"
        label="Clientes"
        expand-separator
        class="expansion-item"
        header-class="expansion-header"
      >
        <q-item clickable to="/clientes/cadastro" active-class="item-active" class="submenu-item">
          <q-item-section avatar>
            <q-icon name="person_add" size="18px" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cadastro</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable to="/clientes/consulta" active-class="item-active" class="submenu-item">
          <q-item-section avatar>
            <q-icon name="search" size="18px" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Consulta</q-item-label>
          </q-item-section>
        </q-item>
      </q-expansion-item>

      <!-- <q-separator class="category-separator" /> -->

      <!-- <q-item clickable v-ripple to="/configuracoes" active-class="item-active" class="menu-item">
        <q-item-section avatar>
          <q-icon name="settings" size="22px" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Configurações</q-item-label>
        </q-item-section>
      </q-item> -->
    </q-list>

    <div class="sidebar-footer">
      <q-separator class="footer-separator" />
      <div class="watermark">
        <q-icon name="copyright" size="14px" />
        <span>Motrix 2026</span>
      </div>
    </div>
  </q-drawer>
</template>

<style scoped>
.sidebar {
  background: linear-gradient(180deg, #0a1929 0%, #0d2847 50%, #0a1929 100%);
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 24px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(66, 165, 245, 0.2);
}

.logo-icon {
  color: #42a5f5;
  filter: drop-shadow(0 0 8px rgba(66, 165, 245, 0.4));
}

.main-separator {
  background: linear-gradient(90deg, transparent, #42a5f5, transparent);
  height: 1px;
  margin: 0;
}

.menu-list {
  flex: 1;
  padding: 12px 8px;
}

.menu-item {
  border-radius: 10px;
  margin: 4px 0;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: rgba(66, 165, 245, 0.1);
  transform: translateX(4px);
}

.expansion-item {
  border-radius: 10px;
  margin: 4px 0;
}

.expansion-header {
  border-radius: 10px;
  transition: all 0.3s ease;
}

.expansion-header:hover {
  background: rgba(66, 165, 245, 0.1);
}

.submenu-item {
  border-radius: 8px;
  margin: 2px 8px;
  padding-left: 24px;
  transition: all 0.3s ease;
}

.submenu-item:hover {
  background: rgba(66, 165, 245, 0.08);
  transform: translateX(4px);
}

.item-active {
  background: linear-gradient(90deg, rgba(66, 165, 245, 0.2), rgba(66, 165, 245, 0.1));
  border-left: 3px solid #42a5f5;
  box-shadow: 0 2px 8px rgba(66, 165, 245, 0.2);
}

.category-separator {
  background: linear-gradient(90deg, transparent, rgba(66, 165, 245, 0.3), transparent);
  height: 1px;
  margin: 16px 12px;
}

.sidebar-footer {
  margin-top: auto;
  padding: 16px;
}

.footer-separator {
  background: linear-gradient(90deg, transparent, #42a5f5, transparent);
  height: 1px;
  margin-bottom: 12px;
}

.watermark {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  color: rgba(120, 117, 117, 0.4);
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.watermark .q-icon {
  opacity: 0.6;
}
</style>
