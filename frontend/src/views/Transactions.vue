<template>
  <div class="module-page">
    <section class="page-heading">
      <div><p class="eyebrow">ACTIVITY</p><h1>Transactions</h1><p>Track every income and expense in your account.</p></div>
      <button class="primary" @click="openCreate"><Plus :size="18" /> Add transaction</button>
    </section>

    <section class="toolbar glass-surface">
      <div class="search"><Search :size="17" /><input v-model="filters.search" placeholder="Search transactions..." @input="debouncedLoad"></div>
      <select v-model="filters.type" @change="load"><option value="">All types</option><option value="income">Income</option><option value="expense">Expense</option></select>
      <select v-model="filters.category" @change="load"><option value="">All categories</option><option v-for="c in finance.categories" :key="c._id" :value="c.name">{{ c.name }}</option></select>
      <select v-model="filters.order" @change="load"><option value="desc">Newest first</option><option value="asc">Oldest first</option></select>
    </section>

    <section class="table-card glass-surface">
      <div v-if="loading" class="empty">Loading transactions…</div>
      <div v-else-if="!finance.transactions.length" class="empty">
        <Receipt :size="32" /><strong>No transactions yet</strong><span>Add your first income or expense to get started.</span>
      </div>
      <div v-else class="table-wrap">
        <table>
          <thead><tr><th>Description</th><th>Category</th><th>Type</th><th>Date</th><th>Amount</th><th></th></tr></thead>
          <tbody>
            <tr v-for="t in finance.transactions" :key="t.id">
              <td><strong>{{ t.title }}</strong></td><td>{{ t.category }}</td>
              <td><span class="pill" :class="t.type">{{ t.type }}</span></td>
              <td>{{ formatDate(t.date) }}</td>
              <td :class="t.type">{{ t.type === 'income' ? '+' : '-' }}{{ money(t.amount) }}</td>
              <td class="actions"><button @click="edit(t)"><Pencil :size="16" /></button><button @click="remove(t)" class="danger"><Trash2 :size="16" /></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="modalOpen" class="backdrop" @click.self="close">
      <form class="modal glass-surface" @submit.prevent="save">
        <div class="modal-head"><div><p class="eyebrow">{{ editing ? 'EDIT' : 'NEW' }}</p><h2>{{ editing ? 'Edit transaction' : 'Add transaction' }}</h2></div><button type="button" @click="close"><X /></button></div>
        <div class="switch"><button type="button" :class="{active: form.type==='expense'}" @click="form.type='expense'">Expense</button><button type="button" :class="{active: form.type==='income'}" @click="form.type='income'">Income</button></div>
        <label>Amount<input v-model.number="form.amount" type="number" min="0.01" step="0.01" required></label>
        <div class="grid"><label>Description<input v-model="form.description" required maxlength="120"></label><label>Category<select v-model="form.categoryId"><option v-for="c in categoryOptions" :key="c._id" :value="c.name">{{ c.name }}</option></select></label></div>
        <label>Date<input v-model="form.date" type="date" required></label>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="modal-actions"><button type="button" class="secondary" @click="close">Cancel</button><button class="primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save transaction' }}</button></div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Plus, Search, Receipt, Pencil, Trash2, X } from 'lucide-vue-next'
import { useFinanceStore } from '../stores/finance'

const finance = useFinanceStore()
const loading = ref(false), saving = ref(false), modalOpen = ref(false), editing = ref(null), error = ref('')
const filters = reactive({ search: '', type: '', category: '', order: 'desc' })
const form = reactive({ type: 'expense', amount: '', description: '', categoryId: '', date: today() })

const categoryOptions = computed(() => finance.categories.filter(c => c.type === form.type))

function today() { return new Date().toISOString().slice(0,10) }
function money(v) { return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(v) }
function formatDate(v) { return new Date(v).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) }

async function load() {
  loading.value = true
  try { await finance.fetchTransactions({ ...filters }) } catch (e) { error.value = e.response?.data?.message || 'Could not load transactions.' }
  finally { loading.value = false }
}
let timer
function debouncedLoad() { clearTimeout(timer); timer = setTimeout(load, 300) }

