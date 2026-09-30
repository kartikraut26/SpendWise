<template>
  <div class="module-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">INSIGHTS</p>
        <h1>Reports & Analytics</h1>
        <p>Turn your financial activity into clear, useful insights.</p>
      </div>

      <div class="period-control">
        <span>Report period</span>
        <select v-model.number="months" @change="load" aria-label="Report period">
          <option :value="1">Last 1 month</option>
          <option :value="3">Last 3 months</option>
          <option :value="6">Last 6 months</option>
          <option :value="12">Last 12 months</option>
        </select>
      </div>
    </section>

    <p v-if="error" class="error">{{ error }}</p>

    <!-- SUMMARY -->
    <section class="summary">
      <article class="glass-surface stat income-card">
        <div class="stat-icon">↗</div>
        <div>
          <span>Total income</span>
          <strong class="income">{{ money(report.totals.income) }}</strong>
          <small>Across the selected period</small>
        </div>
      </article>

      <article class="glass-surface stat expense-card">
        <div class="stat-icon">↘</div>
        <div>
          <span>Total expenses</span>
          <strong class="expense">{{ money(report.totals.expense) }}</strong>
          <small>Across the selected period</small>
        </div>
      </article>

      <article class="glass-surface stat">
        <div class="stat-icon">₹</div>
        <div>
          <span>Net savings</span>
          <strong :class="netSavings >= 0 ? 'income' : 'expense'">{{ signedMoney(netSavings) }}</strong>
          <small>{{ savingsRate.toFixed(1) }}% savings rate</small>
        </div>
      </article>

      <article class="glass-surface stat">
        <div class="stat-icon">◔</div>
        <div>
          <span>Average monthly expense</span>
          <strong>{{ money(averageMonthlyExpense) }}</strong>
          <small>Based on {{ report.monthly.length || 0 }} reported month{{ report.monthly.length === 1 ? '' : 's' }}</small>
        </div>
      </article>
    </section>

    <!-- INSIGHT STRIP -->
    <section class="insight-grid">
      <article class="glass-surface insight-card">
        <span class="insight-label">TOP SPENDING CATEGORY</span>
        <strong>{{ topCategory?.name || 'No data' }}</strong>
        <small v-if="topCategory">{{ money(topCategory.amount) }} · {{ topCategory.percent }}% of expenses</small>
        <small v-else>No expense category recorded.</small>
      </article>

      <article class="glass-surface insight-card">
        <span class="insight-label">MONTHLY AVERAGE INCOME</span>
        <strong>{{ money(averageMonthlyIncome) }}</strong>
        <small>Average across reported months</small>
      </article>

      <article class="glass-surface insight-card">
        <span class="insight-label">INVESTMENT PORTFOLIO</span>
        <strong>{{ money(investmentTotalCurrent) }}</strong>
        <small :class="investmentTotalPL >= 0 ? 'positive-text' : 'negative-text'">
          {{ signedMoney(investmentTotalPL) }} current P/L
        </small>
      </article>
    </section>

    <!-- SPENDING + CASH FLOW -->
    <section class="grid">
      <article class="glass-surface panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">SPENDING</p>
            <h2>Where your money goes</h2>
            <p class="panel-note">Expense distribution by category.</p>
          </div>
          <span class="count-badge">{{ report.category.length }} categories</span>
        </div>

        <div v-if="!report.category.length" class="empty">No expense data for this period.</div>

        <div v-else class="bars">
          <div v-for="item in report.category" :key="item.name" class="bar-row">
            <div class="bar-label">
              <span>{{ item.name }}</span>
              <strong>{{ money(item.amount) }} <em>{{ item.percent }}%</em></strong>
            </div>
            <div class="track">
              <div class="fill" :style="{ width: `${Math.max(Number(item.percent) || 0, 2)}%` }"></div>
            </div>
          </div>
        </div>
      </article>

      <article class="glass-surface panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">CASH FLOW</p>
            <h2>Income vs expenses</h2>
            <p class="panel-note">Monthly movement across the selected period.</p>
          </div>
        </div>

        <div v-if="!report.monthly.length" class="empty">No transaction data for this period.</div>

        <div v-else class="chart-shell">
          <div class="chart-scale">
            <span>{{ money(chartMax) }}</span>
            <span>₹0</span>
          </div>
          <div class="chart">
            <div v-for="item in report.monthly" :key="item.month" class="month">
              <div class="columns">
                <div
                  class="column income-col"
                  :title="`Income: ${money(item.income)}`"
                  :style="{ height: `${scale(item.income)}%` }"
                ></div>
                <div
                  class="column expense-col"
                  :title="`Expense: ${money(item.expense)}`"
                  :style="{ height: `${scale(item.expense)}%` }"
                ></div>
              </div>
              <small>{{ label(item.month) }}</small>
            </div>
          </div>
        </div>

        <div class="legend">
          <span><i class="income-dot"></i>Income</span>
          <span><i class="expense-dot"></i>Expenses</span>
        </div>
      </article>
    </section>

    <!-- INVESTMENTS -->
    <section class="glass-surface panel investment-performance">
      <div class="investment-head">
        <div>
          <p class="eyebrow">PORTFOLIO</p>
          <h2>Investment overview</h2>
          <p class="panel-note">
            Investments purchased in each month, with their current portfolio value and current P/L.
          </p>
        </div>

        <div class="investment-summary-mini">
          <div>
            <span>Invested</span>
            <strong>{{ money(investmentTotalInvested) }}</strong>
          </div>
          <div>
            <span>Current</span>
            <strong>{{ money(investmentTotalCurrent) }}</strong>
          </div>
          <div :class="investmentTotalPL >= 0 ? 'positive-text' : 'negative-text'">
            <span>P/L</span>
            <strong>{{ signedMoney(investmentTotalPL) }}</strong>
          </div>
        </div>
      </div>

      <div v-if="!investmentPL.length" class="empty">No investment data for this period.</div>

      <div v-else class="investment-chart-wrap">
        <div class="investment-chart">
          <div v-for="item in investmentPL" :key="item.month" class="investment-month">
            <div class="investment-values">
              <strong>{{ money(item.invested) }}</strong>
              <span :class="item.profitLoss >= 0 ? 'positive-text' : 'negative-text'">
                {{ signedMoney(item.profitLoss) }} current P/L
              </span>
            </div>

            <div class="investment-bars">
              <div class="investment-bar-wrap">
                <div
                  class="investment-bar invested-bar"
                  :style="{ height: `${investmentScale(item.invested)}%` }"
                  :title="`Invested: ${money(item.invested)}`"
                ></div>
              </div>
              <div class="investment-bar-wrap">
                <div
                  class="investment-bar"
                  :class="item.profitLoss >= 0 ? 'profit-bar' : 'loss-bar'"
                  :style="{ height: `${plScale(item.profitLoss)}%` }"
                  :title="`Current P/L: ${signedMoney(item.profitLoss)}`"
                ></div>
              </div>
            </div>
            <small>{{ label(item.month) }}</small>
          </div>
        </div>
      </div>

      <div class="investment-legend">
        <span><i class="invested-dot"></i>Invested</span>
        <span><i class="profit-dot"></i>Current profit</span>
        <span><i class="loss-dot"></i>Current loss</span>
      </div>
    </section>

    <!-- MONTHLY BREAKDOWN -->
    <section class="glass-surface panel monthly">
      <div class="panel-head">
        <div>
          <p class="eyebrow">MONTHLY BREAKDOWN</p>
          <h2>Financial performance by month</h2>
          <p class="panel-note">Compare income, expenses and the amount left after expenses.</p>
        </div>
      </div>

      <div v-if="!report.monthly.length" class="empty">No monthly data available.</div>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Net savings</th>
              <th>Savings rate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in [...report.monthly].reverse()" :key="item.month">
              <td><strong>{{ label(item.month) }}</strong></td>
              <td class="income">{{ money(item.income) }}</td>
              <td class="expense">{{ money(item.expense) }}</td>
              <td :class="item.balance >= 0 ? 'income' : 'expense'">{{ signedMoney(item.balance) }}</td>
              <td>
                <span class="rate-pill" :class="monthlySavingsRate(item) >= 0 ? 'rate-positive' : 'rate-negative'">
                  {{ monthlySavingsRate(item).toFixed(1) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useFinanceStore } from '../stores/finance'
import api from '../services/api'

const finance = useFinanceStore()
const months = ref(6)
const error = ref('')

const report = reactive({
  category: [],
  monthly: [],
  totals: { income: 0, expense: 0 }
})

function money(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value) || 0)
}

