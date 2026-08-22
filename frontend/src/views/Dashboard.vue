<template>
  <div class="dashboard">

    <!-- =========================================
         WELCOME
    ========================================== -->

    <section class="welcome">

      <div class="welcome-content">

        <p class="welcome-eyebrow">
          PERSONAL FINANCE
        </p>

        <h1>
          Good evening, Kartik <span>👋</span>
        </h1>

        <p class="welcome-subtitle">
          Here's what's happening with your money.
        </p>

      </div>


      <button
        type="button"
        class="add-button"
        @click="showTransactionModal = true"
      >
        <Plus :size="19" />
        <span>Add Transaction</span>
      </button>

    </section>


    <!-- =========================================
         BALANCE
    ========================================== -->

    <section class="balance-card glass-surface">

      <div class="balance-main">

        <div class="balance-label">
          <Wallet :size="17" />
          <span>Total Balance</span>
        </div>

        <div class="balance-value">
          {{ formatCurrency(finance.totalBalance) }}
        </div>

        <div class="balance-change positive">

          <TrendingUp :size="15" />

          <strong>
            12.5%
          </strong>

          <span>
            vs last month
          </span>

        </div>

      </div>


      <div class="balance-chart">

        <div
          v-for="(height, index) in chartBars"
          :key="index"
          class="chart-bar"
          :style="{ height: `${height}%` }"
        ></div>

      </div>

    </section>


    <!-- =========================================
         STAT CARDS
    ========================================== -->

    <section class="stats-grid">

      <!-- Income -->

      <div class="stat-card glass-surface">

        <div class="stat-top">

          <div class="stat-icon income">
            <ArrowUpRight :size="19" />
          </div>

          <span class="stat-badge positive">
            +8.2%
          </span>

        </div>

        <p class="stat-label">
          Total Income
        </p>

        <h2>
          {{ formatCurrency(finance.totalIncome) }}
        </h2>

        <p class="stat-note">
          This month
        </p>

      </div>


      <!-- Expenses -->

      <div class="stat-card glass-surface">

        <div class="stat-top">

          <div class="stat-icon expense">
            <ArrowDownRight :size="19" />
          </div>

          <span class="stat-badge negative">
            -3.4%
          </span>

        </div>

        <p class="stat-label">
          Total Expenses
        </p>

        <h2>
          {{ formatCurrency(finance.totalExpenses) }}
        </h2>

        <p class="stat-note">
          This month
        </p>

      </div>


      <!-- Savings -->

      <div class="stat-card glass-surface">

        <div class="stat-top">

          <div class="stat-icon savings">
            <PiggyBank :size="19" />
          </div>

          <span class="stat-badge neutral">
            {{ finance.savingsPercentage }}%
          </span>

        </div>

        <p class="stat-label">
          Savings Goal
        </p>

        <h2>
          {{ formatCurrency(finance.savingsGoal.current) }}
        </h2>

        <p class="stat-note">
          of {{ formatCurrency(finance.savingsGoal.target) }}
        </p>

      </div>

    </section>


    <!-- =========================================
         ANALYTICS
    ========================================== -->

    <section class="analytics-grid">

      <!-- Spending -->

      <div class="analytics-card glass-surface">

        <div class="card-header">

          <div>
            <p class="card-eyebrow">
              ANALYTICS
            </p>

            <h3>
              Spending Overview
            </h3>
          </div>

          <button
            type="button"
            class="period-button"
          >
            This month
            <ChevronDown :size="15" />
          </button>

        </div>


        <div class="spending-content">

          <div class="donut-wrapper">

            <div class="donut">

              <div class="donut-center">

                <strong>
                  {{ formatCurrency(finance.totalExpenses) }}
                </strong>

                <span>
                  spent
                </span>

              </div>

            </div>

          </div>


          <div class="legend">

            <div
              v-for="item in spendingCategories"
              :key="item.name"
              class="legend-item"
            >

              <span
                class="legend-dot"
                :style="{
                  background: item.color
                }"
              ></span>

              <span class="legend-name">
                {{ item.name }}
              </span>

              <strong>
                {{ item.percent }}%
              </strong>

            </div>

          </div>

        </div>

      </div>


      <!-- Budget -->

      <div class="analytics-card glass-surface">

        <div class="card-header">

          <div>
            <p class="card-eyebrow">
              PLANNING
            </p>

            <h3>
              Monthly Budget
            </h3>
          </div>

          <WalletCards
            :size="20"
            class="header-icon"
          />

        </div>


        <div class="budget-list">

          <div
            v-for="budget in finance.budgets"
            :key="budget.category"
            class="budget-item"
          >

            <div class="budget-top">

              <div>

                <span>
                  {{ budget.category }}
                </span>

                <small>
                  {{ formatCurrency(budget.spent) }}
                  /
                  {{ formatCurrency(budget.limit) }}
                </small>

              </div>

              <strong>
                {{ budgetPercent(budget) }}%
              </strong>

            </div>


            <div class="progress-track">

              <div
                class="progress-fill"
                :class="{
                  exceeded:
                    budgetPercent(budget) >= 100
                }"
                :style="{
                  width:
                    `${Math.min(
                      budgetPercent(budget),
                      100
                    )}%`
                }"
              ></div>

            </div>

          </div>

        </div>

      </div>

    </section>


    <!-- =========================================
         BOTTOM
    ========================================== -->

    <section class="bottom-grid">

      <!-- Transactions -->

      <div class="transactions-card glass-surface">

        <div class="card-header">

          <div>

            <p class="card-eyebrow">
              ACTIVITY
            </p>

            <h3>
              Recent Transactions
            </h3>

          </div>

          <button
            type="button"
            class="view-button"
          >
            View all
            <ArrowRight :size="15" />
          </button>

        </div>


        <div class="transaction-list">

          <div
            v-for="transaction in finance.transactions.slice(0, 5)"
            :key="transaction.id"
            class="transaction-row"
          >

            <div
              class="transaction-icon"
              :class="transaction.type"
            >

              <Wallet
                v-if="transaction.icon === 'wallet'"
                :size="18"
              />

              <Utensils
                v-else-if="transaction.icon === 'food'"
                :size="18"
              />

              <Car
                v-else-if="transaction.icon === 'transport'"
                :size="18"
              />

              <CreditCard
                v-else-if="
                  transaction.icon === 'subscription'
                "
                :size="18"
              />

              <Receipt
                v-else
                :size="18"
              />

            </div>


            <div class="transaction-info">

              <strong>
                {{ transaction.title }}
              </strong>

              <span>
                {{ transaction.category }}
                ·
                {{ transaction.date }}
              </span>

            </div>


            <div
              class="transaction-amount"
              :class="transaction.type"
            >
              {{
                transaction.type === 'income'
                  ? '+'
                  : '-'
              }}

              {{ formatCurrency(transaction.amount) }}
            </div>

          </div>

        </div>

      </div>


      <!-- Savings Goal -->

      <div class="goal-card glass-surface">

        <div class="card-header">

          <div>

            <p class="card-eyebrow">
              YOUR GOAL
            </p>

            <h3>
              Savings Goal
            </h3>

          </div>

          <Target
            :size="21"
            class="header-icon"
          />

        </div>


        <div class="goal-visual">

          <div
            class="goal-ring"
            :style="{
              '--progress':
                `${finance.savingsPercentage}%`
            }"
          >

            <div>

              <strong>
                {{ finance.savingsPercentage }}%
              </strong>

              <span>
                complete
              </span>

            </div>

          </div>


          <div class="goal-details">

            <strong>
              {{ finance.savingsGoal.title }}
            </strong>

            <p>
              {{ formatCurrency(
                finance.savingsGoal.current
              ) }}

              saved of

              {{ formatCurrency(
                finance.savingsGoal.target
              ) }}
            </p>

            <span>

              {{ formatCurrency(
                finance.savingsGoal.target -
                finance.savingsGoal.current
              ) }}

              remaining

            </span>

          </div>

        </div>


        <button
          type="button"
          class="goal-button"
          @click="showTransactionModal = true"
        >

          <span>
            Add to savings
          </span>

          <ArrowRight :size="16" />

        </button>

      </div>

    </section>


    <!-- =========================================
         MODAL
    ========================================== -->

    <AddTransactionModal
      :open="showTransactionModal"
      @close="showTransactionModal = false"
      @submit="handleAddTransaction"
    />

  </div>