function openCreate() {
  editing.value = null; error.value = ''
  Object.assign(form,{type:'expense',amount:'',description:'',categoryId:finance.categories.find(c=>c.type==='expense')?.name || '',date:today()})
  modalOpen.value = true
}
function edit(t) {
  editing.value = t.id; error.value = ''
  Object.assign(form,{type:t.type,amount:t.amount,description:t.description,categoryId:t.categoryId || '',date:new Date(t.date).toISOString().slice(0,10)})
  modalOpen.value = true
}
function close(){ modalOpen.value=false }
async function save(){
  saving.value=true; error.value=''
  try {
    if (editing.value) await finance.updateTransaction(editing.value, form)
    else await finance.addTransaction(form)
    close()
    await load()
  } catch(e) { error.value=e.response?.data?.message || 'Could not save transaction.' }
  finally { saving.value=false }
}
async function remove(t){
  if (!confirm(`Delete "${t.title}"?`)) return
  try { await finance.deleteTransaction(t.id) } catch(e) { error.value=e.response?.data?.message || 'Could not delete transaction.' }
}
onMounted(async()=>{ await finance.fetchCategories(); await load() })
</script>

<style scoped>
.module-page{max-width:1180px;margin:auto;padding:34px 30px 50px}.page-heading{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:22px}.eyebrow{font-size:.68rem;font-weight:800;letter-spacing:.1em;color:var(--accent);margin-bottom:5px}h1{font-size:2rem;font-weight:800}.page-heading p:not(.eyebrow){color:var(--app-text-muted);margin-top:6px}.primary,.secondary{border:0;border-radius:11px;min-height:44px;padding:0 16px;display:inline-flex;gap:8px;align-items:center;justify-content:center;font-weight:700;cursor:pointer}.primary{background:var(--accent);color:#fff}.secondary{background:var(--glass-bg);border:1px solid var(--glass-border);color:var(--app-text)}.toolbar{padding:14px;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:10px;margin-bottom:18px}.search{display:flex;align-items:center;gap:8px;padding:0 12px;border:1px solid var(--glass-border);border-radius:10px;background:var(--input-bg)}input,select{height:42px;border:1px solid var(--glass-border);border-radius:10px;background:var(--input-bg);color:var(--app-text);padding:0 11px;outline:0}.search input{border:0;background:transparent;padding:0}.search input:focus{border:0}.table-card{overflow:hidden}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse}th,td{padding:16px 18px;text-align:left;border-bottom:1px solid var(--glass-border);white-space:nowrap}th{font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--app-text-muted)}td.income{color:var(--success);font-weight:800}td.expense{color:var(--danger);font-weight:800}.pill{padding:5px 8px;border-radius:999px;font-size:.72rem;font-weight:700;text-transform:capitalize}.pill.income{background:rgba(16,185,129,.12);color:var(--success)}.pill.expense{background:rgba(239,68,68,.12);color:var(--danger)}.actions{display:flex;gap:6px}.actions button,.modal-head>button{border:0;background:transparent;color:var(--app-text-muted);cursor:pointer}.actions .danger:hover{color:var(--danger)}.empty{min-height:260px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:var(--app-text-muted)}.empty strong{color:var(--app-text)}.backdrop{position:fixed;inset:0;z-index:100;background:rgba(2,6,23,.6);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px}.modal{width:min(100%,560px);padding:26px;background:var(--modal-bg)}.modal-head{display:flex;justify-content:space-between;margin-bottom:20px}.modal-head h2{font-size:1.4rem;font-weight:800}.switch{display:grid;grid-template-columns:1fr 1fr;padding:4px;background:var(--input-bg);border-radius:11px;margin-bottom:16px}.switch button{border:0;background:transparent;color:var(--app-text-muted);height:38px;border-radius:8px;font-weight:700;cursor:pointer}.switch button.active{background:var(--accent);color:white}.modal label{display:flex;flex-direction:column;gap:7px;font-size:.8rem;font-weight:700;color:var(--app-text-muted);margin-bottom:14px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:8px}.error{color:var(--danger);font-size:.85rem}@media(max-width:800px){.toolbar{grid-template-columns:1fr 1fr}.search{grid-column:1/-1}.page-heading{align-items:flex-start;flex-direction:column}.grid{grid-template-columns:1fr}}@media(max-width:520px){.module-page{padding:24px 16px}.toolbar{grid-template-columns:1fr}}
</style>