function signedMoney(value) {
  const amount = Number(value) || 0
  return `${amount >= 0 ? '+' : '-'}${money(Math.abs(amount))}`
}

function label(month) {
  const [year, monthNumber] = String(month).split('-')
  return new Date(Number(year), Number(monthNumber) - 1, 1).toLocaleDateString('en-IN', {
    month: 'short',
    year: '2-digit'
  })
}

const netSavings = computed(() =>
  Number(report.totals.income || 0) - Number(report.totals.expense || 0)
)

const savingsRate = computed(() => {
  const income = Number(report.totals.income || 0)
  return income > 0 ? (netSavings.value / income) * 100 : 0
})

const averageMonthlyIncome = computed(() => {
  if (!report.monthly.length) return 0
  return report.monthly.reduce((sum, item) => sum + Number(item.income || 0), 0) / report.monthly.length
})

const averageMonthlyExpense = computed(() => {
  if (!report.monthly.length) return 0
  return report.monthly.reduce((sum, item) => sum + Number(item.expense || 0), 0) / report.monthly.length
})

const topCategory = computed(() => {
  if (!report.category.length) return null
  return [...report.category].sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))[0]
})

const chartMax = computed(() => {
  return Math.max(
    ...report.monthly.flatMap(item => [Number(item.income || 0), Number(item.expense || 0)]),
    1
  )
})

