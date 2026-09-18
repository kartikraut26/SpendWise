<template>
  <div class="module-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">RECURRING</p>
        <h1>Subscriptions</h1>
        <p>Keep recurring payments visible with their monthly and annual cost.</p>
      </div><button class="primary" @click="openCreate">
        <Plus :size="18" /> Add subscription
      </button>
    </section>
    <section class="summary">
      <div class="glass-surface stat"><span>Monthly cost</span><strong>{{ money(monthlyCost) }}</strong><small>based on
          active subscriptions</small></div>
      <div class="glass-surface stat"><span>Annual cost</span><strong>{{ money(annualCost) }}</strong><small>projected
          recurring spend</small></div>
      <div class="glass-surface stat"><span>Active</span><strong>{{ activeSubscriptions.length
          }}</strong><small>recurring payments</small></div>
    </section>
    <p v-if="error" class="error">{{ error }}</p>
    <section v-if="!subscriptions.length" class="glass-surface empty">
      <RefreshCw :size="34" /><strong>No subscriptions yet</strong><span>Add recurring services, memberships or bills to
        track them.</span>
    </section>
    <section v-else class="list">
      <article v-for="s in subscriptions" :key="s._id" class="glass-surface item" :class="{ inactive: !s.active }">
        <div class="service-icon">
          <CreditCard :size="20" />
        </div>
        <div class="info"><strong>{{ s.name }}</strong><span>{{ s.billingCycle }} · next payment {{
          date(s.nextPaymentDate) }}</span></div>
        <div class="cost"><strong>{{ money(s.amount) }}</strong><small>{{ s.billingCycle === 'monthly' ? 'per month' :
            'per year' }}</small></div>
        <div class="actions"><button @click="toggle(s)">{{ s.active ? 'Pause' : 'Resume' }}</button><button
            @click="edit(s)">Edit</button><button class="danger" @click="remove(s)">Delete</button></div>
      </article>
    </section>

    <div v-if="modalOpen" class="backdrop" @click.self="close">
      <form class="modal glass-surface" @submit.prevent="save">
        <div class="modal-head">
          <h2>{{ editing ? 'Edit subscription' : 'New subscription' }}</h2><button type="button" @click="close">
            <X />
          </button>
        </div>
        <label>Name<input v-model="form.name" maxlength="80" placeholder="e.g. Internet plan" required></label>
        <div class="grid"><label>Amount<input v-model.number="form.amount" type="number" min=".01" step=".01"
              required></label><label>Billing cycle<select v-model="form.billingCycle">
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select></label></div>
        <label>Next payment date<input v-model="form.nextPaymentDate" type="date" required></label>
        <label>Category<select v-model="form.categoryId">
            <option v-for="c in expenseCategories" :key="c._id" :value="c.name">{{ c.name }}</option>
          </select></label>
        <div class="modal-actions"><button type="button" class="secondary" @click="close">Cancel</button><button
            class="primary">{{ editing ? 'Save changes' : 'Add subscription' }}</button></div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Plus, RefreshCw, CreditCard, X } from 'lucide-vue-next'
