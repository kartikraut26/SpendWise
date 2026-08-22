<template>
  <div class="app-shell">

    <!-- Sidebar -->
    <Sidebar
      :is-open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
    ></div>

    <!-- Main area -->
    <div class="app-main">

      <Navbar
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />

      <main class="app-content">
        <RouterView />
      </main>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'

const sidebarOpen = ref(false)
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-main {
  min-height: 100vh;

  margin-left: 266px;
}

.app-content {
  min-height: calc(100vh - 72px);
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 900px) {
  .app-main {
    margin-left: 0;
  }

  .sidebar-overlay {
    display: block;

    position: fixed;
    inset: 0;
    z-index: 45;

    background: rgba(15, 23, 42, 0.45);

    backdrop-filter: blur(2px);
  }
}
</style>