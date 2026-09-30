<template>
  <div class="module-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">PORTFOLIO</p>
        <h1>Investments</h1>
        <p>Track your stock investments and portfolio performance.</p>
      </div>

      <button class="primary" @click="openCreate">
        <Plus :size="18" /> Add investment
      </button>
    </section>

    <section v-if="!loading && investments.length" class="filter-bar glass-surface">
      <div class="filter-info">
        <span class="filter-label">Investment Month</span>
        <small>Filter investments by purchase month.</small>
      </div>

      <select v-model="selectedMonth" class="month-filter" aria-label="Filter investments by month">
        <option value="all">All Months</option>
        <option
          v-for="month in availableMonths"
          :key="month.value"
          :value="month.value"
        >
          {{ month.label }}
        </option>
      </select>
    </section>

    <section class="summary">
      <div class="glass-surface stat">
        <span>Total Invested</span>
        <strong>{{ money(filteredSummary.totalInvested) }}</strong>
        <small>capital invested</small>
      </div>

      <div class="glass-surface stat">
        <span>Current Value</span>
        <strong>{{ money(filteredSummary.currentValue) }}</strong>
        <small>based on stored current prices</small>
      </div>

      <div
        class="glass-surface stat"
        :class="
          filteredSummary.totalProfitLoss >= 0
            ? 'positive'
            : 'negative'
        "
      >
        <span>Total P/L</span>
        <strong>
          {{ signedMoney(filteredSummary.totalProfitLoss) }}
        </strong>
        <small>overall portfolio gain/loss</small>
      </div>

      <div
        class="glass-surface stat"
        :class="
          filteredSummary.profitLossPercentage >= 0
            ? 'positive'
            : 'negative'
        "
      >
        <span>P/L %</span>
        <strong>
          {{ signedPercent(filteredSummary.profitLossPercentage) }}
        </strong>
        <small>return on invested value</small>
      </div>
    </section>

    <p v-if="error" class="error">
      {{ error }}
    </p>

    <section
      v-if="!loading && !investments.length"
      class="glass-surface empty"
    >
      <TrendingUp :size="34" />

      <strong>No investments yet</strong>

      <span>
        Add your first stock investment to start tracking
        your portfolio.
      </span>

      <button
        class="primary empty-button"
        @click="openCreate"
      >
        <Plus :size="17" /> Add investment
      </button>
    </section>

    <section
      v-else
      class="table-card glass-surface"
    >
      <div v-if="loading" class="empty">
        Loading investments…
      </div>

      <div v-else-if="!filteredInvestments.length" class="empty filtered-empty">
        <TrendingUp :size="28" />
        <strong>No investments for {{ selectedMonthLabel }}</strong>
        <span>Choose another month or select All Months.</span>
      </div>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Investment</th>
              <th>Exchange</th>
              <th>Quantity</th>
              <th>Buy Price</th>
              <th>Current Price</th>
              <th>Invested</th>
              <th>Current Value</th>
              <th>P/L</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="investment in filteredInvestments"
              :key="investment._id"
            >
              <td>
                <div class="investment-name">
                  <strong>
                    {{ investment.companyName }}
                  </strong>

                  <span>
                    {{ investment.symbol }} ·
                    {{ formatDate(investment.purchaseDate) }}
                  </span>
                </div>
              </td>

              <td>
                {{ investment.exchange }}
              </td>

              <td>
                {{ quantity(investment.quantity) }}
              </td>

              <td>
                {{ money(investment.buyPrice) }}
              </td>

              <td>
                {{ money(investment.currentPrice) }}
              </td>

              <td>
                {{ money(investment.investedValue) }}
              </td>

              <td>
                {{ money(investment.currentValue) }}
              </td>

              <td
                :class="
                  investment.profitLoss >= 0
                    ? 'positive-text'
                    : 'negative-text'
                "
              >
                <strong>
                  {{ signedMoney(investment.profitLoss) }}
                </strong>

                <small>
                  {{
                    signedPercent(
                      investment.profitLossPercentage
                    )
                  }}
                </small>
              </td>

              <td class="actions">
                <button
                  @click="edit(investment)"
                  aria-label="Edit investment"
                >
                  <Pencil :size="16" />
                </button>

                <button
                  class="danger"
                  @click="remove(investment)"
                  aria-label="Delete investment"
                >
                  <Trash2 :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- MOBILE LIST -->
    <section
      v-if="!loading && filteredInvestments.length"
      class="mobile-list"
    >
      <article
        v-for="investment in filteredInvestments"
        :key="investment._id"
        class="glass-surface investment-card"
      >
        <div class="card-head">
          <div class="investment-name">
            <strong>
              {{ investment.companyName }}
            </strong>

            <span>
              {{ investment.symbol }} ·
              {{ investment.exchange }}
            </span>
          </div>

          <div class="card-actions">
            <button @click="edit(investment)">
              <Pencil :size="16" />
            </button>

            <button
              class="danger"
              @click="remove(investment)"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>

        <div class="detail-grid">
          <div>
            <span>Quantity</span>
            <strong>
              {{ quantity(investment.quantity) }}
            </strong>
          </div>

          <div>
            <span>Buy Price</span>
            <strong>
              {{ money(investment.buyPrice) }}
            </strong>
          </div>

          <div>
            <span>Current Price</span>
            <strong>
              {{ money(investment.currentPrice) }}
            </strong>
          </div>

          <div>
            <span>Purchase Date</span>
            <strong>
              {{ formatDate(investment.purchaseDate) }}
            </strong>
          </div>

          <div>
            <span>Invested Value</span>
            <strong>
              {{ money(investment.investedValue) }}
            </strong>
          </div>

          <div>
            <span>Current Value</span>
            <strong>
              {{ money(investment.currentValue) }}
            </strong>
          </div>
        </div>

        <div
          class="card-performance"
          :class="
            investment.profitLoss >= 0
              ? 'positive'
              : 'negative'
          "
        >
          <span>Profit / Loss</span>

          <strong>
            {{ signedMoney(investment.profitLoss) }}
            ({{
              signedPercent(
                investment.profitLossPercentage
              )
            }})
          </strong>
        </div>
      </article>
    </section>

    <!-- STOCK CHARTS -->
    <section
      v-if="!loading && filteredInvestments.length"
      class="history-section"
    >
      <div class="section-heading">
        <div>
          <p class="eyebrow">PRICE HISTORY</p>

          <h2>Stock Performance</h2>

          <p>
            Five stored historical prices plus the current
            price for each investment.
          </p>
        </div>
      </div>

      <div class="chart-grid">
        <article
          v-for="investment in filteredInvestments"
          :key="`chart-${investment._id}`"
          class="glass-surface chart-card"
        >
          <div class="chart-head">
            <div>
              <strong>
                {{ investment.companyName }}
              </strong>

              <span>
                {{ investment.symbol }} ·
                {{ investment.exchange }}
              </span>
            </div>

            <div class="chart-current">
              <span>Current</span>

              <strong>
                {{ money(investment.currentPrice) }}
              </strong>
            </div>
          </div>

          <div
            v-if="
              chartData(investment).points.length >= 2
            "
            class="chart-wrap"
          >
            <svg
              viewBox="0 0 360 190"
              preserveAspectRatio="none"
              role="img"
              :aria-label="
                `${investment.companyName} price history chart`
              "
            >
              <line
                x1="18"
                y1="24"
                x2="342"
                y2="24"
                class="grid-line"
              />

              <line
                x1="18"
                y1="95"
                x2="342"
                y2="95"
                class="grid-line"
              />

              <line
                x1="18"
                y1="166"
                x2="342"
                y2="166"
                class="grid-line"
              />

              <path
                :d="
                  chartData(investment).areaPath
                "
                class="chart-area"
              />

              <path
                :d="chartData(investment).path"
                class="chart-line"
              />

              <circle
                v-for="point in chartData(investment).points"
                :key="
                  `${investment._id}-${point.date}-${point.price}`
                "
                :cx="point.x"
                :cy="point.y"
                r="4"
                class="chart-dot"
              />
            </svg>

            <div class="chart-axis">
              <span>
                {{
                  formatDate(
                    chartData(investment).points[0].date
                  )
                }}
              </span>

              <span>
                {{
                  formatDate(
                    chartData(investment).points[
                      chartData(investment).points.length - 1
                    ].date
                  )
                }}
              </span>
            </div>
          </div>

          <div
            v-else
            class="no-history"
          >
            <TrendingUp :size="20" />

            <span>
              Add five historical prices to display the
              stock chart.
            </span>
          </div>
        </article>
      </div>
    </section>

    <!-- ADD / EDIT MODAL -->
    <div
      v-if="modalOpen"
      class="backdrop"
      @click.self="close"
    >
      <form
        class="modal glass-surface"
        @submit.prevent="save"
      >
        <div class="modal-head">
          <div>
            <p class="eyebrow">
              {{ editing ? 'EDIT' : 'NEW' }}
            </p>

            <h2>
              {{
                editing
                  ? 'Edit investment'
                  : 'Add investment'
              }}
            </h2>
          </div>

          <button
            type="button"
            @click="close"
          >
            <X />
          </button>
        </div>

        <div class="grid">
          <label>
            Company / Stock Name

            <input
              v-model="form.companyName"
              maxlength="120"
              placeholder="e.g. Reliance Industries"
              required
            >
          </label>

          <label>
            Symbol

            <input
              v-model="form.symbol"
              maxlength="30"
              placeholder="e.g. RELIANCE"
              required
            >
          </label>
        </div>

        <div class="grid">
          <label>
            Exchange

            <select
              v-model="form.exchange"
              required
            >
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
              <option value="NASDAQ">NASDAQ</option>
              <option value="NYSE">NYSE</option>
              <option value="OTHER">Other</option>
            </select>
          </label>

          <label>
            Quantity

            <input
              v-model.number="form.quantity"
              type="number"
              min="0.000001"
              step="any"
              required
            >
          </label>
        </div>

        <div class="grid">
          <label>
            Buy Price

            <input
              v-model.number="form.buyPrice"
              type="number"
              min="0.01"
              step="0.01"
              required
            >
          </label>

          <label>
            Current Price

            <input
              v-model.number="form.currentPrice"
              type="number"
              min="0"
              step="0.01"
              required
            >
          </label>
        </div>

        <label>
          Purchase Date

          <input
            v-model="form.purchaseDate"
            type="date"
            required
          >
        </label>

        <!-- HISTORICAL PRICES -->
        <div class="history-form">
          <div class="history-form-head">
            <div>
              <strong>
                Past 5 Price Values
              </strong>

              <span>
                Enter five historical prices for the
                selected period.
              </span>
            </div>

            <select
              v-model="form.historyPeriod"
              @change="applyHistoryPeriod"
              aria-label="Historical period"
            >
              <option
                v-for="period in HISTORY_PERIODS"
                :key="period.value"
                :value="period.value"
              >
                {{ period.label }}
              </option>
            </select>
          </div>

          <div class="history-note">
            The current price is stored separately and
            appears as the latest point on the chart.
          </div>

          <div class="history-grid">
            <div
              v-for="(point, index) in form.priceHistory"
              :key="index"
              class="history-row"
            >
              <span class="history-index">
                {{ index + 1 }}
              </span>

              <label>
                Date

                <input
                  v-model="point.date"
                  type="date"
                  :max="yesterday()"
                  required
                >
              </label>

              <label>
                Price

                <input
                  v-model.number="point.price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 790"
                  required
                >
              </label>
            </div>
          </div>
        </div>

        <p
          v-if="error"
          class="error"
        >
          {{ error }}
        </p>

        <div class="modal-actions">
          <button
            type="button"
            class="secondary"
            @click="close"
          >
            Cancel
          </button>

          <button
            class="primary"
            :disabled="saving"
          >
            {{
              saving
                ? 'Saving…'
                : editing
                  ? 'Save changes'
                  : 'Add investment'
            }}
          </button>
        </div>
      </form>
    </div>
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
  Plus,
  TrendingUp,
  Pencil,
  Trash2,
  X
} from 'lucide-vue-next'