</template>


<script setup>
import { ref } from 'vue'

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Car,
  ChevronDown,
  CreditCard,
  PiggyBank,
  Plus,
  Receipt,
  Target,
  TrendingUp,
  Utensils,
  Wallet,
  WalletCards
} from 'lucide-vue-next'

import { useFinanceStore } from '../stores/finance'

import AddTransactionModal
  from '../components/ui/AddTransactionModal.vue'


const finance = useFinanceStore()

const showTransactionModal = ref(false)


const chartBars = [
  35,
  48,
  42,
  65,
  55,
  72,
  61,
  82,
  68,
  75,
  58,
  88,
  72,
  94
]


const spendingCategories = [
  {
    name: 'Food',
    percent: 35,
    color: '#6366f1'
  },
  {
    name: 'Transport',
    percent: 20,
    color: '#06b6d4'
  },
  {
    name: 'Shopping',
    percent: 18,
    color: '#8b5cf6'
  },
  {
    name: 'Bills',
    percent: 15,
    color: '#f59e0b'
  },
  {
    name: 'Other',
    percent: 12,
    color: '#94a3b8'
  }
]


function formatCurrency(value) {
  return new Intl.NumberFormat(
    'en-IN',
    {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }
  ).format(value)
}


function budgetPercent(budget) {
  return Math.round(
    (budget.spent / budget.limit) * 100
  )
}


