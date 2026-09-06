<template>
  <div class="profile-page spendwise-page">

    <!-- Header -->
    <section class="page-heading">

      <div>

        <p class="eyebrow">
          ACCOUNT
        </p>

        <h1>
          Your Profile
        </h1>

        <p>
          Manage the personal information connected to your SpendWise account.
        </p>

      </div>

    </section>


    <!-- Loading -->
    <div
      v-if="loading"
      class="state-card glass-surface"
    >

      <span class="spinner"></span>

      <span>
        Loading your profile...
      </span>

    </div>


    <!-- Content -->
    <template v-else>

      <section class="profile-layout">


        <!-- Account Card -->
        <div class="profile-card glass-surface">

          <div class="avatar-large">
            {{ initials }}
          </div>

          <h2>
            {{
              form.displayName ||
              'SpendWise User'
            }}
          </h2>

          <p>
            {{
              form.email ||
              'Your account email'
            }}
          </p>

          <span class="account-badge">
            Personal account
          </span>


          <div class="profile-divider"></div>


          <div class="account-meta">

            <span>
              Account status
            </span>

            <strong>
              <i></i>
              Active
            </strong>

          </div>


          <div class="account-meta">

            <span>
              Member since
            </span>

            <strong>
              {{ memberSince }}
            </strong>

          </div>

        </div>


        <!-- Form -->
        <form
          class="form-card glass-surface"
          @submit.prevent="saveProfile"
        >

          <div class="card-header">

            <div>

              <p class="eyebrow">
                PERSONAL DETAILS
              </p>

              <h2>
                Profile information
              </h2>

            </div>

            <UserRound :size="20" />

          </div>


          <!-- First / Last -->
          <div class="form-grid">

            <label>

              <span>
                First name
              </span>

              <input
                v-model.trim="form.firstName"
                type="text"
                maxlength="60"
                autocomplete="given-name"
                placeholder="First name"
              />

            </label>


            <label>

              <span>
                Last name
              </span>

              <input
                v-model.trim="form.lastName"
                type="text"
                maxlength="60"
                autocomplete="family-name"
                placeholder="Last name"
              />

            </label>

          </div>


          <!-- Display name -->
          <label>

            <span>
              Display name
            </span>

            <input
              v-model.trim="form.displayName"
              type="text"
              maxlength="100"
              autocomplete="name"
              placeholder="How your name should appear in SpendWise"
            />

            <small>
              This name is shown in your dashboard and account menu.
            </small>

          </label>


          <!-- Email -->
          <label>

            <span>
              Email address
            </span>

            <input
              :value="form.email"
              type="email"
              readonly
            />

            <small>
              Your email is managed by your Keycloak/Google account and cannot be changed here.
            </small>

          </label>


          <!-- Messages -->
          <div
            v-if="message"
            class="alert success"
          >
            {{ message }}
          </div>


          <div
            v-if="error"
            class="alert error"
          >
            {{ error }}
          </div>


          <!-- Actions -->
          <div class="form-actions">

            <button
              class="secondary-button"
              type="button"
              :disabled="saving"
              @click="resetForm"
            >
              Discard
            </button>


            <button
              class="primary-button"
              type="submit"
              :disabled="
                saving ||
                !form.displayName.trim()
              "
            >

              <span
                v-if="saving"
                class="button-spinner"
              ></span>

              {{
                saving
                  ? 'Saving...'
                  : 'Save changes'
              }}

            </button>

          </div>

        </form>

      </section>

    </template>

  </div>
</template>


<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref
} from 'vue'

import {
  UserRound
} from 'lucide-vue-next'

import api
  from '../services/api'

import {
  useAuthStore
} from '../stores/auth'


const auth =
  useAuthStore()


const loading =
  ref(true)

const saving =
  ref(false)

const message =
  ref('')

const error =
  ref('')


const form =
  reactive({

    firstName: '',

    lastName: '',

    displayName: '',

    email: ''

  })


const original =
  ref(null)