import { useFinanceStore } from '../stores/finance'

const finance = useFinanceStore()

const loading = ref(false)
const saving = ref(false)
const modalOpen = ref(false)
const editing = ref(null)
const error = ref('')
const selectedMonth = ref('all')

const HISTORY_PERIODS = [
  {
    value: '1W',
    label: 'Last 1 Week',
    days: 7
  },
  {
    value: '1M',
    label: 'Last 1 Month',
    days: 30
  },
  {
    value: '3M',
    label: 'Last 3 Months',
    days: 90
  },
  {
    value: '6M',
    label: 'Last 6 Months',
    days: 180
  },
  {
    value: '1Y',
    label: 'Last 1 Year',
    days: 365
  }
]

function createHistoryRows() {
  return Array.from(
    { length: 5 },
    () => ({
      date: '',
      price: ''
    })
  )
}

const form = reactive({
  companyName: '',
  symbol: '',
  exchange: 'NSE',
  quantity: '',
  buyPrice: '',
  purchaseDate: today(),
  currentPrice: '',
  historyPeriod: '1M',
  priceHistory: createHistoryRows()
})

const investments =
  computed(() => finance.investments)

const availableMonths = computed(() => {
  const monthMap = new Map()

  finance.investments.forEach((investment) => {
    if (!investment.purchaseDate) return

    const date = new Date(investment.purchaseDate)
    if (Number.isNaN(date.getTime())) return

    const value = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`

    if (!monthMap.has(value)) {
      monthMap.set(value, {
        value,
        label: date.toLocaleDateString('en-IN', {
          month: 'long',
          year: 'numeric'
        }),
        timestamp: date.getTime()
      })
    }
  })

  return Array.from(monthMap.values())
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(({ value, label }) => ({ value, label }))
})

const filteredInvestments = computed(() => {
  if (selectedMonth.value === 'all') {
    return investments.value
  }

  return investments.value.filter((investment) => {
    if (!investment.purchaseDate) return false

    const date = new Date(investment.purchaseDate)
    if (Number.isNaN(date.getTime())) return false

    const value = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`

    return value === selectedMonth.value
  })
})

