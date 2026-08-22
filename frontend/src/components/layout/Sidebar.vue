<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar-open': isOpen }"
  >
    <div class="sidebar-inner">

      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-icon">
          S
        </div>

        <div>
          <h1>SpendWise</h1>
          <p>Finance Tracker</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">

        <p class="nav-section-title">
          MAIN
        </p>

        <RouterLink
          to="/dashboard"
          class="nav-item"
          @click="closeMobile"
        >
          <span class="nav-icon">⌂</span>
          <span>Dashboard</span>
        </RouterLink>

        <RouterLink
          to="/transactions"
          class="nav-item"
          @click="closeMobile"
        >
          <span class="nav-icon">↕</span>
          <span>Transactions</span>
        </RouterLink>

        <RouterLink
          to="/categories"
          class="nav-item"
          @click="closeMobile"
        >
          <span class="nav-icon">▦</span>
          <span>Categories</span>
        </RouterLink>

        <RouterLink
          to="/budget"
          class="nav-item"
          @click="closeMobile"
        >
          <span class="nav-icon">◫</span>
          <span>Budget</span>
        </RouterLink>

        <RouterLink
          to="/subscriptions"
          class="nav-item"
          @click="closeMobile"
        >
          <span class="nav-icon">↻</span>
          <span>Subscriptions</span>
        </RouterLink>

        <p class="nav-section-title">
          ANALYTICS
        </p>

        <RouterLink
          to="/reports"
          class="nav-item"
          @click="closeMobile"
        >
          <span class="nav-icon">▥</span>
          <span>Reports</span>
        </RouterLink>

        <p class="nav-section-title">
          ACCOUNT
        </p>

        <RouterLink
          to="/profile"
          class="nav-item"
          @click="closeMobile"
        >
          <span class="nav-icon">◉</span>
          <span>Profile</span>
        </RouterLink>

      </nav>

      <!-- Bottom -->
      <div class="sidebar-footer">
        <div class="sidebar-version">
          SpendWise v1.0
        </div>
      </div>

    </div>
  </aside>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

function closeMobile() {
  emit('close')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 50;

  width: 250px;

  transform: translateX(0);

  transition: transform 0.3s ease;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;

  height: 100%;

  margin: 16px 0 16px 16px;
  padding: 22px 14px;

  border: 1px solid var(--glass-border);
  border-radius: 22px;

  background: var(--glass-bg);

  box-shadow: var(--glass-shadow);

  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 11px;

  padding: 4px 8px 22px;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 38px;
  height: 38px;

  border-radius: 11px;

  background: var(--accent);
  color: white;

  font-weight: 800;
}

.sidebar-brand h1 {
  font-size: 1.05rem;
  font-weight: 800;

  color: var(--app-text);
}

.sidebar-brand p {
  margin-top: 2px;

  font-size: 0.7rem;

  color: var(--app-text-muted);
}

.sidebar-nav {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;

  overflow-y: auto;
}

.nav-section-title {
  margin: 18px 8px 6px;

  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;

  color: var(--app-text-muted);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 11px;

  min-height: 44px;

  padding: 0 11px;

  border: 1px solid transparent;
  border-radius: 12px;

  color: var(--app-text-muted);

  font-size: 0.88rem;
  font-weight: 600;

  text-decoration: none;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.nav-item:hover {
  background: rgba(99, 102, 241, 0.08);
  color: var(--app-text);
}

.nav-item.router-link-active {
  border-color: rgba(99, 102, 241, 0.15);

  background: rgba(99, 102, 241, 0.12);

  color: var(--accent);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 22px;

  font-size: 1rem;
}

.sidebar-footer {
  padding-top: 18px;
}

.sidebar-version {
  padding: 10px;

  border-top: 1px solid var(--glass-border);

  font-size: 0.7rem;

  color: var(--app-text-muted);
}

@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-110%);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-inner {
    margin: 12px;
  }
}
</style>