const initials =
  computed(() => {

    const name =
      form.displayName ||
      form.firstName ||
      form.email ||
      'U'


    const parts =
      name
        .trim()
        .split(/\s+/)
        .filter(Boolean)


    if (
      parts.length >= 2
    ) {

      return (
        `${parts[0][0]}${parts[1][0]}`
      ).toUpperCase()

    }


    return name
      .slice(0, 2)
      .toUpperCase()

  })


const memberSince =
  computed(() => {

    if (
      !original.value?.createdAt
    ) {

      return 'Recently'

    }


    return new Date(
      original.value.createdAt
    ).toLocaleDateString(
      'en-IN',
      {
        month: 'short',
        year: 'numeric'
      }
    )

  })


function fillForm(user) {

  form.firstName =
    user?.firstName || ''

  form.lastName =
    user?.lastName || ''

  form.displayName =
    user?.displayName ||
    user?.name ||
    user?.firstName ||
    ''

  form.email =
    user?.email ||
    auth.user?.email ||
    ''


  original.value = {
    ...user
  }

}


async function loadProfile() {

  loading.value = true

  message.value = ''
  error.value = ''


  try {

    const response =
      await api.get(
        '/profile/me'
      )


    fillForm(
      response.data?.data || {}
    )

  } catch (err) {

    console.error(
      'Failed to load profile:',
      err
    )


    error.value =
      err.response?.data?.message ||
      'Could not load your profile.'

  } finally {

    loading.value = false

  }

}


function resetForm() {

  if (
    original.value
  ) {

    fillForm(
      original.value
    )

  }


  message.value = ''
  error.value = ''

}


async function saveProfile() {

  const displayName =
    form.displayName.trim()


  if (!displayName) {

    error.value =
      'Display name cannot be empty.'

    return

  }


  saving.value = true

  message.value = ''
  error.value = ''


  try {

    const response =
      await api.patch(
        '/profile/me',
        {
          firstName:
            form.firstName.trim(),

          lastName:
            form.lastName.trim(),

          displayName
        }
      )


    const saved =
      response.data?.data


    if (!saved) {

      throw new Error(
        'The server did not return the updated profile.'
      )

    }


    fillForm(saved)


    /*
     * Update the in-memory auth user immediately
     * so Navbar and Dashboard change without
     * requiring another login.
     */
    if (auth.user) {

      auth.user.firstName =
        saved.firstName || ''

      auth.user.lastName =
        saved.lastName || ''

      auth.user.name =
        saved.displayName ||
        displayName

      auth.user.email =
        saved.email ||
        auth.user.email

    }


    message.value =
      'Profile updated successfully.'

  } catch (err) {

    console.error(
      'Failed to save profile:',
      err
    )


    error.value =
      err.response?.data?.message ||
      err.message ||
      'Could not save your profile.'

  } finally {

    saving.value = false

  }

}


onMounted(
  loadProfile
)
</script>


<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 30px 34px 44px;
  background: var(--app-bg);
}

.page-heading {
  margin-bottom: 22px;
}

.eyebrow {
  color: var(--accent);
  font-size: .62rem;
  font-weight: 800;
  letter-spacing: .13em;
}

.page-heading h1 {
  margin-top: 5px;
  color: var(--app-text);
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -.03em;
}

.page-heading p:last-child {
  margin-top: 5px;
  color: var(--app-text-muted);
  font-size: .78rem;
}

.profile-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 20px;
  max-width: 1050px;
}

.glass-surface {
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  background: var(--glass-bg);
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.profile-card {
  height: max-content;
  padding: 28px 24px;
  text-align: center;
}

.avatar-large {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 82px;
  height: 82px;

  margin: 0 auto 14px;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #6366f1,
      #7c3aed
    );

  color: #fff;

  font-size: 1.35rem;
  font-weight: 800;

  box-shadow:
    0 12px 28px
    rgba(99, 102, 241, .25);
}

.profile-card h2 {
  color: var(--app-text);
  font-size: 1rem;
  font-weight: 800;
}

.profile-card > p {
  margin-top: 4px;
  color: var(--app-text-muted);
  font-size: .7rem;
  word-break: break-word;
}

