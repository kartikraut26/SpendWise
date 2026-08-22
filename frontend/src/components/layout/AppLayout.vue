<template>
  <div class="app-shell">

    <Sidebar
      :is-open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="mobile-overlay"
        @click="sidebarOpen = false"
      ></div>
    </Transition>

    <div class="app-content">

      <Navbar
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />

      <main class="page-content">
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
  width: 100%;
  min-height: 100vh;

  overflow-x: hidden;
}

.app-content {
  width: calc(100% - 250px);
  min-width: 0;
  min-height: 100vh;

  margin-left: 250px;
}

.page-content {
  width: 100%;
  min-width: 0;

  overflow-x: hidden;
}

/* ================================
   MOBILE
================================ */

.mobile-overlay {
  display: none;
}

@media (max-width: 900px) {
  .app-content {
    width: 100%;
    min-width: 0;

    margin-left: 0;
  }

  .mobile-overlay {
    display: block;

    position: fixed;
    inset: 0;

    z-index: 90;

    background: rgba(2, 6, 23, 0.55);

    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
}

/* ================================
   TRANSITION
================================ */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>