function handleAddTransaction(transaction) {

  finance.addTransaction(transaction)

  showTransactionModal.value = false
}
</script>


<style scoped>
/* =========================================================
   DASHBOARD
========================================================= */

.dashboard {
  width: 100%;
  max-width: 1180px;

  min-width: 0;

  margin: 0 auto;

  padding: 34px 30px 50px;
}


/* =========================================================
   WELCOME
========================================================= */

.welcome {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 24px;

  width: 100%;
  min-width: 0;

  margin-bottom: 26px;
}

.welcome-content {
  min-width: 0;
}

.welcome-eyebrow,
.card-eyebrow {
  margin-bottom: 6px;

  color: var(--accent);

  font-size: 0.67rem;
  font-weight: 800;

  letter-spacing: 0.12em;
}

.welcome h1 {
  max-width: 100%;
  min-width: 0;

  color: var(--app-text);

  font-size: clamp(
    1.8rem,
    4vw,
    2.45rem
  );

  line-height: 1.15;

  font-weight: 850;

  letter-spacing: -0.04em;

  overflow-wrap: break-word;
}

.welcome h1 span {
  font-size: 0.8em;
}

.welcome-subtitle {
  margin-top: 7px;

  color: var(--app-text-muted);

  font-size: 0.86rem;
}

.add-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  flex-shrink: 0;

  min-height: 45px;

  padding: 0 17px;

  border: 0;
  border-radius: 12px;

  background:
    linear-gradient(
      135deg,
      #6366f1,
      #7c3aed
    );

  color: white;

  font-size: 0.86rem;
  font-weight: 750;

  box-shadow:
    0 8px 22px
    rgba(99, 102, 241, 0.24);

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.add-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 12px 28px
    rgba(99, 102, 241, 0.3);
}


/* =========================================================
   BALANCE
========================================================= */

.balance-card {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  min-width: 0;

  min-height: 230px;

  padding: 34px;

  margin-bottom: 20px;

  overflow: hidden;
}

.balance-card::before {
  content: '';

  position: absolute;

  width: 320px;
  height: 320px;

  right: -100px;
  top: -160px;

  border-radius: 50%;

  background:
    rgba(99, 102, 241, 0.12);

  filter: blur(10px);

  pointer-events: none;
}

.balance-main {
  position: relative;
  z-index: 1;

  min-width: 0;
}

.balance-label {
  display: flex;
  align-items: center;

  gap: 7px;

  color: var(--app-text-muted);

  font-size: 0.85rem;
  font-weight: 700;
}

.balance-value {
  margin-top: 12px;

  color: var(--app-text);

  font-size: clamp(
    2.2rem,
    5vw,
    3.4rem
  );

  line-height: 1;

  font-weight: 850;

  letter-spacing: -0.05em;

  white-space: nowrap;
}

.balance-change {
  display: inline-flex;
  align-items: center;

  gap: 5px;

  margin-top: 15px;

  font-size: 0.8rem;
  font-weight: 750;
}

