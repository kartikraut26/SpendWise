<template>
  <main class="settings-page">

    <!-- =========================================
         PAGE HEADER
    ========================================== -->

    <section class="page-header">

      <div>
        <p class="eyebrow">
          PREFERENCES
        </p>

        <h1>
          Settings
        </h1>

        <p class="page-description">
          Manage your SpendWise preferences and account settings.
        </p>
      </div>

    </section>


    <!-- =========================================
         SETTINGS CONTENT
    ========================================== -->

    <div class="settings-grid">


      <!-- =======================================
           APPEARANCE
      ======================================== -->

      <section class="settings-card">

        <div class="card-header">

          <div class="header-icon purple">
            <Palette :size="19" />
          </div>

          <div>
            <h2>
              Appearance
            </h2>

            <p>
              Customize how SpendWise looks.
            </p>
          </div>

        </div>


        <div class="settings-list">

          <!-- Dark Mode -->

          <div class="setting-row">

            <div class="setting-info">

              <div class="setting-icon">
                <Moon
                  v-if="themeStore.isDark"
                  :size="18"
                />

                <Sun
                  v-else
                  :size="18"
                />
              </div>

              <div class="setting-text">

                <strong>
                  Dark mode
                </strong>

                <span>
                  Use a darker appearance across SpendWise.
                </span>

              </div>

            </div>


            <!-- Proper toggle -->

            <label
              class="theme-switch"
              :class="{
                active: themeStore.isDark
              }"
            >

              <input
                type="checkbox"
                :checked="themeStore.isDark"
                @change="themeStore.toggleTheme()"
                :aria-label="
                  themeStore.isDark
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                "
              />

              <span class="theme-slider">
                <span class="theme-knob"></span>
              </span>

            </label>

          </div>


          <!-- Current theme -->

          <div class="theme-status">

            <div class="status-dot"></div>

            <span>
              Currently using
              <strong>
                {{ themeStore.isDark ? 'Dark' : 'Light' }}
              </strong>
              mode
            </span>

          </div>

        </div>

      </section>



      <!-- =======================================
           ACCOUNT
      ======================================== -->

      <section class="settings-card">

        <div class="card-header">

          <div class="header-icon blue">
            <UserCircle :size="19" />
          </div>

          <div>
            <h2>
              Account
            </h2>

            <p>
              Manage your SpendWise account.
            </p>
          </div>

        </div>


        <div class="settings-list">

          <!-- Profile -->

          <RouterLink
            to="/profile"
            class="setting-row setting-link"
          >

            <div class="setting-info">

              <div class="setting-icon">
                <User :size="18" />
              </div>

              <div class="setting-text">

                <strong>
                  Profile
                </strong>

                <span>
                  Update your personal information.
                </span>

              </div>

            </div>


            <ChevronRight
              :size="18"
              class="row-arrow"
            />

          </RouterLink>


          <!-- Account information -->

          <div class="account-info">

            <div class="account-avatar">
              {{ userInitials }}
            </div>

            <div class="account-details">

              <strong>
                {{ displayName }}
              </strong>

              <span>
                {{ displayEmail }}
              </span>

            </div>

          </div>

        </div>

      </section>



      <!-- =======================================
           NOTIFICATIONS
      ======================================== -->

      <section class="settings-card">

        <div class="card-header">

          <div class="header-icon green">
            <Bell :size="19" />
          </div>

          <div>
            <h2>
              Notifications
            </h2>

            <p>
              Control your notification preferences.
            </p>
          </div>

        </div>


        <div class="settings-list">


          <!-- Transaction notifications -->

          <div class="setting-row">

            <div class="setting-info">

              <div class="setting-icon">
                <Receipt :size="18" />
              </div>

              <div class="setting-text">

                <strong>
                  Transaction updates
                </strong>

                <span>
                  Show notifications for newly added transactions.
                </span>

              </div>

            </div>


            <label
              class="theme-switch"
              :class="{
                active: notifications.transactions
              }"
            >

              <input
                v-model="notifications.transactions"
                type="checkbox"
                aria-label="Toggle transaction notifications"
                @change="saveNotificationPreferences"
              />

              <span class="theme-slider">
                <span class="theme-knob"></span>
              </span>

            </label>

          </div>


          <!-- Budget notifications -->

          <div class="setting-row">

            <div class="setting-info">

              <div class="setting-icon">
                <WalletCards :size="18" />
              </div>

              <div class="setting-text">

                <strong>
                  Budget alerts
                </strong>

                <span>
                  Receive alerts when approaching budget limits.
                </span>

              </div>

            </div>


            <label
              class="theme-switch"
              :class="{
                active: notifications.budget
              }"
            >

              <input
                v-model="notifications.budget"
                type="checkbox"
                aria-label="Toggle budget alerts"
                @change="saveNotificationPreferences"
              />

              <span class="theme-slider">
                <span class="theme-knob"></span>
              </span>

            </label>

          </div>


          <!-- Subscription notifications -->

          <div class="setting-row">

            <div class="setting-info">

              <div class="setting-icon">
                <CalendarClock :size="18" />
              </div>

              <div class="setting-text">

                <strong>
                  Subscription reminders
                </strong>

                <span>
                  Get reminders before recurring payments.
                </span>

              </div>

            </div>


            <label
              class="theme-switch"
              :class="{
                active: notifications.subscriptions
              }"
            >

              <input
                v-model="notifications.subscriptions"
                type="checkbox"
                aria-label="Toggle subscription reminders"
                @change="saveNotificationPreferences"
              />

              <span class="theme-slider">
                <span class="theme-knob"></span>
              </span>

            </label>

          </div>

        </div>

      </section>



      <!-- =======================================
           SECURITY
      ======================================== -->

      <section class="settings-card">

        <div class="card-header">

          <div class="header-icon orange">
            <ShieldCheck :size="19" />
          </div>

          <div>
            <h2>
              Security
            </h2>

            <p>
              Your account authentication is managed securely.
            </p>
          </div>

        </div>


        <div class="settings-list">

          <div class="security-row">

            <div class="security-icon">
              <LockKeyhole :size="18" />
            </div>

            <div class="security-content">

              <strong>
                Authentication
              </strong>

              <span>
                Your SpendWise account is protected using Keycloak authentication.
              </span>

            </div>

            <span class="secure-badge">
              Secure
            </span>

          </div>


          <div class="security-row">

            <div class="security-icon">
              <KeyRound :size="18" />
            </div>

            <div class="security-content">

              <strong>
                Account session
              </strong>

              <span>
                Your login session is managed securely by the authentication provider.
              </span>

            </div>

          </div>

        </div>

      </section>



      <!-- =======================================
           DANGER / LOGOUT
      ======================================== -->

      <section class="settings-card danger-card">

        <div class="card-header">

          <div class="header-icon red">
            <LogOut :size="19" />
          </div>

          <div>
            <h2>
              Sign out
            </h2>

            <p>
              Sign out of your SpendWise account on this device.
            </p>
          </div>

        </div>


        <div class="logout-content">

          <div>

            <strong>
              Ready to leave?
            </strong>

            <p>
              You can sign back in anytime using your SpendWise account.
            </p>

          </div>


          <button
            type="button"
            class="logout-button"
            :disabled="loggingOut"
            @click="handleLogout"
          >

            <Loader2
              v-if="loggingOut"
              :size="17"
              class="spin"
            />

            <LogOut
              v-else
              :size="17"
            />

            <span>
              {{ loggingOut ? 'Signing out...' : 'Sign out' }}
            </span>

          </button>

        </div>

      </section>


    </div>

  </main>