const filteredSummary = computed(() => {
  const totalInvested = filteredInvestments.value.reduce(
    (sum, investment) =>
      sum + Number(investment.investedValue || 0),
    0
  )

  const currentValue = filteredInvestments.value.reduce(
    (sum, investment) =>
      sum + Number(investment.currentValue || 0),
    0
  )

  const totalProfitLoss = currentValue - totalInvested

  const profitLossPercentage =
    totalInvested > 0
      ? (totalProfitLoss / totalInvested) * 100
      : 0

  return {
    totalInvested,
    currentValue,
    totalProfitLoss,
    profitLossPercentage
  }
})

const selectedMonthLabel = computed(() => {
  if (selectedMonth.value === 'all') {
    return 'All Months'
  }

  return (
    availableMonths.value.find(
      (month) => month.value === selectedMonth.value
    )?.label || 'selected month'
  )
})

function today() {
  return new Date()
    .toISOString()
    .slice(0, 10)
}

function yesterday() {
  const date = new Date()

  date.setDate(
    date.getDate() - 1
  )

  return date
    .toISOString()
    .slice(0, 10)
}

function money(value) {
  return new Intl.NumberFormat(
    'en-IN',
    {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }
  ).format(Number(value) || 0)
}

function signedMoney(value) {
  const amount =
    Number(value) || 0

  return `${
    amount >= 0 ? '+' : '-'
  }${money(Math.abs(amount))}`
}