.balance-change span {
  margin-left: 3px;

  color: var(--app-text-muted);

  font-weight: 500;
}

.positive {
  color: var(--success);
}

.balance-chart {
  display: flex;
  align-items: flex-end;

  gap: 6px;

  width: 45%;
  height: 110px;

  opacity: 0.8;
}

.chart-bar {
  flex: 1;

  min-width: 5px;

  border-radius: 6px 6px 2px 2px;

  background:
    linear-gradient(
      to top,
      rgba(99, 102, 241, 0.15),
      rgba(99, 102, 241, 0.9)
    );
}


/* =========================================================
   STATS
========================================================= */

.stats-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 18px;

  width: 100%;
  min-width: 0;

  margin-bottom: 20px;
}

.stat-card {
  width: 100%;
  min-width: 0;

  padding: 21px;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 39px;
  height: 39px;

  border-radius: 11px;
}

.stat-icon.income {
  background: rgba(16, 185, 129, 0.12);
  color: var(--success);
}

.stat-icon.expense {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.stat-icon.savings {
  background: rgba(99, 102, 241, 0.11);
  color: var(--accent);
}

.stat-badge {
  padding: 5px 8px;

  border-radius: 8px;

  font-size: 0.7rem;
  font-weight: 800;
}

.stat-badge.positive {
  background: rgba(16, 185, 129, 0.1);
}

.stat-badge.negative {
  background: rgba(239, 68, 68, 0.1);

  color: var(--danger);
}

.stat-badge.neutral {
  background: rgba(99, 102, 241, 0.1);

  color: var(--accent);
}

.stat-label {
  margin-top: 17px;

  color: var(--app-text-muted);

  font-size: 0.8rem;
  font-weight: 600;
}

.stat-card h2 {
  margin-top: 5px;

  color: var(--app-text);

  font-size: 1.55rem;
  font-weight: 850;

  letter-spacing: -0.03em;

  white-space: nowrap;
}

.stat-note {
  margin-top: 3px;

  color: var(--app-text-muted);

  font-size: 0.73rem;
}


/* =========================================================
   ANALYTICS
========================================================= */

.analytics-grid {
  display: grid;

  grid-template-columns:
    minmax(0, 1.1fr)
    minmax(0, 0.9fr);

  gap: 20px;

  width: 100%;
  min-width: 0;

  margin-bottom: 20px;
}

.analytics-card,
.transactions-card,
.goal-card {
  width: 100%;
  min-width: 0;

  padding: 23px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 15px;

  min-width: 0;

  margin-bottom: 24px;
}

.card-header > div {
  min-width: 0;
}

.card-header h3 {
  color: var(--app-text);

  font-size: 1.05rem;
  font-weight: 800;
}

.period-button,
.view-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 5px;

  flex-shrink: 0;

  border: 1px solid var(--glass-border);
  border-radius: 9px;

  background: var(--glass-bg);
  color: var(--app-text-muted);

  padding: 7px 10px;

  font-size: 0.7rem;
  font-weight: 700;

  cursor: pointer;
}

.header-icon {
  flex-shrink: 0;

  color: var(--accent);
}


/* =========================================================
   SPENDING
========================================================= */

.spending-content {
  display: flex;
  align-items: center;

  gap: 35px;

  min-width: 0;
}

.donut-wrapper {
  flex-shrink: 0;
}

.donut {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 165px;
  height: 165px;

  border-radius: 50%;

  background:
    conic-gradient(
      #6366f1 0deg 126deg,
      #06b6d4 126deg 198deg,
      #8b5cf6 198deg 263deg,
      #f59e0b 263deg 317deg,
      #94a3b8 317deg 360deg
    );
}

.donut-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  width: 112px;
  height: 112px;

  border-radius: 50%;

  background: var(--app-bg);
}

.donut-center strong {
  color: var(--app-text);

  font-size: 1rem;
  font-weight: 850;
}

.donut-center span {
  margin-top: 2px;

  color: var(--app-text-muted);

  font-size: 0.68rem;
}

.legend {
  flex: 1;

  min-width: 0;
}

.legend-item {
  display: grid;

  grid-template-columns:
    10px
    minmax(0, 1fr)
    auto;

  align-items: center;

  gap: 8px;

  margin-bottom: 12px;
}

.legend-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;
}