</template>



<script setup>

import {
  computed,
  reactive,
  ref
} from 'vue'

import {
  Bell,
  CalendarClock,
  ChevronRight,
  KeyRound,
  LockKeyhole,
  LogOut,
  Loader2,
  Moon,
  Palette,
  Receipt,
  ShieldCheck,
  Sun,
  User,
  UserCircle,
  WalletCards
} from 'lucide-vue-next'

import {
  useRouter
} from 'vue-router'

import {
  useAuthStore
} from '../stores/auth'

import {
  useThemeStore
} from '../stores/theme'


/* =========================================
   STORES
========================================= */

const auth =
  useAuthStore()

const themeStore =
  useThemeStore()

const router =
  useRouter()


/* =========================================
   USER
========================================= */

const displayName = computed(() => {

  return (
    auth.user?.name ||
    auth.user?.firstName ||
    auth.user?.preferred_username ||
    'SpendWise User'
  )

})


const displayEmail = computed(() => {

  return (
    auth.user?.email ||
    'Account email'
  )

})


const userInitials = computed(() => {

  const name =
    displayName.value.trim()

  if (!name) {
    return 'U'
  }

  const parts =
    name.split(/\s+/)

  if (parts.length === 1) {
    return parts[0]
      .charAt(0)
      .toUpperCase()
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase()

})


/* =========================================
   NOTIFICATIONS
========================================= */

const notificationStorageKey =
  'spendwise-notification-preferences'


function getNotificationPreferences() {

  try {

    const saved =
      localStorage.getItem(
        notificationStorageKey
      )

    if (saved) {

      const parsed =
        JSON.parse(saved)

      return {
        transactions:
          parsed.transactions !== false,

        budget:
          parsed.budget !== false,

        subscriptions:
          parsed.subscriptions !== false
      }

    }

  } catch (error) {

    console.warn(
      'Unable to read notification preferences:',
      error
    )

  }


  return {
    transactions: true,
    budget: true,
    subscriptions: true
  }

}


const notifications =
  reactive(
    getNotificationPreferences()
  )


function saveNotificationPreferences() {

  localStorage.setItem(
    notificationStorageKey,
    JSON.stringify({
      transactions:
        notifications.transactions,

      budget:
        notifications.budget,

      subscriptions:
        notifications.subscriptions
    })
  )

}


/* =========================================
   LOGOUT
========================================= */

const loggingOut =
  ref(false)


async function handleLogout() {

  if (loggingOut.value) {
    return
  }

  loggingOut.value = true

  try {

    await auth.logout()

  } catch (error) {

    console.error(
      'Logout failed:',
      error
    )

    /*
     * Fallback to login page if
     * Keycloak logout encounters
     * a temporary problem.
     */
    router.push('/login')

  } finally {

    loggingOut.value = false

  }

}

</script>



<style scoped>

/* =========================================
   PAGE
========================================= */

.settings-page {
  width: 100%;
  min-width: 0;

  padding: 28px 30px 42px;

  color: var(--app-text);
}


/* =========================================
   HEADER
========================================= */

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  margin-bottom: 24px;
}