import api from '../services/api'
import { useFinanceStore } from '../stores/finance'
const finance = useFinanceStore(), modalOpen = ref(false), editing = ref(null), error = ref('')
const form = reactive({ name: '', amount: '', billingCycle: 'monthly', nextPaymentDate: new Date().toISOString().slice(0, 10), categoryId: '' })
const subscriptions = computed(() => finance.subscriptions), activeSubscriptions = computed(() => subscriptions.value.filter(s => s.active))
const expenseCategories = computed(() => finance.categories.filter(c => c.type === 'expense'))
const monthlyCost = computed(() => activeSubscriptions.value.reduce((sum, s) => sum + Number(s.amount) / (s.billingCycle === 'yearly' ? 12 : 1), 0))
const annualCost = computed(() => monthlyCost.value * 12)
function money(v) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v) }
function date(v) { return new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
async function load() { try { await Promise.all([finance.fetchCategories(), finance.fetchSubscriptions()]) } catch (e) { error.value = e.response?.data?.message || 'Could not load subscriptions.' } }
function openCreate() { editing.value = null; Object.assign(form, { name: '', amount: '', billingCycle: 'monthly', nextPaymentDate: new Date().toISOString().slice(0, 10), categoryId: expenseCategories.value[0]?.name || 'Subscription' }); modalOpen.value = true }
function edit(s) { editing.value = s._id; Object.assign(form, { name: s.name, amount: s.amount, billingCycle: s.billingCycle, nextPaymentDate: new Date(s.nextPaymentDate).toISOString().slice(0, 10), categoryId: s.categoryId || '' }); modalOpen.value = true }
function close() { modalOpen.value = false }
async function save() { try { if (editing.value) await api.patch(`/subscriptions/${editing.value}`, form); else await api.post('/subscriptions', form); close(); await finance.fetchSubscriptions() } catch (e) { error.value = e.response?.data?.message || 'Could not save subscription.' } }
async function toggle(s) { try { await api.patch(`/subscriptions/${s._id}`, { active: !s.active }); await finance.fetchSubscriptions() } catch (e) { error.value = e.response?.data?.message || 'Could not update subscription.' } }
async function remove(s) { if (!confirm(`Delete "${s.name}"?`)) return; try { await api.delete(`/subscriptions/${s._id}`); await finance.fetchSubscriptions() } catch (e) { error.value = e.response?.data?.message || 'Could not delete subscription.' } }
onMounted(load)
</script>
<style scoped>
.module-page {
  max-width: 1180px;
  margin: auto;
  padding: 34px 30px 50px
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 22px
}

.eyebrow {
  font-size: .68rem;
  font-weight: 800;
  letter-spacing: .1em;
  color: var(--accent);
  margin-bottom: 5px
}

h1 {
  font-size: 2rem;
  font-weight: 800
}

.page-heading p:not(.eyebrow) {
  color: var(--app-text-muted);
  margin-top: 6px
}

.primary,
.secondary {
  border: 0;
  border-radius: 11px;
  min-height: 44px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  cursor: pointer
}

.primary {
  background: var(--accent);
  color: #fff
}

.secondary {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--app-text)
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 18px
}

.stat {
  padding: 20px
}

.stat span,
.stat small {
  display: block;
  color: var(--app-text-muted);
  font-size: .78rem
}

.stat strong {
  display: block;
  font-size: 1.55rem;
  margin: 6px 0
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px
}

.item {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px
}

.inactive {
  opacity: .65
}

.service-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: var(--accent-soft);
  color: var(--accent)
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px
}

.info span,
.cost small {
  color: var(--app-text-muted);
  font-size: .78rem
}

.cost {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 3px
}

.actions {
  display: flex;
  gap: 7px
}

.actions button {
  border: 0;
  background: transparent;
  color: var(--accent);
  font-weight: 700;
  cursor: pointer
}

.actions .danger {
  color: var(--danger)
}

.empty {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  color: var(--app-text-muted)
}

.empty strong {
  color: var(--app-text)
}

.error {
  color: var(--danger);
  margin-bottom: 12px
}

.backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(2, 6, 23, .6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px
}

.modal {
  width: min(100%, 520px);
  padding: 26px;
  background: var(--modal-bg)
}

.modal-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px
}

.modal-head h2 {
  font-size: 1.4rem
}

.modal-head button {
  border: 0;
  background: transparent;
  color: var(--app-text);
  cursor: pointer
}

.modal label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: .8rem;
  font-weight: 700;
  color: var(--app-text-muted);
  margin-bottom: 14px
}

.modal input,
.modal select {
  height: 44px;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  background: var(--input-bg);
  color: var(--app-text);
  padding: 0 12px
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px
}

@media(max-width:800px) {
  .summary {
    grid-template-columns: 1fr 1fr
  }

  .item {
    flex-wrap: wrap
  }

  .actions {
    width: 100%;
    justify-content: flex-end
  }
}

@media(max-width:520px) {
  .module-page {
    padding: 24px 16px
  }

  .summary {
    grid-template-columns: 1fr
  }

  .grid {
    grid-template-columns: 1fr
  }
}
</style>
