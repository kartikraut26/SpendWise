<template>
  <main class="spendwise-page">
    <div class="spendwise-container">

      <!-- Header -->
      <header class="spendwise-header">

        <div class="spendwise-brand">
          <h1>SpendWise</h1>

          <p>
            Personal Finance Tracker
          </p>
        </div>

        <button
          type="button"
          class="theme-toggle"
          @click="themeStore.toggleTheme"
        >
          <span>
            {{ themeStore.isDark ? '☀️' : '🌙' }}
          </span>

          <span>
            {{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}
          </span>
        </button>

      </header>

      <!-- Feature Card -->
      <section class="glass-surface spendwise-feature">

        <div class="spendwise-feature-content">

          <div>
            <h2>
              Glassmorphism UI
            </h2>

            <p>
              Reusable SpendWise components are working.
            </p>
          </div>

          <GlassButton>
            Test Button
          </GlassButton>

        </div>

      </section>

      <!-- Statistics -->
      <section class="spendwise-stats">

        <StatCard
          title="Total Balance"
          value="₹50,000"
          subtitle="Current balance"
        />

        <StatCard
          title="Income"
          value="₹75,000"
          subtitle="This month"
        />

        <StatCard
          title="Expenses"
          value="₹25,000"
          subtitle="This month"
        />

      </section>

    </div>
  </main>
</template>

<script setup>
import GlassButton from '../components/ui/GlassButton.vue'
import StatCard from '../components/ui/StatCard.vue'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()
</script>