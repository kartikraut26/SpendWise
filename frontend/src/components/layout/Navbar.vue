<template>
  <header class="navbar">

    <!-- Left -->
    <div class="navbar-left">

      <button
        class="mobile-menu"
        type="button"
        aria-label="Open navigation"
        @click="$emit('toggle-sidebar')"
      >
        <Menu :size="20" />
      </button>

      <div class="page-title">
        {{ pageTitle }}
      </div>

    </div>


    <!-- Right -->
    <div class="navbar-actions">

      <!-- Search -->
      <div class="search-box">

        <Search :size="16" />

        <input
          v-model="search"
          type="text"
          placeholder="Search..."
        />

        <kbd>⌘ K</kbd>

      </div>


      <!-- Notifications -->
      <div class="notification-wrapper">

        <button
          class="action-button"
          type="button"
          aria-label="Notifications"
          @click="showNotifications = !showNotifications"
        >
          <Bell :size="18" />

          <span class="notification-dot"></span>
        </button>


        <Transition name="dropdown">

          <div
            v-if="showNotifications"
            class="notification-menu"
          >

            <div class="notification-header">

              <strong>
                Notifications
              </strong>

              <span>
                3 new
              </span>

            </div>


            <div class="notification-item">

              <div class="notification-icon warning">
                <WalletCards :size="16" />
              </div>

              <div>
                <strong>
                  Food budget is at 72%
                </strong>

                <span>
                  Review your spending
                </span>
              </div>

            </div>


            <div class="notification-item">

              <div class="notification-icon purple">
                <CreditCard :size="16" />
              </div>

              <div>
                <strong>
                  Netflix payment tomorrow
                </strong>

                <span>
                  ₹649 scheduled
                </span>
              </div>

            </div>


            <div class="notification-item">

              <div class="notification-icon success">
                <Target :size="16" />
              </div>

              <div>
                <strong>
                  Savings goal reached 75%
                </strong>

                <span>
                  Keep going!
                </span>
              </div>

            </div>

          </div>

        </Transition>

      </div>


      <!-- Theme -->
      <button
        class="action-button"
        type="button"
        :aria-label="
          themeStore.isDark
            ? 'Switch to light mode'
            : 'Switch to dark mode'
        "
        @click="themeStore.toggleTheme"
      >

        <Sun
          v-if="themeStore.isDark"
          :size="18"
        />

        <Moon
          v-else
          :size="18"
        />

      </button>


      <!-- Profile -->
      <button
        class="profile"
        type="button"
      >

        <div class="avatar">
          K
        </div>

        <div class="profile-info">

          <strong>
            Kartik
          </strong>

          <span>
            Personal account
          </span>

        </div>

        <ChevronDown :size="15" />

      </button>

    </div>

  </header>
</template>


<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import {
  Bell,
  ChevronDown,
  CreditCard,
  Menu,
  Moon,
  Search,
  Sun,
  Target,
  WalletCards
} from 'lucide-vue-next'

import { useThemeStore } from '../../stores/theme'


defineEmits([
  'toggle-sidebar'
])


const route = useRoute()

const themeStore = useThemeStore()

const search = ref('')

const showNotifications = ref(false)


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
/* =========================================
   NAVBAR
========================================= */

.navbar {
  position: sticky;
  top: 0;

  z-index: 80;

  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  min-width: 0;

  height: 70px;

  padding: 0 30px;

  border-bottom: 1px solid var(--glass-border);

  background: color-mix(
    in srgb,
    var(--app-bg) 86%,
    transparent
  );

  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}


/* =========================================
   LEFT
========================================= */

.navbar-left {
  display: flex;
  align-items: center;

  min-width: 0;

  flex: 1;
}

.page-title {
  min-width: 0;

  overflow: hidden;

  color: var(--app-text);

  font-size: 0.9rem;
  font-weight: 800;

  text-overflow: ellipsis;
  white-space: nowrap;
}


/* =========================================
   MOBILE MENU
========================================= */

.mobile-menu {
  display: none;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 38px;
  height: 38px;

  border: 1px solid var(--glass-border);
  border-radius: 10px;

  background: var(--glass-bg);
  color: var(--app-text);

  cursor: pointer;
}


/* =========================================
   RIGHT
========================================= */

.navbar-actions {
  display: flex;
  align-items: center;

  gap: 8px;

  flex-shrink: 0;
}


/* =========================================
   SEARCH
========================================= */

.search-box {
  display: flex;
  align-items: center;

  gap: 8px;

  width: 210px;
  height: 38px;

  padding: 0 10px;

  border: 1px solid var(--glass-border);
  border-radius: 10px;

  background: var(--glass-bg);

  color: var(--app-text-muted);
}