.account-badge {
  display: inline-flex;

  margin-top: 13px;
  padding: 5px 9px;

  border-radius: 999px;

  background: var(--accent-soft);
  color: var(--accent);

  font-size: .58rem;
  font-weight: 800;
}

.profile-divider {
  height: 1px;
  margin: 23px 0 16px;
  background: var(--glass-border);
}

.account-meta {
  display: flex;
  justify-content: space-between;

  gap: 10px;

  padding: 7px 0;

  font-size: .65rem;
}

.account-meta span {
  color: var(--app-text-muted);
}

.account-meta strong {
  color: var(--app-text);
  font-weight: 700;
}

.account-meta strong i {
  display: inline-block;

  width: 6px;
  height: 6px;

  margin-right: 4px;

  border-radius: 50%;

  background: var(--success);
}

.form-card {
  padding: 26px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  margin-bottom: 22px;
}

.card-header h2 {
  margin-top: 4px;

  color: var(--app-text);

  font-size: 1rem;
  font-weight: 800;
}

.card-header > svg {
  color: var(--app-text-muted);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;

  gap: 7px;

  margin-bottom: 17px;
}

label > span {
  color: var(--app-text);

  font-size: .68rem;
  font-weight: 750;
}

input {
  width: 100%;
  min-height: 42px;

  padding: 0 12px;

  border: 1px solid var(--glass-border);
  border-radius: 10px;

  outline: none;

  background: var(--input-bg);
  color: var(--app-text);

  font-size: .72rem;

  transition:
    border-color .2s,
    box-shadow .2s;
}

input:focus {
  border-color:
    rgba(99, 102, 241, .55);

  box-shadow:
    0 0 0 3px
    var(--accent-soft);
}

input[readonly] {
  opacity: .7;
  cursor: not-allowed;
}

small {
  color: var(--app-text-muted);

  font-size: .59rem;

  line-height: 1.45;
}

.form-actions {
  display: flex;
  justify-content: flex-end;

  gap: 9px;

  margin-top: 7px;
}

.primary-button,
.secondary-button {
  min-height: 40px;

  padding: 0 16px;

  border-radius: 10px;

  font-size: .68rem;
  font-weight: 750;

  cursor: pointer;
}

.primary-button {
  border: 1px solid var(--accent);

  background: var(--accent);
  color: #fff;
}

.secondary-button {
  border: 1px solid var(--glass-border);

  background: transparent;
  color: var(--app-text);
}

.primary-button:disabled,
.secondary-button:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.alert {
  margin: 5px 0 14px;

  padding: 10px 12px;

  border-radius: 9px;

  font-size: .65rem;
}

.alert.success {
  background:
    rgba(16, 185, 129, .1);

  color: var(--success);
}

.alert.error {
  background:
    rgba(239, 68, 68, .1);

  color: var(--danger);
}

.state-card {
  max-width: 1050px;

  min-height: 100px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  color: var(--app-text-muted);

  font-size: .72rem;
}

.spinner,
.button-spinner {
  display: inline-block;

  border-radius: 50%;

  animation:
    spin .7s linear infinite;
}

.spinner {
  width: 17px;
  height: 17px;

  border: 2px solid
    rgba(99, 102, 241, .2);

  border-top-color:
    var(--accent);
}

.button-spinner {
  width: 12px;
  height: 12px;

  margin-right: 6px;

  border: 2px solid
    rgba(255,255,255,.35);

  border-top-color: #fff;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 800px) {

  .profile-page {
    padding: 22px 18px 35px;
  }

  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-card {
    display: grid;

    grid-template-columns:
      auto 1fr;

    column-gap: 16px;

    text-align: left;

    align-items: center;
  }

  .avatar-large {
    grid-row: span 3;
    margin: 0;
  }

  .account-badge {
    margin-top: 8px;
  }

  .profile-divider {
    grid-column: 1 / -1;
    margin: 18px 0 10px;
  }

  .account-meta {
    grid-column: 1 / -1;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 430px) {

  .profile-page {
    padding: 18px 12px 28px;
  }

  .form-card {
    padding: 18px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }

}
</style>