const investmentPL = computed(() => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - Number(months.value) + 1, 1)
  const grouped = {}

  for (const investment of finance.investments || []) {
    const date = new Date(investment.purchaseDate)
    if (Number.isNaN(date.getTime()) || date < start) continue

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!grouped[key]) {
      grouped[key] = { invested: 0, currentValue: 0, profitLoss: 0 }
    }

    const invested = Number(
      investment.investedValue ||
      (Number(investment.quantity || 0) * Number(investment.buyPrice || 0))
    )

    const currentValue = Number(
      investment.currentValue ||
      (Number(investment.quantity || 0) * Number(investment.currentPrice || 0))
    )

    grouped[key].invested += invested
    grouped[key].currentValue += currentValue
    grouped[key].profitLoss += Number(investment.profitLoss ?? (currentValue - invested))
  }

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => ({ month, ...values }))
})

const investmentTotalInvested = computed(() =>
  (finance.investments || []).reduce((sum, investment) => {
    return sum + Number(
      investment.investedValue ||
      (Number(investment.quantity || 0) * Number(investment.buyPrice || 0))
    )
  }, 0)
)

const investmentTotalCurrent = computed(() =>
  (finance.investments || []).reduce((sum, investment) => {
    return sum + Number(
      investment.currentValue ||
      (Number(investment.quantity || 0) * Number(investment.currentPrice || 0))
    )
  }, 0)
)

const investmentTotalPL = computed(() => investmentTotalCurrent.value - investmentTotalInvested.value)

function scale(value) {
  const max = chartMax.value || 1
  return Math.max(3, Math.round((Number(value) || 0) / max * 100))
}

function investmentScale(value) {
  const max = Math.max(...investmentPL.value.map(item => Number(item.invested) || 0), 1)
  return Math.max(8, Math.round((Number(value) || 0) / max * 100))
}

function plScale(value) {
  const max = Math.max(...investmentPL.value.map(item => Math.abs(Number(item.profitLoss) || 0)), 1)
  return Math.max(8, Math.round(Math.abs(Number(value) || 0) / max * 100))
}

