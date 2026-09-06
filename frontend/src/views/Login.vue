<template>
  <div class="login-page">

    <div class="login-glow glow-one"></div>
    <div class="login-glow glow-two"></div>


    <main class="login-container">

      <section class="login-card glass-surface">

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


        <!-- Header -->

        <div class="login-header">

          <p class="eyebrow">
            WELCOME BACK
          </p>

          <h1>
            Manage your money
            <span>smarter.</span>
          </h1>

          <p>
            Sign in to continue to your
            personal finance dashboard.
          </p>

        </div>


        <!-- Google -->

        <button
          type="button"
          class="google-button"
          :disabled="loading"
          @click="handleGoogleLogin"
        >

          <span class="google-icon">
            G
          </span>

          <span>
            Continue with Google
          </span>

        </button>


        <div class="divider">

          <span></span>

          <small>
            OR
          </small>

          <span></span>

        </div>


        <!-- Keycloak login -->

        <button
          type="button"
          class="secondary-button"
          :disabled="loading"
          @click="handleLogin"
        >

          <span>
            Continue with SpendWise
          </span>

          <ArrowRight
            :size="17"
          />

        </button>


        <!-- Security -->

        <div class="security-note">

          <ShieldCheck
            :size="16"
          />

          <span>
            Secured with Keycloak
            and OpenID Connect
          </span>

        </div>


        <!-- Error -->

        <p
          v-if="errorMessage"
          class="error-message"
        >
          {{ errorMessage }}
        </p>

      </section>


      <p class="login-footer">
        SpendWise · Personal Finance
      </p>

    </main>

  </div>
</template>


<script setup>
import {
  computed,
  ref
} from 'vue'

import {
  ArrowRight,
  ShieldCheck
} from 'lucide-vue-next'

import logo from '../assets/logo.png'

import {
  useAuthStore
} from '../stores/auth'


const auth =
  useAuthStore()

const loading =
  ref(false)


const errorMessage =
  computed(() =>
    auth.error
  )


async function handleGoogleLogin() {

  loading.value = true

  try {

    await auth.loginWithGoogle()

  } catch (error) {

    console.error(
      'Google login failed:',
      error
    )

    loading.value = false
  }
}


async function handleLogin() {

  loading.value = true

  try {

    await auth.login()

  } catch (error) {

    console.error(
      'Login failed:',
      error
    )

    loading.value = false
  }
}
</script>


<style scoped>

.login-page {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 100vh;

  padding: 24px;

  overflow: hidden;

  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(99, 102, 241, 0.16),
      transparent 30%
    ),
    radial-gradient(
      circle at 90% 90%,
      rgba(14, 165, 233, 0.1),
      transparent 30%
    ),
    var(--app-bg);
}


.login-glow {
  position: absolute;

  width: 280px;
  height: 280px;

  border-radius: 50%;

  filter: blur(70px);

  pointer-events: none;
}


.glow-one {
  top: -100px;
  left: -80px;

  background:
    rgba(99, 102, 241, 0.12);
}


.glow-two {
  right: -100px;
  bottom: -120px;

  background:
    rgba(14, 165, 233, 0.08);
}


.login-container {
  position: relative;
  z-index: 1;

  width: 100%;
  max-width: 430px;
}


.login-card {
  width: 100%;

  padding: 34px;

  border-radius: 24px;

  background:
    var(--glass-bg);

  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}


/* BRAND */

.brand {
  display: flex;
  align-items: center;

  gap: 11px;

  margin-bottom: 34px;
}


.brand-logo {
  width: 44px;
  height: 44px;

  object-fit: contain;
}


.brand-text {
  display: flex;
  flex-direction: column;
}


.brand-text strong {
  color: var(--app-text);

  font-size: 1rem;
  font-weight: 850;
}


.brand-text span {
  margin-top: 2px;

  color: var(--app-text-muted);

  font-size: 0.64rem;
}


/* HEADER */

.login-header {
  margin-bottom: 25px;
}


.eyebrow {
  margin-bottom: 8px;

  color: var(--accent);

  font-size: 0.65rem;
  font-weight: 850;

  letter-spacing: 0.13em;
}


.login-header h1 {
  color: var(--app-text);

  font-size: clamp(
    1.8rem,
    6vw,
    2.25rem
  );

  line-height: 1.1;

  font-weight: 850;

  letter-spacing: -0.04em;
}


.login-header h1 span {
  color: var(--accent);
}


.login-header p:last-child {
  margin-top: 10px;

  color: var(--app-text-muted);

  font-size: 0.82rem;

  line-height: 1.6;
}


/* BUTTONS */

.google-button,
.secondary-button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 48px;

  border-radius: 12px;

  font-size: 0.82rem;
  font-weight: 750;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}


.google-button {
  gap: 10px;

  border: 1px solid var(--glass-border);

  background:
    var(--input-bg);

  color: var(--app-text);
}


.google-button:hover:not(:disabled) {
  transform: translateY(-1px);

  box-shadow:
    0 10px 25px
    rgba(15, 23, 42, 0.08);
}


.google-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 23px;
  height: 23px;

  border-radius: 50%;

  background: white;

  color: #4285f4;

  font-size: 0.78rem;
  font-weight: 900;
}


.secondary-button {
  gap: 8px;

  border: 0;

  background:
    linear-gradient(
      135deg,
      #6366f1,
      #7c3aed
    );

  color: white;

  box-shadow:
    0 8px 22px
    rgba(99, 102, 241, 0.22);
}


.secondary-button:hover:not(:disabled) {
  transform: translateY(-1px);

  box-shadow:
    0 12px 28px
    rgba(99, 102, 241, 0.3);
}


button:disabled {
  opacity: 0.55;

  cursor: not-allowed;
}


/* DIVIDER */

.divider {
  display: flex;
  align-items: center;

  gap: 10px;

  margin: 19px 0;
}


.divider span {
  flex: 1;

  height: 1px;

  background:
    var(--glass-border);
}


.divider small {
  color: var(--app-text-muted);

  font-size: 0.58rem;
  font-weight: 700;
}


/* SECURITY */

.security-note {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  margin-top: 22px;

  color: var(--app-text-muted);

  font-size: 0.62rem;

  text-align: center;
}


.security-note svg {
  color: var(--success);

  flex-shrink: 0;
}


/* ERROR */

.error-message {
  margin-top: 15px;

  padding: 10px 12px;

  border: 1px solid
    rgba(239, 68, 68, 0.2);

  border-radius: 9px;

  background:
    rgba(239, 68, 68, 0.08);

  color: var(--danger);

  font-size: 0.68rem;

  text-align: center;
}


/* FOOTER */

.login-footer {
  margin-top: 18px;

  color: var(--app-text-muted);

  font-size: 0.58rem;

  text-align: center;
}


/* MOBILE */

@media (max-width: 500px) {

  .login-page {
    padding: 16px;
  }

  .login-card {
    padding: 26px 21px;

    border-radius: 20px;
  }

  .brand {
    margin-bottom: 27px;
  }
}

</style>