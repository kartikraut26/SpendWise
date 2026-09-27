<template>
  <div class="module-page">
    <section class="page-heading"><div><p class="eyebrow">INSIGHTS</p><h1>Reports</h1><p>Understand where your money comes from and where it goes.</p></div><select v-model="months" @change="load"><option :value="3">Last 3 months</option><option :value="6">Last 6 months</option><option :value="12">Last 12 months</option></select></section>
    <p v-if="error" class="error">{{ error }}</p>
    <section class="summary"><div class="glass-surface stat"><span>Total income</span><strong class="income">{{ money(report.totals.income) }}</strong></div><div class="glass-surface stat"><span>Total expenses</span><strong class="expense">{{ money(report.totals.expense) }}</strong></div><div class="glass-surface stat"><span>Net savings</span><strong>{{ money(report.totals.income-report.totals.expense) }}</strong></div></section>

    <section class="grid">
      <article class="glass-surface panel"><div class="head"><div><p class="eyebrow">SPENDING</p><h2>Expense by category</h2></div></div>
        <div v-if="!report.category.length" class="empty">No expense data for this period.</div>
        <div v-else class="bars"><div v-for="item in report.category" :key="item.name" class="bar-row"><div class="bar-label"><span>{{item.name}}</span><strong>{{money(item.amount)}} · {{item.percent}}%</strong></div><div class="track"><div class="fill" :style="{width:`${Math.max(item.percent,2)}%`}"></div></div></div></div>
      </article>
      <article class="glass-surface panel"><div><p class="eyebrow">CASH FLOW</p><h2>Income vs expense</h2></div>
        <div v-if="!report.monthly.length" class="empty">No transaction data for this period.</div>
        <div v-else class="chart"><div v-for="item in report.monthly" :key="item.month" class="month"><div class="columns"><div class="column income-col" :title="`Income: ${money(item.income)}`" :style="{height:`${scale(item.income)}%`}"></div><div class="column expense-col" :title="`Expense: ${money(item.expense)}`" :style="{height:`${scale(item.expense)}%`}"></div></div><small>{{label(item.month)}}</small></div></div>
        <div class="legend"><span><i class="income-dot"></i>Income</span><span><i class="expense-dot"></i>Expense</span></div>
      </article>
    </section>

    <section class="glass-surface panel investment-performance">
      <div class="investment-head">
        <div>
          <p class="eyebrow">INVESTMENTS</p>
          <h2>Invested vs Profit / Loss</h2>
          <p class="panel-note">Monthly investment amount compared with the current profit or loss.</p>
        </div>
        <select v-model.number="months" @change="load" class="investment-period" aria-label="Investment graph period">
          <option :value="3">3 months</option>
          <option :value="6">6 months</option>
          <option :value="12">12 months</option>
        </select>
      </div>
      <div v-if="!investmentPL.length" class="empty">No investment data for this period.</div>
      <div v-else class="investment-chart">
        <div v-for="item in investmentPL" :key="item.month" class="investment-month">
          <div class="investment-values">
            <div class="investment-value invested-value">{{ money(item.invested) }}</div>
            <div class="investment-value" :class="item.profitLoss >= 0 ? 'pl-positive' : 'pl-negative'">
              {{ item.profitLoss >= 0 ? '+' : '-' }}{{ money(Math.abs(item.profitLoss)) }}
            </div>
          </div>
          <div class="investment-bars">
            <div class="investment-bar-wrap">
              <div class="investment-bar invested-bar" :style="{height:`${investmentScale(item.invested)}%`}" :title="`Invested: ${money(item.invested)}`"></div>
            </div>
            <div class="investment-bar-wrap">
              <div class="investment-bar" :class="item.profitLoss >= 0 ? 'profit-bar' : 'loss-bar'" :style="{height:`${plScale(item.profitLoss)}%`}" :title="`${item.profitLoss >= 0 ? 'Profit' : 'Loss'}: ${money(item.profitLoss)}`"></div>
            </div>
          </div>
          <small>{{ label(item.month) }}</small>
        </div>
      </div>
      <div class="investment-legend">
        <span><i class="invested-dot"></i>Invested</span>
        <span><i class="profit-dot"></i>Profit</span>
        <span><i class="loss-dot"></i>Loss</span>
      </div>
    </section>

    <section class="glass-surface panel monthly"><div><p class="eyebrow">MONTHLY BREAKDOWN</p><h2>Month by month</h2></div>
      <div v-if="!report.monthly.length" class="empty">No monthly data available.</div>
      <table v-else><thead><tr><th>Month</th><th>Income</th><th>Expenses</th><th>Net</th></tr></thead><tbody><tr v-for="item in [...report.monthly].reverse()" :key="item.month"><td>{{label(item.month)}}</td><td class="income">{{money(item.income)}}</td><td class="expense">{{money(item.expense)}}</td><td>{{money(item.balance)}}</td></tr></tbody></table>
    </section>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useFinanceStore } from '../stores/finance'