.eyebrow {
  margin: 0 0 7px;

  color: var(--accent);

  font-size: 0.66rem;
  font-weight: 850;

  letter-spacing: 0.12em;
}


.page-header h1 {
  margin: 0;

  color: var(--app-text);

  font-size: clamp(
    1.7rem,
    2.5vw,
    2.2rem
  );

  font-weight: 850;

  letter-spacing: -0.035em;
}


.page-description {
  margin: 7px 0 0;

  color: var(--app-text-muted);

  font-size: 0.82rem;
}


/* =========================================
   GRID
========================================= */

.settings-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 18px;
}


/* =========================================
   CARD
========================================= */

.settings-card {
  min-width: 0;

  overflow: hidden;

  border:
    1px solid var(--glass-border);

  border-radius: 18px;

  background:
    var(--glass-bg);

  box-shadow:
    var(--glass-shadow);

  backdrop-filter:
    blur(20px);

  -webkit-backdrop-filter:
    blur(20px);
}


.card-header {
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 20px;

  border-bottom:
    1px solid var(--glass-border);
}


.card-header h2 {
  margin: 0;

  color: var(--app-text);

  font-size: 0.91rem;

  font-weight: 800;
}


.card-header p {
  margin: 3px 0 0;

  color: var(--app-text-muted);

  font-size: 0.69rem;

  line-height: 1.45;
}


