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

    <section class="summary">
      <div class="glass-surface stat">
        <span>Total Invested</span>
        <strong>{{ money(summary.totalInvested) }}</strong>
        <small>capital invested</small>
      </div>
      <div class="glass-surface stat">
        <span>Current Value</span>
        <strong>{{ money(summary.currentValue) }}</strong>
        <small>based on stored current prices</small>
      </div>
      <div class="glass-surface stat" :class="summary.totalProfitLoss >= 0 ? 'positive' : 'negative'">
        <span>Total P/L</span>
        <strong>{{ signedMoney(summary.totalProfitLoss) }}</strong>
        <small>overall portfolio gain/loss</small>
      </div>
      <div class="glass-surface stat" :class="summary.profitLossPercentage >= 0 ? 'positive' : 'negative'">
        <span>P/L %</span>
        <strong>{{ signedPercent(summary.profitLossPercentage) }}</strong>
        <small>return on invested value</small>
      </div>
    </section>

    <p v-if="error" class="error">{{ error }}</p>

    <section v-if="!loading && !investments.length" class="glass-surface empty">
      <TrendingUp :size="34" />
      <strong>No investments yet</strong>
      <span>Add your first stock investment to start tracking your portfolio.</span>
      <button class="primary empty-button" @click="openCreate">
        <Plus :size="17" /> Add investment
      </button>
    </section>

    <section v-else class="table-card glass-surface">
      <div v-if="loading" class="empty">Loading investments…</div>
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
            <tr v-for="investment in investments" :key="investment._id">
              <td>
                <div class="investment-name">
                  <strong>{{ investment.companyName }}</strong>
                  <span>{{ investment.symbol }} · {{ formatDate(investment.purchaseDate) }}</span>
                </div>
              </td>
              <td>{{ investment.exchange }}</td>
              <td>{{ quantity(investment.quantity) }}</td>
              <td>{{ money(investment.buyPrice) }}</td>
              <td>{{ money(investment.currentPrice) }}</td>
              <td>{{ money(investment.investedValue) }}</td>
              <td>{{ money(investment.currentValue) }}</td>
              <td :class="investment.profitLoss >= 0 ? 'positive-text' : 'negative-text'">
                <strong>{{ signedMoney(investment.profitLoss) }}</strong>
                <small>{{ signedPercent(investment.profitLossPercentage) }}</small>
              </td>
              <td class="actions">
                <button @click="edit(investment)" aria-label="Edit investment"><Pencil :size="16" /></button>
                <button class="danger" @click="remove(investment)" aria-label="Delete investment"><Trash2 :size="16" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="!loading && investments.length" class="mobile-list">
      <article v-for="investment in investments" :key="investment._id" class="glass-surface investment-card">
        <div class="card-head">
          <div class="investment-name">
            <strong>{{ investment.companyName }}</strong>
            <span>{{ investment.symbol }} · {{ investment.exchange }}</span>
          </div>
          <div class="card-actions">
            <button @click="edit(investment)"><Pencil :size="16" /></button>
            <button class="danger" @click="remove(investment)"><Trash2 :size="16" /></button>
          </div>
        </div>

        <div class="detail-grid">
          <div><span>Quantity</span><strong>{{ quantity(investment.quantity) }}</strong></div>
          <div><span>Buy Price</span><strong>{{ money(investment.buyPrice) }}</strong></div>
          <div><span>Current Price</span><strong>{{ money(investment.currentPrice) }}</strong></div>
          <div><span>Purchase Date</span><strong>{{ formatDate(investment.purchaseDate) }}</strong></div>
          <div><span>Invested Value</span><strong>{{ money(investment.investedValue) }}</strong></div>
          <div><span>Current Value</span><strong>{{ money(investment.currentValue) }}</strong></div>
        </div>

        <div class="card-performance" :class="investment.profitLoss >= 0 ? 'positive' : 'negative'">
          <span>Profit / Loss</span>
          <strong>{{ signedMoney(investment.profitLoss) }} ({{ signedPercent(investment.profitLossPercentage) }})</strong>
        </div>
      </article>
    </section>

    <div v-if="modalOpen" class="backdrop" @click.self="close">
      <form class="modal glass-surface" @submit.prevent="save">
        <div class="modal-head">
          <div>
            <p class="eyebrow">{{ editing ? 'EDIT' : 'NEW' }}</p>
            <h2>{{ editing ? 'Edit investment' : 'Add investment' }}</h2>
          </div>
          <button type="button" @click="close"><X /></button>
        </div>

        <div class="grid">
          <label>
            Company / Stock Name
            <input v-model="form.companyName" maxlength="120" placeholder="e.g. Reliance Industries" required>
          </label>
          <label>
            Symbol
            <input v-model="form.symbol" maxlength="30" placeholder="e.g. RELIANCE" required>
          </label>
        </div>

        <div class="grid">
          <label>
            Exchange
            <select v-model="form.exchange" required>
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
              <option value="NASDAQ">NASDAQ</option>
              <option value="NYSE">NYSE</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
          <label>
            Quantity
            <input v-model.number="form.quantity" type="number" min="0.000001" step="any" required>
          </label>
        </div>

        <div class="grid">
          <label>
            Buy Price
            <input v-model.number="form.buyPrice" type="number" min="0.01" step="0.01" required>
          </label>
          <label>
            Current Price
            <input v-model.number="form.currentPrice" type="number" min="0" step="0.01" required>
          </label>
        </div>

        <label>
          Purchase Date
          <input v-model="form.purchaseDate" type="date" required>
        </label>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="modal-actions">
          <button type="button" class="secondary" @click="close">Cancel</button>
          <button class="primary" :disabled="saving">{{ saving ? 'Saving…' : editing ? 'Save changes' : 'Add investment' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Plus, TrendingUp, Pencil, Trash2, X } from 'lucide-vue-next'
import { useFinanceStore } from '../stores/finance'

const finance = useFinanceStore()
const loading = ref(false)
const saving = ref(false)
const modalOpen = ref(false)
const editing = ref(null)
const error = ref('')

const form = reactive({
  companyName: '',
  symbol: '',
  exchange: 'NSE',
  quantity: '',
  buyPrice: '',
  purchaseDate: today(),
  currentPrice: ''
})

const investments = computed(() => finance.investments)
const summary = computed(() => finance.investmentSummary)

function today() {
  return new Date().toISOString().slice(0, 10)
}

function money(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(Number(value) || 0)
}

function signedMoney(value) {
  const amount = Number(value) || 0
  return `${amount >= 0 ? '+' : '-'}${money(Math.abs(amount))}`
}

function signedPercent(value) {
  const percentage = Number(value) || 0
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`
}

function quantity(value) {
  return Number(value).toLocaleString('en-IN', { maximumFractionDigits: 6 })
}

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    await finance.fetchInvestments()
  } catch (e) {
    error.value = e.response?.data?.message || 'Could not load investments.'
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
    currentPrice: ''
  })
}

function openCreate() {
  editing.value = null
  error.value = ''
  resetForm()
  modalOpen.value = true
}

function edit(investment) {
  editing.value = investment._id
  error.value = ''
  Object.assign(form, {
    companyName: investment.companyName,
    symbol: investment.symbol,
    exchange: investment.exchange,
    quantity: investment.quantity,
    buyPrice: investment.buyPrice,
    purchaseDate: new Date(investment.purchaseDate).toISOString().slice(0, 10),
    currentPrice: investment.currentPrice
  })
  modalOpen.value = true
}

function close() {
  modalOpen.value = false
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    if (editing.value) {
      await finance.updateInvestment(editing.value, form)
    } else {
      await finance.addInvestment(form)
    }
    close()
  } catch (e) {
    error.value = e.response?.data?.message || 'Could not save investment.'
  } finally {
    saving.value = false
  }
}

async function remove(investment) {
  if (!confirm(`Delete "${investment.companyName}" investment?`)) return
  error.value = ''
  try {
    await finance.deleteInvestment(investment._id)
  } catch (e) {
    error.value = e.response?.data?.message || 'Could not delete investment.'
  }
}

onMounted(load)
</script>

<style scoped>
.module-page{max-width:1180px;margin:auto;padding:34px 30px 50px}.page-heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:22px}.eyebrow{font-size:.68rem;font-weight:800;letter-spacing:.1em;color:var(--accent);margin-bottom:5px}h1{font-size:2rem;font-weight:800}.page-heading p:not(.eyebrow){color:var(--app-text-muted);margin-top:6px}.primary,.secondary{border:0;border-radius:11px;min-height:44px;padding:0 16px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:700;cursor:pointer}.primary{background:var(--accent);color:#fff}.primary:disabled{opacity:.65;cursor:not-allowed}.secondary{background:var(--glass-bg);border:1px solid var(--glass-border);color:var(--app-text)}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}.stat{padding:20px}.stat span,.stat small{display:block;color:var(--app-text-muted);font-size:.78rem}.stat strong{display:block;font-size:1.4rem;margin:6px 0}.stat.positive strong{color:var(--success)}.stat.negative strong{color:var(--danger)}.error{color:var(--danger);margin-bottom:12px;font-size:.85rem}.table-card{overflow:hidden}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse}th,td{padding:16px 14px;text-align:left;border-bottom:1px solid var(--glass-border);white-space:nowrap}th{font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:var(--app-text-muted)}td{font-size:.82rem}.investment-name{display:flex;flex-direction:column;gap:4px;min-width:160px}.investment-name span{font-size:.72rem;color:var(--app-text-muted)}td small{display:block;font-size:.7rem;margin-top:3px}.positive-text{color:var(--success)}.negative-text{color:var(--danger)}.actions{display:flex;gap:6px}.actions button,.card-actions button,.modal-head>button{border:0;background:transparent;color:var(--app-text-muted);cursor:pointer}.actions .danger,.card-actions .danger{color:var(--danger)}.empty{min-height:280px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:var(--app-text-muted)}.empty strong{color:var(--app-text)}.empty-button{margin-top:8px}.mobile-list{display:none}.backdrop{position:fixed;inset:0;z-index:100;background:rgba(2,6,23,.6);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px}.modal{width:min(100%,620px);padding:26px;background:var(--modal-bg)}.modal-head{display:flex;justify-content:space-between;margin-bottom:20px}.modal-head h2{font-size:1.4rem;font-weight:800}.modal label{display:flex;flex-direction:column;gap:7px;font-size:.8rem;font-weight:700;color:var(--app-text-muted);margin-bottom:14px}.modal input,.modal select{height:44px;border:1px solid var(--glass-border);border-radius:10px;background:var(--input-bg);color:var(--app-text);padding:0 12px;outline:0}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:8px}@media(max-width:1050px){.summary{grid-template-columns:repeat(2,1fr)}}@media(max-width:800px){.module-page{padding:28px 20px 44px}.page-heading{align-items:flex-start;flex-direction:column}.page-heading .primary{width:100%}.table-card{display:none}.mobile-list{display:flex;flex-direction:column;gap:12px}.investment-card{padding:16px}.card-head{display:flex;justify-content:space-between;gap:12px;margin-bottom:16px}.card-actions{display:flex;gap:6px}.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.detail-grid div{display:flex;flex-direction:column;gap:4px}.detail-grid span{font-size:.7rem;color:var(--app-text-muted)}.detail-grid strong{font-size:.82rem}.card-performance{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:16px;padding-top:14px;border-top:1px solid var(--glass-border)}.card-performance span{font-size:.76rem;color:var(--app-text-muted)}.card-performance strong{font-size:.85rem}.card-performance.positive strong{color:var(--success)}.card-performance.negative strong{color:var(--danger)}}@media(max-width:520px){.module-page{padding:24px 16px}.summary{grid-template-columns:1fr}.grid,.detail-grid{grid-template-columns:1fr}.modal{padding:22px}.card-performance{align-items:flex-start;flex-direction:column}}
</style>
