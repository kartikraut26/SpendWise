<template>
  <div class="module-page">
    <section class="page-heading">
      <div>
        <p class="eyebrow">PLANNING</p>
        <h1>Monthly Budget</h1>
        <p>Set limits and see how much of each budget is still available.</p>
      </div>
      <button class="primary" @click="openCreate">
        <Plus :size="18" /> Add budget
      </button>
    </section>
    <section class="controls glass-surface">
      <label>Month<input v-model="month" type="month" @change="load" /></label>
    </section>
    <p v-if="error" class="error">{{ error }}</p>
    <section v-if="!loading && !budgets.length" class="glass-surface empty">
      <WalletCards :size="34" /><strong>No budgets for this month</strong
      ><span>Create a budget to start tracking your spending.</span>
    </section>
    <section v-else class="budget-grid">
      <article
        v-for="b in budgets"
        :key="b._id"
        class="glass-surface budget-card"
      >
        <div class="top">
          <div>
            <span class="label">{{ b.category }}</span>
            <h2>{{ money(b.remaining) }}</h2>
            <small>remaining of {{ money(b.amount) }}</small>
          </div>
          <div class="actions">
            <button @click="edit(b)"><Pencil :size="16" /></button
            ><button class="danger" @click="remove(b)">
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
        <div class="track">
          <div
            class="fill"
            :class="{ over: b.spent > b.amount }"
            :style="{ width: `${Math.min((b.spent / b.amount) * 100, 100)}%` }"
          ></div>
        </div>
        <div class="bottom">
          <span>{{ money(b.spent) }} spent</span
          ><strong>{{ Math.round((b.spent / b.amount) * 100) }}%</strong>
        </div>
        <p v-if="b.spent >= b.amount" class="alert">
          Budget limit reached. Consider reducing spending in this category.
        </p>
      </article>
    </section>

    <div v-if="modalOpen" class="backdrop" @click.self="close">
      <form class="modal glass-surface" @submit.prevent="save">
        <div class="modal-head">
          <h2>{{ editing ? "Edit budget" : "New budget" }}</h2>
          <button type="button" @click="close"><X /></button>
        </div>
        <label
          >Category<select v-model="form.categoryId">
            <option value="overall">Overall</option>
            <option v-for="c in expenseCategories" :key="c._id" :value="c.name">
              {{ c.name }}
            </option>
          </select></label
        >
        <label
          >Monthly allocation<input
            v-model.number="form.amount"
            type="number"
            min="0.01"
            step="0.01"
            required
        /></label>
        <label>Month<input v-model="form.month" type="month" required /></label>
        <p v-if="form.amount" class="hint">
          The budget will track actual expenses for
          {{
            form.categoryId === "overall" ? "all categories" : form.categoryId
          }}
          in this month.
        </p>
        <div class="modal-actions">
          <button type="button" class="secondary" @click="close">Cancel</button
          ><button class="primary">
            {{ editing ? "Save changes" : "Create budget" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { Plus, WalletCards, Pencil, Trash2, X } from "lucide-vue-next";
import api from "../services/api";
import { useFinanceStore } from "../stores/finance";
const finance = useFinanceStore(),
  loading = ref(false),
  error = ref(""),
  modalOpen = ref(false),
  editing = ref(null);
const month = ref(new Date().toISOString().slice(0, 7)),
  form = reactive({ categoryId: "overall", amount: "", month: month.value });
const expenseCategories = computed(() =>
    finance.categories.filter((c) => c.type === "expense"),
  ),
  budgets = computed(() => finance.budgets);
function money(v) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);
}
async function load() {
  loading.value = true;
  error.value = "";
  try {
    await Promise.all([
      finance.fetchCategories(),
      finance.fetchBudgets(month.value),
    ]);
  } catch (e) {
    error.value = e.response?.data?.message || "Could not load budgets.";
  } finally {
    loading.value = false;
  }
}
function openCreate() {
  editing.value = null;
  Object.assign(form, {
    categoryId: "overall",
    amount: "",
    month: month.value,
  });
  modalOpen.value = true;
}
function edit(b) {
  editing.value = b._id;
  Object.assign(form, {
    categoryId: b.categoryId,
    amount: b.amount,
    month: b.month,
  });
  modalOpen.value = true;
}
function close() {
  modalOpen.value = false;
}
async function save() {
  try {
    if (editing.value)
      await api.patch(`/budgets/${editing.value}`, {
        amount: Number(form.amount),
      });
    else await api.post("/budgets", { ...form, amount: Number(form.amount) });
    close();
    month.value = form.month;
    await load();
  } catch (e) {
    error.value = e.response?.data?.message || "Could not save budget.";
  }
}
async function remove(b) {
  if (!confirm(`Delete ${b.category} budget?`)) return;
  try {
    await api.delete(`/budgets/${b._id}`);
    await load();
  } catch (e) {
    error.value = e.response?.data?.message || "Could not delete budget.";
  }
}
onMounted(load);
</script>

<style scoped>
.module-page {
  max-width: 1180px;
  margin: auto;
  padding: 34px 30px 50px;
}
.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 22px;
}
.eyebrow {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin-bottom: 5px;
}
h1 {
  font-size: 2rem;
  font-weight: 800;
}
.page-heading p:not(.eyebrow) {
  color: var(--app-text-muted);
  margin-top: 6px;
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
  cursor: pointer;
}
.primary {
  background: var(--accent);
  color: #fff;
}
.secondary {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--app-text);
}
.controls {
  padding: 14px;
  margin-bottom: 18px;
}
.controls label,
.modal label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--app-text-muted);
}
.controls input,
.modal input,
.modal select {
  height: 42px;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  background: var(--input-bg);
  color: var(--app-text);
  padding: 0 11px;
}
.budget-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}
.budget-card {
  padding: 22px;
}
.top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.label {
  font-size: 0.75rem;
  color: var(--app-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.budget-card h2 {
  font-size: 1.7rem;
  margin-top: 5px;
}
.budget-card small {
  color: var(--app-text-muted);
}
.actions {
  display: flex;
  gap: 5px;
}
.actions button,
.modal-head button {
  border: 0;
  background: transparent;
  color: var(--app-text-muted);
  cursor: pointer;
}
.actions .danger {
  color: var(--danger);
}
.track {
  height: 9px;
  background: var(--input-bg);
  border-radius: 99px;
  margin: 22px 0 9px;
  overflow: hidden;
}
.fill {
  height: 100%;
  background: var(--accent);
  border-radius: 99px;
}
.fill.over {
  background: var(--danger);
}
.bottom {
  display: flex;
  justify-content: space-between;
  color: var(--app-text-muted);
  font-size: 0.8rem;
}
.bottom strong {
  color: var(--app-text);
}
.alert {
  margin-top: 13px;
  padding: 10px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  font-size: 0.78rem;
}
.empty {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  color: var(--app-text-muted);
}
.empty strong {
  color: var(--app-text);
}
.error {
  color: var(--danger);
  margin-bottom: 12px;
}
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(2, 6, 23, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal {
  width: min(100%, 480px);
  padding: 26px;
  background: var(--modal-bg);
}
.modal-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.modal-head h2 {
  font-size: 1.4rem;
}
.modal label {
  margin-bottom: 14px;
}
.hint {
  font-size: 0.78rem;
  color: var(--app-text-muted);
  margin: -3px 0 14px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
@media (max-width: 800px) {
  .budget-grid {
    grid-template-columns: 1fr;
  }
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