import api from '../services/api'
const finance=useFinanceStore(), months=ref(6), error=ref('')
const report=reactive({category:[],monthly:[],totals:{income:0,expense:0}})
function money(v){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(v||0)}
function label(m){const [y,mo]=m.split('-');return new Date(Number(y),Number(mo)-1,1).toLocaleDateString('en-IN',{month:'short',year:'2-digit'})}
function scale(v){const max=Math.max(...report.monthly.flatMap(x=>[x.income,x.expense]),1);return Math.max(3,Math.round(v/max*100))}
const investmentPL = computed(() => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - Number(months.value) + 1, 1)
  const grouped = {}
  for (const investment of finance.investments || []) {
    const date = new Date(investment.purchaseDate)
    if (Number.isNaN(date.getTime()) || date < start) continue
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!grouped[key]) grouped[key] = { invested: 0, profitLoss: 0 }
    grouped[key].invested += Number(investment.investedValue || (Number(investment.quantity || 0) * Number(investment.buyPrice || 0)))
    grouped[key].profitLoss += Number(investment.profitLoss || 0)
  }
  return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([month, values]) => ({ month, ...values }))
})
function investmentScale(v){const max=Math.max(...investmentPL.value.map(x=>Number(x.invested)||0),1);return Math.max(8,Math.round((Number(v)||0)/max*100))}
function plScale(v){const max=Math.max(...investmentPL.value.map(x=>Math.abs(Number(x.profitLoss)||0)),1);return Math.max(8,Math.round(Math.abs(Number(v)||0)/max*100))}
async function load(){try{const r=await api.get('/reports',{params:{months:months.value}});Object.assign(report,r.data.data);await finance.fetchInvestments()}catch(e){error.value=e.response?.data?.message||'Could not load reports.'}}
onMounted(load)
</script>
<style scoped>
.module-page{max-width:1180px;margin:auto;padding:34px 30px 50px}.page-heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:22px}.eyebrow{font-size:.68rem;font-weight:800;letter-spacing:.1em;color:var(--accent);margin-bottom:5px}h1{font-size:2rem;font-weight:800}.page-heading p:not(.eyebrow){color:var(--app-text-muted);margin-top:6px}.page-heading select{height:42px;border:1px solid var(--glass-border);border-radius:10px;background:var(--input-bg);color:var(--app-text);padding:0 12px}.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px}.stat{padding:20px}.stat span{color:var(--app-text-muted);font-size:.78rem}.stat strong{display:block;font-size:1.5rem;margin-top:6px}.income{color:var(--success)}.expense{color:var(--danger)}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px}.panel{padding:22px}.panel h2{font-size:1.05rem;font-weight:800}.bars{margin-top:22px;display:flex;flex-direction:column;gap:15px}.bar-label{display:flex;justify-content:space-between;gap:12px;font-size:.8rem}.bar-label strong{color:var(--app-text-muted);font-weight:600}.track{height:9px;background:var(--input-bg);border-radius:99px;margin-top:7px;overflow:hidden}.fill{height:100%;background:var(--accent);border-radius:99px}.chart{height:260px;display:flex;align-items:end;gap:10px;margin-top:20px;padding-top:10px;border-bottom:1px solid var(--glass-border)}.month{height:100%;flex:1;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:8px}.columns{height:220px;width:100%;display:flex;align-items:end;justify-content:center;gap:3px}.column{width:40%;max-width:22px;border-radius:5px 5px 0 0;min-height:3px}.income-col{background:var(--success)}.expense-col{background:var(--danger)}.month small{font-size:.68rem;color:var(--app-text-muted)}.legend{display:flex;justify-content:center;gap:20px;margin-top:14px;font-size:.75rem;color:var(--app-text-muted)}.legend span{display:flex;align-items:center;gap:6px}.legend i{width:9px;height:9px;border-radius:50%;display:inline-block}.income-dot{background:var(--success)}.expense-dot{background:var(--danger)}.monthly{overflow:hidden}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{padding:13px 10px;border-bottom:1px solid var(--glass-border);text-align:left}th{font-size:.7rem;color:var(--app-text-muted);text-transform:uppercase}.empty{min-height:180px;display:grid;place-items:center;color:var(--app-text-muted)}.error{color:var(--danger);margin-bottom:12px}@media(max-width:800px){.summary,.grid{grid-template-columns:1fr}.page-heading{align-items:flex-start;flex-direction:column}}
.investment-performance{margin-bottom:18px}.investment-head{display:flex;justify-content:space-between;align-items:flex-start;gap:18px}.panel-note{color:var(--app-text-muted);font-size:.75rem;margin-top:5px}.investment-period{height:38px;border:1px solid var(--glass-border);border-radius:10px;background:var(--input-bg);color:var(--app-text);padding:0 10px;flex-shrink:0}.investment-chart{height:280px;display:flex;align-items:end;gap:14px;margin-top:20px;padding:10px 8px 25px;border-bottom:1px solid var(--glass-border);overflow-x:auto}.investment-month{height:100%;min-width:82px;flex:1;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:7px}.investment-values{height:38px;text-align:center}.investment-value{font-size:.68rem;font-weight:700;white-space:nowrap}.invested-value{color:var(--app-text-muted)}.investment-bars{height:185px;width:100%;display:flex;align-items:end;justify-content:center;gap:5px}.investment-bar-wrap{height:100%;width:30px;display:flex;align-items:end;justify-content:center}.investment-bar{width:100%;min-height:4px;border-radius:5px 5px 0 0}.invested-bar{background:var(--accent)}.profit-bar{background:var(--success)}.loss-bar{background:var(--danger)}.investment-month small{font-size:.68rem;color:var(--app-text-muted)}.investment-legend{display:flex;justify-content:center;gap:18px;margin-top:14px;font-size:.75rem;color:var(--app-text-muted)}.investment-legend span{display:flex;align-items:center;gap:6px}.investment-legend i{width:9px;height:9px;border-radius:50%;display:inline-block}.invested-dot{background:var(--accent)}.profit-dot{background:var(--success)}.loss-dot{background:var(--danger)}@media(max-width:800px){.investment-head{flex-direction:column}.investment-period{width:100%}.investment-chart{justify-content:flex-start}.investment-month{flex:0 0 82px}}
</style>