function monthlySavingsRate(item) {
  const income = Number(item.income || 0)
  const balance = Number(item.balance ?? (Number(item.income || 0) - Number(item.expense || 0)))
  return income > 0 ? (balance / income) * 100 : 0
}

async function load() {
  error.value = ''

  try {
    const response = await api.get('/reports', {
      params: { months: months.value }
    })

    Object.assign(report, response.data.data || {
      category: [],
      monthly: [],
      totals: { income: 0, expense: 0 }
    })

    await finance.fetchInvestments()
  } catch (e) {
    error.value = e.response?.data?.message || 'Could not load reports.'
  }
}

onMounted(load)
</script>

<style scoped>
.module-page{max-width:1180px;margin:auto;padding:34px 30px 55px}.page-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:24px}.eyebrow{font-size:.67rem;font-weight:800;letter-spacing:.12em;color:var(--accent);margin-bottom:6px}h1{font-size:2rem;font-weight:850;letter-spacing:-.03em}.page-heading p:not(.eyebrow){color:var(--app-text-muted);margin-top:6px}.period-control{display:flex;flex-direction:column;gap:6px;min-width:170px}.period-control span{font-size:.68rem;font-weight:700;color:var(--app-text-muted);text-transform:uppercase;letter-spacing:.06em}.page-heading select,.investment-period{height:42px;border:1px solid var(--glass-border);border-radius:11px;background:var(--input-bg);color:var(--app-text);padding:0 12px;outline:none}.error{color:var(--danger);margin-bottom:14px;font-size:.84rem}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:14px}.stat{padding:18px;display:flex;align-items:flex-start;gap:13px;min-width:0}.stat-icon{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;background:var(--input-bg);color:var(--accent);font-weight:900;flex-shrink:0}.stat span{display:block;color:var(--app-text-muted);font-size:.72rem}.stat strong{display:block;font-size:1.3rem;margin:5px 0 3px;line-height:1.15}.stat small{display:block;color:var(--app-text-muted);font-size:.67rem}.income{color:var(--success)}.expense,.negative-text{color:var(--danger)}.positive-text{color:var(--success)}.insight-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px}.insight-card{padding:17px 19px}.insight-label{display:block;font-size:.63rem;font-weight:800;letter-spacing:.1em;color:var(--app-text-muted);margin-bottom:8px}.insight-card strong{display:block;font-size:1.05rem}.insight-card small{display:block;margin-top:5px;color:var(--app-text-muted);font-size:.7rem}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px}.panel{padding:22px}.panel-head{display:flex;justify-content:space-between;align-items:flex-start;gap:15px}.panel h2{font-size:1.06rem;font-weight:800}.panel-note{color:var(--app-text-muted);font-size:.72rem;margin-top:5px;line-height:1.45}.count-badge,.rate-pill{display:inline-flex;align-items:center;border-radius:999px;padding:5px 9px;background:var(--input-bg);color:var(--app-text-muted);font-size:.65rem;font-weight:700;white-space:nowrap}.bars{margin-top:21px;display:flex;flex-direction:column;gap:14px}.bar-label{display:flex;justify-content:space-between;gap:12px;font-size:.78rem}.bar-label strong{color:var(--app-text-muted);font-weight:650;white-space:nowrap}.bar-label em{font-style:normal;margin-left:4px;color:var(--app-text-muted)}.track{height:8px;background:var(--input-bg);border-radius:99px;margin-top:7px;overflow:hidden}.fill{height:100%;background:var(--accent);border-radius:99px}.empty{min-height:190px;display:grid;place-items:center;color:var(--app-text-muted);font-size:.78rem;text-align:center}.chart-shell{position:relative;margin-top:17px;padding-left:42px}.chart-scale{position:absolute;left:0;top:7px;bottom:30px;display:flex;flex-direction:column;justify-content:space-between;font-size:.6rem;color:var(--app-text-muted)}.chart{height:250px;display:flex;align-items:end;gap:9px;padding-top:12px;border-bottom:1px solid var(--glass-border);background:repeating-linear-gradient(to bottom,transparent 0,transparent 61px,var(--glass-border) 62px)}.month{height:100%;flex:1;min-width:30px;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:7px}.columns{height:215px;width:100%;display:flex;align-items:end;justify-content:center;gap:3px}.column{width:40%;max-width:20px;border-radius:5px 5px 0 0;min-height:3px;transition:height .25s ease}.income-col{background:var(--success)}.expense-col{background:var(--danger)}.month small{font-size:.63rem;color:var(--app-text-muted)}.legend,.investment-legend{display:flex;justify-content:center;gap:19px;margin-top:13px;font-size:.7rem;color:var(--app-text-muted)}.legend span,.investment-legend span{display:flex;align-items:center;gap:6px}.legend i,.investment-legend i{width:8px;height:8px;border-radius:50%;display:inline-block}.income-dot{background:var(--success)}.expense-dot,.loss-dot{background:var(--danger)}.investment-performance{margin-bottom:18px}.investment-head{display:flex;justify-content:space-between;align-items:flex-start;gap:20px}.investment-summary-mini{display:flex;gap:8px;flex-shrink:0}.investment-summary-mini div{min-width:90px;padding:9px 11px;border:1px solid var(--glass-border);border-radius:10px;background:var(--input-bg)}.investment-summary-mini span{display:block;font-size:.6rem;color:var(--app-text-muted)}.investment-summary-mini strong{display:block;font-size:.78rem;margin-top:3px}.investment-chart-wrap{overflow-x:auto}.investment-chart{height:285px;display:flex;align-items:end;gap:13px;margin-top:20px;padding:10px 8px 24px;border-bottom:1px solid var(--glass-border);min-width:100%;background:repeating-linear-gradient(to bottom,transparent 0,transparent 68px,var(--glass-border) 69px)}.investment-month{height:100%;min-width:82px;flex:1;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:7px}.investment-values{height:48px;text-align:center;display:flex;flex-direction:column;justify-content:end;gap:2px}.investment-values strong{font-size:.65rem}.investment-values span{font-size:.6rem;white-space:nowrap}.investment-bars{height:190px;width:100%;display:flex;align-items:end;justify-content:center;gap:5px}.investment-bar-wrap{height:100%;width:27px;display:flex;align-items:end;justify-content:center}.investment-bar{width:100%;min-height:4px;border-radius:5px 5px 0 0}.invested-bar{background:var(--accent)}.profit-bar{background:var(--success)}.loss-bar{background:var(--danger)}.investment-month small{font-size:.63rem;color:var(--app-text-muted)}.invested-dot{background:var(--accent)}.monthly{overflow:hidden}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;margin-top:16px;min-width:650px}th,td{padding:13px 10px;border-bottom:1px solid var(--glass-border);text-align:left}th{font-size:.65rem;color:var(--app-text-muted);text-transform:uppercase;letter-spacing:.05em}td{font-size:.78rem}.rate-positive{color:var(--success)}.rate-negative{color:var(--danger)}@media(max-width:1050px){.summary{grid-template-columns:repeat(2,1fr)}}@media(max-width:850px){.grid,.insight-grid{grid-template-columns:1fr}.page-heading{align-items:flex-start;flex-direction:column}.period-control{width:100%}.period-control select{width:100%}.investment-head{flex-direction:column}.investment-summary-mini{width:100%}.investment-summary-mini div{flex:1}.chart{gap:6px}}@media(max-width:600px){.module-page{padding:26px 16px 45px}h1{font-size:1.75rem}.summary{grid-template-columns:1fr}.stat{padding:16px}.panel{padding:18px}.investment-summary-mini{display:grid;grid-template-columns:1fr 1fr}.investment-summary-mini div:last-child{grid-column:1/-1}.chart-shell{padding-left:0}.chart-scale{display:none}.chart{gap:5px;height:220px}.columns{height:190px}.column{max-width:15px}.investment-chart{justify-content:flex-start}.investment-month{flex:0 0 82px}.bar-label{align-items:flex-end}.bar-label strong{font-size:.7rem}}
</style>