function signedPercent(value) {
  const percentage =
    Number(value) || 0

  return `${
    percentage >= 0 ? '+' : ''
  }${percentage.toFixed(2)}%`
}

function quantity(value) {
  return Number(value).toLocaleString(
    'en-IN',
    {
      maximumFractionDigits: 6
    }
  )
}

function formatDate(value) {
  if (!value) return ''

  return new Date(value)
    .toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    )
}

function toDateInput(date) {
  return new Date(date)
    .toISOString()
    .slice(0, 10)
}

function addDays(date, days) {
  const result = new Date(date)

  result.setDate(
    result.getDate() + days
  )

  return result
}

function generatedHistoryDates(
  periodValue
) {
  const period =
    HISTORY_PERIODS.find(
      item =>
        item.value === periodValue
    ) ||
    HISTORY_PERIODS[1]

  const end =
    addDays(new Date(), -1)

  const start =
    addDays(
      end,
      -period.days
    )

  const step =
    period.days / 4

  return Array.from(
    { length: 5 },
    (_, index) => {
      return toDateInput(
        addDays(
          start,
          Math.round(
            step * index
          )
        )
      )
    }
  )
}

function applyHistoryPeriod() {
  const dates =
    generatedHistoryDates(
      form.historyPeriod
    )

  form.priceHistory =
    dates.map(date => ({
      date,
      price: ''
    }))
}