.search-box input {
  width: 100%;
  min-width: 0;

  border: 0;
  outline: 0;

  background: transparent;
  color: var(--app-text);

  font-size: 0.75rem;
}

.search-box input::placeholder {
  color: var(--app-text-muted);
}

.search-box kbd {
  flex-shrink: 0;

  padding: 3px 5px;

  border: 1px solid var(--glass-border);
  border-radius: 5px;

  background: transparent;

  color: var(--app-text-muted);

  font-size: 0.55rem;
}


/* =========================================
   ACTION BUTTON
========================================= */

.action-button {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 38px;
  height: 38px;

  padding: 0;

  border: 1px solid var(--glass-border);
  border-radius: 10px;

  background: var(--glass-bg);
  color: var(--app-text-muted);

  cursor: pointer;

  transition:
    color 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}

.action-button:hover {
  color: var(--app-text);

  transform: translateY(-1px);
}


/* =========================================
   NOTIFICATION
========================================= */

.notification-wrapper {
  position: relative;
}

.notification-dot {
  position: absolute;

  top: 7px;
  right: 7px;

  width: 6px;
  height: 6px;

  border: 1px solid var(--app-bg);
  border-radius: 50%;

  background: var(--danger);
}

.notification-menu {
  position: absolute;

  top: calc(100% + 10px);
  right: 0;

  width: 320px;

  padding: 10px;

  border: 1px solid var(--glass-border);
  border-radius: 15px;

  background: var(--modal-bg);

  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.2);

  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 8px 9px 12px;
}

.notification-header strong {
  color: var(--app-text);

  font-size: 0.82rem;
}

.notification-header span {
  color: var(--accent);

  font-size: 0.65rem;
  font-weight: 700;
}

.notification-item {
  display: flex;

  gap: 10px;

  padding: 11px 9px;

  border-radius: 10px;
}

.notification-item:hover {
  background: var(--accent-soft);
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 32px;
  height: 32px;

  border-radius: 9px;
}

.notification-icon.warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.notification-icon.purple {
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent);
}

.notification-icon.success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.notification-item > div:last-child {
  display: flex;
  flex-direction: column;

  min-width: 0;

  gap: 3px;
}

.notification-item strong {
  color: var(--app-text);

  font-size: 0.72rem;
}

.notification-item span {
  color: var(--app-text-muted);

  font-size: 0.64rem;
}


/* =========================================
   PROFILE
========================================= */

.profile {
  display: flex;
  align-items: center;

  gap: 8px;

  flex-shrink: 0;

  height: 40px;

  padding: 0 9px 0 5px;

  border: 1px solid var(--glass-border);
  border-radius: 22px;

  background: var(--glass-bg);
  color: var(--app-text);

  cursor: pointer;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 30px;
  height: 30px;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #6366f1,
      #7c3aed
    );

  color: white;

  font-size: 0.7rem;
  font-weight: 800;
}

.profile-info {
  display: flex;
  flex-direction: column;

  min-width: 0;
}

.profile-info strong {
  color: var(--app-text);

  font-size: 0.68rem;
}

.profile-info span {
  margin-top: 1px;

  color: var(--app-text-muted);

  font-size: 0.55rem;
}


/* =========================================
   TABLET
========================================= */

@media (max-width: 1100px) {
  .navbar {
    padding: 0 22px;
  }

  .search-box {
    width: 180px;
  }
}


/* =========================================
   MOBILE
========================================= */

@media (max-width: 900px) {

  .navbar {
    height: 62px;

    padding: 0 16px;
  }

  .mobile-menu {
    display: flex;

    margin-right: 9px;
  }

  .page-title {
    font-size: 0.8rem;
  }

  .search-box {
    display: none;
  }

  .profile-info,
  .profile > svg {
    display: none;
  }

  .profile {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 38px;
    height: 38px;

    padding: 0;

    border-radius: 50%;
  }

  .navbar-actions {
    gap: 5px;
  }
}


/* =========================================
   SMALL MOBILE
========================================= */

@media (max-width: 430px) {

  .navbar {
    height: 60px;

    padding: 0 10px;
  }

  .mobile-menu {
    width: 36px;
    height: 36px;

    margin-right: 7px;
  }

  .page-title {
    font-size: 0.74rem;
  }

  .action-button {
    width: 35px;
    height: 35px;
  }

  .profile {
    width: 35px;
    height: 35px;
  }

  .avatar {
    width: 27px;
    height: 27px;
  }

  .notification-menu {
    position: fixed;

    top: 70px;
    right: 10px;

    width: calc(100vw - 20px);
    max-width: 320px;
  }
}


/* =========================================
   DROPDOWN ANIMATION
========================================= */

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;

  transform: translateY(-5px);
}
</style>