/* =========================================
   HEADER ICON
========================================= */

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 38px;
  height: 38px;

  flex-shrink: 0;

  border-radius: 11px;
}


.header-icon.purple {
  color: #8b5cf6;

  background:
    rgba(139, 92, 246, 0.11);
}


.header-icon.blue {
  color: #3b82f6;

  background:
    rgba(59, 130, 246, 0.11);
}


.header-icon.green {
  color: #10b981;

  background:
    rgba(16, 185, 129, 0.11);
}


.header-icon.orange {
  color: #f59e0b;

  background:
    rgba(245, 158, 11, 0.11);
}


.header-icon.red {
  color: #ef4444;

  background:
    rgba(239, 68, 68, 0.11);
}


/* =========================================
   SETTINGS LIST
========================================= */

.settings-list {
  padding: 5px 20px 10px;
}


.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  min-height: 72px;

  padding: 12px 0;

  border-bottom:
    1px solid var(--glass-border);
}


.setting-row:last-child {
  border-bottom: 0;
}


.setting-info {
  display: flex;
  align-items: center;

  gap: 12px;

  min-width: 0;
}


.setting-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;

  flex-shrink: 0;

  border:
    1px solid var(--glass-border);

  border-radius: 10px;

  background:
    var(--accent-soft);

  color: var(--accent);
}


.setting-text {
  display: flex;
  flex-direction: column;

  min-width: 0;
}


.setting-text strong {
  color: var(--app-text);

  font-size: 0.76rem;

  font-weight: 750;
}


.setting-text span {
  margin-top: 3px;

  color: var(--app-text-muted);

  font-size: 0.65rem;

  line-height: 1.4;
}


/* =========================================
   THEME SWITCH
========================================= */

.theme-switch {
  position: relative;

  display: inline-flex;
  align-items: center;

  width: 48px;
  height: 28px;

  flex: 0 0 48px;

  margin-left: auto;

  cursor: pointer;
}


.theme-switch input {
  position: absolute;

  width: 1px;
  height: 1px;

  opacity: 0;

  pointer-events: none;
}


.theme-slider {
  position: relative;

  display: flex;
  align-items: center;

  width: 48px;
  height: 28px;

  padding: 3px;

  border-radius: 999px;

  background: #cbd5e1;

  transition:
    background 0.22s ease,
    box-shadow 0.22s ease;
}


.theme-knob {
  display: block;

  width: 22px;
  height: 22px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #ffffff;

  box-shadow:
    0 2px 5px
    rgba(15, 23, 42, 0.18);

  transform: translateX(0);

  transition:
    transform 0.22s ease;
}


.theme-switch.active
.theme-slider {
  background:
    var(--accent);
}


.theme-switch.active
.theme-knob {
  transform:
    translateX(20px);
}


.theme-switch:hover
.theme-slider {
  box-shadow:
    0 0 0 4px
    var(--accent-soft);
}


.theme-switch
input:focus-visible
+ .theme-slider {
  outline:
    2px solid var(--accent);

  outline-offset: 3px;
}


/* =========================================
   THEME STATUS
========================================= */

.theme-status {
  display: flex;
  align-items: center;

  gap: 7px;

  padding: 11px 0 6px;

  color: var(--app-text-muted);

  font-size: 0.64rem;
}


.theme-status strong {
  color: var(--app-text);
}


.status-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: var(--success);
}


/* =========================================
   LINK ROW
========================================= */

.setting-link {
  color: inherit;

  text-decoration: none;

  cursor: pointer;

  transition:
    padding 0.2s ease,
    background 0.2s ease;
}


.setting-link:hover {
  padding-left: 8px;
  padding-right: 8px;

  border-radius: 10px;

  background:
    var(--accent-soft);
}


.row-arrow {
  flex-shrink: 0;

  color: var(--app-text-muted);

  transition:
    transform 0.2s ease;
}


.setting-link:hover
.row-arrow {
  transform:
    translateX(3px);

  color: var(--accent);
}


/* =========================================
   ACCOUNT
========================================= */

.account-info {
  display: flex;
  align-items: center;

  gap: 11px;

  padding: 15px 0 7px;
}