function loadExistingHistory(
  history
) {
  const points =
    Array.isArray(history)
      ? [...history].sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )
      : []

  const rows =
    createHistoryRows()

  points
    .slice(-5)
    .forEach(
      (point, index) => {
        rows[index] = {
          date: toDateInput(
            point.date
          ),
          price: Number(
            point.price
          )
        }
      }
    )

  form.priceHistory = rows
}

function chartData(
  investment
) {
  const history =
    Array.isArray(
      investment.priceHistory
    )
      ? [...investment.priceHistory].sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )
      : []

  const points =
    history.map(point => ({
      date: point.date,
      price:
        Number(point.price)
    }))

  points.push({
    date: today(),
    price:
      Number(
        investment.currentPrice
      ) || 0
  })

  if (points.length < 2) {
    return {
      points,
      path: '',
      areaPath: ''
    }
  }

  const width = 360
  const height = 190

  const left = 18
  const right = 18

  const top = 24
  const bottom = 166

  const chartWidth =
    width - left - right

  const chartHeight =
    bottom - top

  const values =
    points.map(
      point => point.price
    )

  const min =
    Math.min(...values)

  const max =
    Math.max(...values)

  const range =
    max - min ||
    Math.max(
      Math.abs(max) * 0.05,
      1
    )

  const paddedMin =
    min - range * 0.08

  const paddedMax =
    max + range * 0.08

  const paddedRange =
    paddedMax - paddedMin ||
    1

  const plotted =
    points.map(
      (point, index) => {
        const x =
          left +
          (chartWidth *
            index) /
            (points.length - 1)

        const y =
          bottom -
          (
            (point.price -
              paddedMin) /
            paddedRange
          ) *
            chartHeight

        return {
          ...point,
          x,
          y
        }
      }
    )

  const path =
    plotted
      .map(
        (point, index) =>
          `${
            index === 0
              ? 'M'
              : 'L'
          } ${point.x.toFixed(
            2
          )} ${point.y.toFixed(
            2
          )}`
      )
      .join(' ')

  const areaPath =
    `${path} L ${
      plotted[
        plotted.length - 1
      ].x.toFixed(2)
    } ${bottom} L ${
      plotted[0].x.toFixed(2)
    } ${bottom} Z`

  return {
    points: plotted,
    path,
    areaPath
  }
}