.legend-name {
  overflow: hidden;

  color: var(--app-text-muted);

  font-size: 0.78rem;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.legend-item strong {
  color: var(--app-text);

  font-size: 0.78rem;
}


/* =========================================================
   BUDGET
========================================================= */

.budget-list {
  width: 100%;
  min-width: 0;
}

.budget-item {
  width: 100%;

  margin-bottom: 21px;
}

.budget-item:last-child {
  margin-bottom: 0;
}

.budget-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 8px;
}

.budget-top > div {
  display: flex;
  flex-direction: column;

  min-width: 0;

  gap: 3px;
}

.budget-top span {
  color: var(--app-text);

  font-size: 0.8rem;
  font-weight: 700;
}

.budget-top small {
  color: var(--app-text-muted);

  font-size: 0.68rem;
}

.budget-top strong {
  flex-shrink: 0;

  color: var(--app-text);

  font-size: 0.75rem;
}

.progress-track {
  width: 100%;
  height: 7px;

  overflow: hidden;

  border-radius: 10px;

  background: rgba(148, 163, 184, 0.13);
}

.progress-fill {
  height: 100%;

  border-radius: inherit;

  background:
    linear-gradient(
      90deg,
      #6366f1,
      #8b5cf6
    );

  transition: width 0.4s ease;
}

.progress-fill.exceeded {
  background: var(--danger);
}


/* =========================================================
   BOTTOM
========================================================= */

.bottom-grid {
  display: grid;

  grid-template-columns:
    minmax(0, 1.1fr)
    minmax(0, 0.9fr);

  gap: 20px;

  width: 100%;
  min-width: 0;
}

.transaction-list {
  width: 100%;
  min-width: 0;
}

.transaction-row {
  display: flex;
  align-items: center;

  width: 100%;
  min-width: 0;

  gap: 12px;

  padding: 13px 0;

  border-bottom: 1px solid var(--glass-border);
}

.transaction-row:last-child {
  border-bottom: 0;
}

.transaction-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 38px;
  height: 38px;

  border-radius: 11px;
}

.transaction-icon.income {
  background: rgba(16, 185, 129, 0.1);

  color: var(--success);
}

.transaction-icon.expense {
  background: rgba(99, 102, 241, 0.1);

  color: var(--accent);
}

.transaction-info {
  flex: 1;

  min-width: 0;
}