.account-avatar {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  flex-shrink: 0;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      var(--accent),
      #8b5cf6
    );

  color: white;

  font-size: 0.75rem;

  font-weight: 800;
}


.account-details {
  display: flex;
  flex-direction: column;

  min-width: 0;
}


.account-details strong {
  color: var(--app-text);

  font-size: 0.75rem;
}


.account-details span {
  margin-top: 3px;

  overflow: hidden;

  color: var(--app-text-muted);

  font-size: 0.64rem;

  text-overflow: ellipsis;
}


/* =========================================
   SECURITY
========================================= */

.security-row {
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 14px 0;

  border-bottom:
    1px solid var(--glass-border);
}


.security-row:last-child {
  border-bottom: 0;
}


.security-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;

  flex-shrink: 0;

  border-radius: 10px;

  background:
    rgba(245, 158, 11, 0.1);

  color: #f59e0b;
}


.security-content {
  display: flex;
  flex-direction: column;

  min-width: 0;

  flex: 1;
}


.security-content strong {
  color: var(--app-text);

  font-size: 0.74rem;

  font-weight: 750;
}


.security-content span {
  margin-top: 3px;

  color: var(--app-text-muted);

  font-size: 0.63rem;

  line-height: 1.45;
}


.secure-badge {
  flex-shrink: 0;

  padding: 5px 8px;

  border-radius: 999px;

  background:
    rgba(16, 185, 129, 0.1);

  color: var(--success);

  font-size: 0.58rem;

  font-weight: 800;
}


/* =========================================
   DANGER CARD
========================================= */

.danger-card {
  grid-column: 1 / -1;
}


.logout-content {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 20px;
}


.logout-content strong {
  color: var(--app-text);

  font-size: 0.78rem;

  font-weight: 800;
}


.logout-content p {
  margin: 4px 0 0;

  color: var(--app-text-muted);

  font-size: 0.65rem;
}


.logout-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  min-width: 120px;

  height: 38px;

  padding: 0 15px;

  flex-shrink: 0;

  border:
    1px solid
    rgba(239, 68, 68, 0.18);

  border-radius: 10px;

  background:
    rgba(239, 68, 68, 0.08);

  color: var(--danger);

  font-size: 0.68rem;

  font-weight: 750;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}


.logout-button:hover:not(:disabled) {
  background:
    rgba(239, 68, 68, 0.14);

  transform:
    translateY(-1px);
}


.logout-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}


.spin {
  animation:
    spin 0.8s linear infinite;
}


@keyframes spin {

  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }

}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 900px) {

  .settings-page {
    padding: 22px 20px 35px;
  }


  .settings-grid {
    grid-template-columns: 1fr;
  }


  .danger-card {
    grid-column: auto;
  }

}


@media (max-width: 600px) {

  .settings-page {
    padding: 18px 15px 30px;
  }


  .page-header {
    margin-bottom: 18px;
  }


  .page-header h1 {
    font-size: 1.65rem;
  }


  .page-description {
    font-size: 0.74rem;
  }


  .card-header {
    padding: 16px;
  }


  .settings-list {
    padding-left: 16px;
    padding-right: 16px;
  }


  .setting-row {
    min-height: 68px;
  }


  .setting-text span {
    max-width: 230px;
  }


  .logout-content {
    align-items: flex-start;

    flex-direction: column;
  }


  .logout-button {
    width: 100%;
  }

}


@media (max-width: 400px) {

  .setting-info {
    gap: 9px;
  }


  .setting-icon {
    width: 33px;
    height: 33px;
  }


  .setting-text strong {
    font-size: 0.71rem;
  }


  .setting-text span {
    font-size: 0.6rem;
  }


  .theme-switch {
    width: 44px;
    height: 26px;

    flex-basis: 44px;
  }


  .theme-slider {
    width: 44px;
    height: 26px;
  }


  .theme-knob {
    width: 20px;
    height: 20px;
  }


  .theme-switch.active
  .theme-knob {
    transform:
      translateX(18px);
  }

}

</style>