async function load() {
  loading.value = true
  error.value = ''

  try {
    await finance.fetchInvestments()
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      'Could not load investments.'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(form, {
    companyName: '',
    symbol: '',
    exchange: 'NSE',
    quantity: '',
    buyPrice: '',
    purchaseDate: today(),
    currentPrice: '',
    historyPeriod: '1M',
    priceHistory:
      createHistoryRows()
  })

  applyHistoryPeriod()
}

function openCreate() {
  editing.value = null
  error.value = ''

  resetForm()

  modalOpen.value = true
}

function edit(investment) {
  editing.value =
    investment._id

  error.value = ''

  Object.assign(form, {
    companyName:
      investment.companyName,

    symbol:
      investment.symbol,

    exchange:
      investment.exchange,

    quantity:
      investment.quantity,

    buyPrice:
      investment.buyPrice,

    purchaseDate:
      new Date(
        investment.purchaseDate
      )
        .toISOString()
        .slice(0, 10),

    currentPrice:
      investment.currentPrice,

    historyPeriod: '1M',

    priceHistory:
      createHistoryRows()
  })

  loadExistingHistory(
    investment.priceHistory
  )

  modalOpen.value = true
}

function close() {
  modalOpen.value = false
}

async function save() {
  saving.value = true
  error.value = ''

  const history =
    form.priceHistory.map(
      point => ({
        date: point.date,
        price: point.price
      })
    )

  const hasAnyHistoryValue =
    history.some(
      point =>
        point.date ||
        point.price !== ''
    )

  const payload = {
    ...form,

    priceHistory:
      hasAnyHistoryValue
        ? history
        : undefined
  }

  try {
    if (editing.value) {
      await finance.updateInvestment(
        editing.value,
        payload
      )
    } else {
      await finance.addInvestment(
        payload
      )
    }

    close()
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      'Could not save investment.'
  } finally {
    saving.value = false
  }
}

async function remove(
  investment
) {
  if (
    !confirm(
      `Delete "${investment.companyName}" investment?`
    )
  ) {
    return
  }

  error.value = ''

  try {
    await finance.deleteInvestment(
      investment._id
    )
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      'Could not delete investment.'
  }
}

onMounted(load)
</script>

<style scoped>
.module-page{max-width:1180px;margin:auto;padding:34px 30px 50px}.page-heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:22px}.eyebrow{font-size:.68rem;font-weight:800;letter-spacing:.1em;color:var(--accent);margin-bottom:5px}h1{font-size:2rem;font-weight:800}.page-heading p:not(.eyebrow){color:var(--app-text-muted);margin-top:6px}.primary,.secondary{border:0;border-radius:11px;min-height:44px;padding:0 16px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:700;cursor:pointer}.primary{background:var(--accent);color:#fff}.primary:disabled{opacity:.65;cursor:not-allowed}.secondary{background:var(--glass-bg);border:1px solid var(--glass-border);color:var(--app-text)}.filter-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 16px;margin-bottom:14px}.filter-info{display:flex;flex-direction:column;gap:3px}.filter-label{font-size:.8rem;font-weight:800;color:var(--app-text)}.filter-info small{font-size:.72rem;color:var(--app-text-muted)}.month-filter{height:42px;min-width:180px;border:1px solid var(--glass-border);border-radius:10px;background:var(--input-bg);color:var(--app-text);padding:0 12px;outline:0}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}.stat{padding:20px}.stat span,.stat small{display:block;color:var(--app-text-muted);font-size:.78rem}.stat strong{display:block;font-size:1.4rem;margin:6px 0}.stat.positive strong{color:var(--success)}.stat.negative strong{color:var(--danger)}.error{color:var(--danger);margin-bottom:12px;font-size:.85rem}.table-card{overflow:hidden}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse}th,td{padding:16px 14px;text-align:left;border-bottom:1px solid var(--glass-border);white-space:nowrap}th{font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:var(--app-text-muted)}td{font-size:.82rem}.investment-name{display:flex;flex-direction:column;gap:4px;min-width:160px}.investment-name span{font-size:.72rem;color:var(--app-text-muted)}td small{display:block;font-size:.7rem;margin-top:3px}.positive-text{color:var(--success)}.negative-text{color:var(--danger)}.actions{display:flex;gap:6px}.actions button,.card-actions button,.modal-head>button{border:0;background:transparent;color:var(--app-text-muted);cursor:pointer}.actions .danger,.card-actions .danger{color:var(--danger)}.empty{min-height:280px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:var(--app-text-muted)}.empty strong{color:var(--app-text)}.empty-button{margin-top:8px}.mobile-list{display:none}.history-section{margin-top:26px}.section-heading{margin-bottom:14px}.section-heading h2{font-size:1.25rem;font-weight:800}.section-heading p:not(.eyebrow){color:var(--app-text-muted);font-size:.82rem;margin-top:5px}.chart-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.chart-card{padding:18px;min-width:0}.chart-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.chart-head>div:first-child{display:flex;flex-direction:column;gap:4px}.chart-head span,.chart-current span{font-size:.72rem;color:var(--app-text-muted)}.chart-current{text-align:right;display:flex;flex-direction:column;gap:3px}.chart-current strong{font-size:.9rem}.chart-wrap{margin-top:12px}.chart-wrap svg{display:block;width:100%;height:190px;overflow:visible}.grid-line{stroke:var(--glass-border);stroke-width:1}.chart-line{fill:none;stroke:var(--accent);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.chart-area{fill:var(--accent);opacity:.1}.chart-dot{fill:var(--accent);stroke:var(--app-bg);stroke-width:2}.chart-axis{display:flex;justify-content:space-between;gap:12px;margin-top:2px;font-size:.68rem;color:var(--app-text-muted)}.no-history{min-height:190px;display:flex;align-items:center;justify-content:center;gap:8px;color:var(--app-text-muted);font-size:.78rem;text-align:center}.backdrop{position:fixed;inset:0;z-index:100;background:rgba(2,6,23,.6);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto}.modal{width:min(100%,720px);padding:26px;background:var(--modal-bg);max-height:calc(100vh - 40px);overflow:auto}.modal-head{display:flex;justify-content:space-between;margin-bottom:20px}.modal-head h2{font-size:1.4rem;font-weight:800}.modal label{display:flex;flex-direction:column;gap:7px;font-size:.8rem;font-weight:700;color:var(--app-text-muted);margin-bottom:14px}.modal input,.modal select{height:44px;border:1px solid var(--glass-border);border-radius:10px;background:var(--input-bg);color:var(--app-text);padding:0 12px;outline:0}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.history-form{margin:4px 0 16px;padding:16px;border:1px solid var(--glass-border);border-radius:14px;background:var(--glass-bg)}.history-form-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:10px}.history-form-head>div{display:flex;flex-direction:column;gap:4px}.history-form-head strong{font-size:.9rem}.history-form-head span{font-size:.72rem;color:var(--app-text-muted)}.history-form-head select{height:38px;min-width:145px;border:1px solid var(--glass-border);border-radius:9px;background:var(--input-bg);color:var(--app-text);padding:0 10px}.history-note{font-size:.72rem;color:var(--app-text-muted);margin-bottom:12px}.history-grid{display:flex;flex-direction:column;gap:8px}.history-row{display:grid;grid-template-columns:24px 1fr 1fr;gap:8px;align-items:end}.history-index{width:24px;height:44px;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:800;color:var(--accent)}.history-row label{margin-bottom:0}.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:8px}@media(max-width:1050px){.summary{grid-template-columns:repeat(2,1fr)}.chart-grid{grid-template-columns:1fr}}@media(max-width:800px){.filter-bar{align-items:stretch;flex-direction:column}.month-filter{width:100%}.module-page{padding:28px 20px 44px}.page-heading{align-items:flex-start;flex-direction:column}.page-heading .primary{width:100%}.table-card{display:none}.mobile-list{display:flex;flex-direction:column;gap:12px}.investment-card{padding:16px}.card-head{display:flex;justify-content:space-between;gap:12px;margin-bottom:16px}.card-actions{display:flex;gap:6px}.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.detail-grid div{display:flex;flex-direction:column;gap:4px}.detail-grid span{font-size:.7rem;color:var(--app-text-muted)}.detail-grid strong{font-size:.82rem}.card-performance{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:16px;padding-top:14px;border-top:1px solid var(--glass-border)}.card-performance span{font-size:.76rem;color:var(--app-text-muted)}.card-performance strong{font-size:.85rem}.card-performance.positive strong{color:var(--success)}.card-performance.negative strong{color:var(--danger)}.history-section{margin-top:22px}.chart-card{padding:16px}.modal{padding:22px}.history-form-head{align-items:stretch;flex-direction:column}.history-form-head select{width:100%}}@media(max-width:520px){.module-page{padding:24px 16px}.summary{grid-template-columns:1fr}.grid,.detail-grid{grid-template-columns:1fr}.history-row{grid-template-columns:24px 1fr}.history-row label:last-child{grid-column:2}.modal{padding:18px}.card-performance{align-items:flex-start;flex-direction:column}.chart-wrap svg{height:170px}.no-history{min-height:170px;flex-direction:column;padding:20px}}
</style>