<template>
  <header class="navbar">
    <div class="navbar-left">

      <!-- Mobile Menu -->
      <button
        type="button"
        class="mobile-menu-button"
        @click="$emit('toggle-sidebar')"
        aria-label="Open navigation"
      >
        ☰
      </button>

      <div class="mobile-brand">
        <span class="mobile-brand-icon">S</span>
        <span>SpendWise</span>
      </div>

      <div class="desktop-page-title">
        {{ pageTitle }}
      </div>

    </div>

    <div class="navbar-actions">

      <!-- Theme -->
      <button
        type="button"
        class="navbar-button"
        @click="themeStore.toggleTheme"
        :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        {{ themeStore.isDark ? '☀️' : '🌙' }}
        <span class="theme-label">
          {{ themeStore.isDark ? 'Light' : 'Dark' }}
        </span>
      </button>

      <!-- User -->
      <button
        type="button"
        class="profile-button"
      >
        <span class="avatar">
          K
        </span>

        <span class="profile-name">
          User
        </span>

        <span class="profile-arrow">
          ▾
        </span>
      </button>

    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '../../stores/theme'

defineEmits(['toggle-sidebar'])

const route = useRoute()
const themeStore = useThemeStore()

const pageTitles = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  categories: 'Categories',
  budget: 'Budget',
  subscriptions: 'Subscriptions',
  reports: 'Reports',
  profile: 'Profile'
}

const pageTitle = computed(() => {
  return pageTitles[route.name] || 'SpendWise'
})
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 40;

  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 72px;

  padding: 0 28px;

  border-bottom: 1px solid var(--glass-border);

  background: color-mix(
    in srgb,
    var(--app-bg) 78%,
    transparent
  );

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.navbar-left,
.navbar-actions {
  display: flex;
  align-items: center;
}

.navbar-left {
  gap: 14px;
}

.navbar-actions {
  gap: 10px;
}

.desktop-page-title {
  font-size: 1rem;
  font-weight: 700;

  color: var(--app-text);
}

.mobile-menu-button {
  display: none;

  width: 40px;
  height: 40px;

  border: 1px solid var(--glass-border);
  border-radius: 10px;

  background: var(--glass-bg);
  color: var(--app-text);

  cursor: pointer;
}

.mobile-brand {
  display: none;
  align-items: center;
  gap: 8px;

  font-weight: 800;

  color: var(--app-text);
}

.mobile-brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;

  border-radius: 8px;

  background: var(--accent);
  color: white;
}

.navbar-button,
.profile-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 42px;

  padding: 0 12px;

  border: 1px solid var(--glass-border);
  border-radius: 11px;

  background: var(--glass-bg);
  color: var(--app-text);

  cursor: pointer;

  transition: transform 0.2s ease;
}

.navbar-button:hover,
.profile-button:hover {
  transform: translateY(-1px);
}

.navbar-button {
  font-size: 0.82rem;
  font-weight: 600;
}

.profile-button {
  padding-right: 10px;

  border-radius: 20px;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;

  border-radius: 50%;

  background: var(--accent);
  color: white;

  font-size: 0.75rem;
  font-weight: 800;
}

.profile-name {
  font-size: 0.82rem;
  font-weight: 600;
}

.profile-arrow {
  color: var(--app-text-muted);
}

@media (max-width: 900px) {
  .navbar {
    padding: 0 18px;
  }

  .mobile-menu-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-brand {
    display: flex;
  }

  .desktop-page-title,
  .profile-name,
  .profile-arrow {
    display: none;
  }

  .theme-label {
    display: none;
  }
}
</style>