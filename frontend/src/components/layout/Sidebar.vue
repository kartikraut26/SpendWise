<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar-open': isOpen }"
  >
    <div class="sidebar-inner">

      <!-- Brand -->
      <div class="brand">
        <img
          :src="logo"
          alt="SpendWise"
          class="brand-logo"
        />

        <div class="brand-text">
          <strong>
            SpendWise
          </strong>

          <span>
            Personal Finance
          </span>
        </div>
      </div>


      <!-- Navigation -->
      <nav>
        <p class="section-title">
          MAIN
        </p>

        <RouterLink
          to="/dashboard"
          class="nav-item"
          @click="close"
        >
          <LayoutDashboard :size="18" />
          <span>Dashboard</span>
        </RouterLink>

        <RouterLink
          to="/transactions"
          class="nav-item"
          @click="close"
        >
          <ArrowLeftRight :size="18" />
          <span>Transactions</span>
        </RouterLink>

        <RouterLink
          to="/categories"
          class="nav-item"
          @click="close"
        >
          <Tags :size="18" />
          <span>Categories</span>
        </RouterLink>

        <RouterLink
          to="/budget"
          class="nav-item"
          @click="close"
        >
          <WalletCards :size="18" />
          <span>Budget</span>
        </RouterLink>

        <RouterLink
          to="/subscriptions"
          class="nav-item"
          @click="close"
        >
          <RefreshCw :size="18" />
          <span>Subscriptions</span>
        </RouterLink>


        <p class="section-title">
          INSIGHTS
        </p>

        <RouterLink
          to="/reports"
          class="nav-item"
          @click="close"
        >
          <BarChart3 :size="18" />
          <span>Reports</span>
        </RouterLink>


        <p class="section-title">
          ACCOUNT
        </p>

        <RouterLink
          to="/profile"
          class="nav-item"
          @click="close"
        >
          <UserCircle :size="18" />
          <span>Profile</span>
        </RouterLink>
      </nav>


      <!-- Bottom -->
      <div class="sidebar-bottom">

        <!-- FIX: Settings is now a real router link -->
        <RouterLink
          to="/settings"
          class="settings-button"
          @click="close"
        >
          <Settings :size="17" />
          <span>Settings</span>
        </RouterLink>


        <div class="sidebar-footer">
          <div class="footer-dot"></div>

          <div>
            <strong>
              SpendWise
            </strong>

            <span>
              v1.0 · Local Mode
            </span>
          </div>
        </div>

      </div>

    </div>
  </aside>
</template>


<script setup>
import logo from '../../assets/logo.png'

import {
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  RefreshCw,
  Settings,
  Tags,
  UserCircle,
  WalletCards
} from 'lucide-vue-next'


defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})


const emit = defineEmits([
  'close'
])


function close() {
  emit('close')
}
</script>


<style scoped>

/* =========================================
   SIDEBAR
========================================= */

.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 100;

  width: 250px;

  padding: 14px 0 14px 14px;

  transition:
    transform 0.3s ease;
}


.sidebar-inner {
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

  padding: 20px 12px;

  overflow: hidden;

  border: 1px solid var(--glass-border);
  border-radius: 22px;

  background: var(--glass-bg);

  box-shadow: var(--glass-shadow);

  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
}


/* =========================================
   BRAND
========================================= */

.brand {
  display: flex;
  align-items: center;

  gap: 10px;

  min-width: 0;

  padding: 4px 8px 22px;

  border-bottom: 1px solid var(--glass-border);
}


.brand-logo {
  display: block;

  width: 38px;
  height: 38px;

  flex-shrink: 0;

  object-fit: contain;
}


.brand-text {
  display: flex;
  flex-direction: column;

  min-width: 0;
}


.brand-text strong {
  color: var(--app-text);

  font-size: 0.95rem;
}


.brand-text span {
  margin-top: 2px;

  color: var(--app-text-muted);

  font-size: 0.64rem;
}


/* =========================================
   NAVIGATION
========================================= */

nav {
  flex: 1;

  min-height: 0;

  padding-top: 12px;

  overflow-y: auto;
}


.section-title {
  margin: 18px 8px 7px;

  color: var(--app-text-muted);

  font-size: 0.61rem;

  font-weight: 850;

  letter-spacing: 0.12em;
}


.nav-item,
.settings-button {
  display: flex;
  align-items: center;

  gap: 11px;

  width: 100%;
  min-height: 42px;

  padding: 0 11px;

  border: 1px solid transparent;
  border-radius: 11px;

  background: transparent;

  color: var(--app-text-muted);

  font-size: 0.79rem;

  font-weight: 650;

  text-decoration: none;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}


.nav-item:hover,
.settings-button:hover {
  background: var(--accent-soft);

  color: var(--app-text);
}


.nav-item.router-link-active,
.settings-button.router-link-active {
  border-color:
    rgba(99, 102, 241, 0.14);

  background:
    rgba(99, 102, 241, 0.11);

  color: var(--accent);
}


/* =========================================
   BOTTOM
========================================= */

.sidebar-bottom {
  flex-shrink: 0;

  margin-top: auto;
}


.settings-button {
  margin-bottom: 12px;
}


.sidebar-footer {
  display: flex;
  align-items: center;

  gap: 8px;

  padding: 13px 8px 2px;

  border-top: 1px solid var(--glass-border);
}


.footer-dot {
  width: 8px;
  height: 8px;

  flex-shrink: 0;

  border-radius: 50%;

  background: var(--success);

  box-shadow:
    0 0 0 4px
    rgba(16, 185, 129, 0.08);
}


.sidebar-footer > div:last-child {
  display: flex;
  flex-direction: column;

  min-width: 0;
}


.sidebar-footer strong {
  color: var(--app-text);

  font-size: 0.68rem;
}


.sidebar-footer span {
  margin-top: 2px;

  color: var(--app-text-muted);

  font-size: 0.58rem;
}


/* =========================================
   MOBILE
========================================= */

@media (max-width: 900px) {

  .sidebar {
    width: min(280px, 85vw);

    padding: 10px;

    transform: translateX(-110%);
  }


  .sidebar.sidebar-open {
    transform: translateX(0);
  }
}


/* =========================================
   SMALL MOBILE
========================================= */

@media (max-width: 430px) {

  .brand-logo {
    width: 36px;
    height: 36px;
  }

  .brand-text strong {
    font-size: 0.9rem;
  }

  .brand-text span {
    font-size: 0.6rem;
  }
}

</style>