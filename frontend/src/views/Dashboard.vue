<template>
  <div class="dashboard-page">

    <!-- Welcome -->
    <section class="welcome-section">
      <div>
        <h1>
          Good evening 👋
        </h1>

        <p>
          Here's your financial overview.
        </p>
      </div>
    </section>

    <!-- Feature -->
    <section class="glass-surface feature-card">

      <div>
        <h2>
          Financial Overview
        </h2>

        <p>
          Track your income, expenses and balance in one place.
        </p>
      </div>

      <GlassButton>
        Add Transaction
      </GlassButton>

    </section>

    <!-- Statistics -->
    <section class="stats-grid">

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
</template>

<script setup>
import GlassButton from '../components/ui/GlassButton.vue'
import StatCard from '../components/ui/StatCard.vue'
</script>

<style scoped>
.dashboard-page {
  width: min(100% - 32px, 1152px);
  margin: 0 auto;
  padding: 32px 0;
}

.welcome-section {
  margin-bottom: 28px;
}

.welcome-section h1 {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 800;

  color: var(--app-text);
}

.welcome-section p {
  margin-top: 6px;
  color: var(--app-text-muted);
}

.feature-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  padding: 28px;

  margin-bottom: 24px;
}

.feature-card h2 {
  font-size: 1.35rem;
  font-weight: 700;

  color: var(--app-text);
}

.feature-card p {
  margin-top: 7px;

  color: var(--app-text-muted);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .dashboard-page {
    width: min(100% - 24px, 100%);
    padding: 20px 0;
  }

  .feature-card {
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>