.transaction-info strong {
  display: block;

  overflow: hidden;

  color: var(--app-text);

  font-size: 0.8rem;
  font-weight: 750;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-info span {
  display: block;

  margin-top: 3px;

  overflow: hidden;

  color: var(--app-text-muted);

  font-size: 0.68rem;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-amount {
  flex-shrink: 0;

  color: var(--app-text);

  font-size: 0.8rem;
  font-weight: 800;

  white-space: nowrap;
}

.transaction-amount.income {
  color: var(--success);
}


/* =========================================================
   GOAL
========================================================= */

.goal-visual {
  display: flex;
  align-items: center;

  gap: 24px;

  min-width: 0;

  margin: 12px 0 22px;
}

.goal-ring {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 135px;
  height: 135px;

  border-radius: 50%;

  background:
    conic-gradient(
      var(--accent)
      var(--progress),
      rgba(148, 163, 184, 0.13) 0
    );
}

.goal-ring > div {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  width: 96px;
  height: 96px;

  border-radius: 50%;

  background: var(--app-bg);
}

.goal-ring strong {
  color: var(--app-text);

  font-size: 1.3rem;
  font-weight: 850;
}

.goal-ring span {
  margin-top: 2px;

  color: var(--app-text-muted);

  font-size: 0.62rem;
}

.goal-details {
  display: flex;
  flex-direction: column;

  min-width: 0;
}

.goal-details strong {
  color: var(--app-text);

  font-size: 1rem;
}

.goal-details p {
  margin-top: 6px;

  color: var(--app-text-muted);

  font-size: 0.72rem;
}

.goal-details > span {
  margin-top: 10px;

  color: var(--accent);

  font-size: 0.72rem;
  font-weight: 750;
}

.goal-button {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  min-width: 0;

  min-height: 42px;

  padding: 0 13px;

  border: 1px solid var(--glass-border);
  border-radius: 10px;

  background: var(--glass-bg);
  color: var(--app-text);

  font-size: 0.75rem;
  font-weight: 700;

  cursor: pointer;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1000px) {

  .dashboard {
    max-width: 900px;

    padding-left: 22px;
    padding-right: 22px;
  }

  .analytics-grid,
  .bottom-grid {
    grid-template-columns:
      minmax(0, 1fr);
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 900px) {

  .dashboard {
    width: 100%;
    max-width: none;

    padding: 24px 20px 40px;
  }

  .welcome {
    align-items: stretch;
    flex-direction: column;

    gap: 15px;

    margin-bottom: 18px;
  }

  .welcome-content {
    width: 100%;
  }

  .welcome h1 {
    font-size: 1.85rem;

    line-height: 1.18;

    white-space: normal;

    overflow-wrap: break-word;
  }

  .welcome-subtitle {
    font-size: 0.78rem;

    line-height: 1.5;
  }

  .add-button {
    width: 100%;

    min-height: 46px;
  }


  /* Balance */

  .balance-card {
    display: block;

    width: 100%;

    min-height: 175px;

    padding: 22px;

    margin-bottom: 14px;
  }

  .balance-chart {
    display: none;
  }

  .balance-value {
    font-size: 2.2rem;
  }


  /* Stats */

  .stats-grid {
    grid-template-columns:
      minmax(0, 1fr);

    gap: 14px;

    margin-bottom: 14px;
  }

  .stat-card {
    width: 100%;

    padding: 19px;
  }


  /* Analytics */

  .analytics-grid,
  .bottom-grid {
    grid-template-columns:
      minmax(0, 1fr);

    gap: 14px;

    margin-bottom: 14px;
  }

  .analytics-card,
  .transactions-card,
  .goal-card {
    width: 100%;

    padding: 19px;
  }


  /* Spending */

  .spending-content {
    flex-direction: column;

    align-items: center;

    gap: 22px;
  }

  .legend {
    width: 100%;
  }


  /* Transactions */

  .transaction-row {
    gap: 10px;
  }

  .transaction-info {
    min-width: 0;
  }


  /* Goal */

  .goal-visual {
    gap: 18px;
  }

}


/* =========================================================
   SMALL PHONE
========================================================= */

@media (max-width: 430px) {

  .dashboard {
    width: 100%;

    padding: 18px 14px 30px;
  }

  .welcome h1 {
    font-size: 1.65rem;

    line-height: 1.2;
  }

  .welcome-subtitle {
    font-size: 0.74rem;
  }

  .add-button {
    min-height: 44px;

    font-size: 0.78rem;
  }


  .balance-card {
    min-height: 170px;

    padding: 20px;

    border-radius: 18px;
  }

  .balance-label {
    font-size: 0.76rem;
  }

  .balance-value {
    font-size: 2rem;
  }

  .balance-change {
    font-size: 0.7rem;
  }


  .stat-card,
  .analytics-card,
  .transactions-card,
  .goal-card {
    padding: 17px;

    border-radius: 17px;
  }

  .stat-card h2 {
    font-size: 1.3rem;
  }


  .card-header {
    margin-bottom: 19px;
  }

  .card-header h3 {
    font-size: 0.92rem;
  }


  .donut {
    width: 135px;
    height: 135px;
  }

  .donut-center {
    width: 91px;
    height: 91px;
  }

  .donut-center strong {
    font-size: 0.85rem;
  }


  .goal-visual {
    align-items: center;
    flex-direction: column;

    gap: 16px;
  }

  .goal-ring {
    width: 125px;
    height: 125px;
  }

  .goal-details {
    width: 100%;
  }


  .transaction-row {
    padding: 11px 0;
  }

  .transaction-icon {
    width: 35px;
    height: 35px;
  }

  .transaction-info strong {
    font-size: 0.74rem;
  }

  .transaction-info span {
    font-size: 0.61rem;
  }

  .transaction-amount {
    font-size: 0.68rem;
  }

}


/* =========================================================
   VERY SMALL PHONE
========================================================= */

@media (max-width: 360px) {

  .dashboard {
    padding-left: 11px;
    padding-right: 11px;
  }

  .welcome h1 {
    font-size: 1.5rem;
  }

  .balance-value {
    font-size: 1.8rem;
  }

  .transaction-info strong {
    max-width: 130px;
  }

}
</style>