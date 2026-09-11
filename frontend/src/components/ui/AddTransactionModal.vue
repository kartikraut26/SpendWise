<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-backdrop"
        @click.self="close"
      >
        <div class="transaction-modal">

          <div class="modal-header">
            <div>
              <p class="eyebrow">
                QUICK ACTION
              </p>

              <h2>
                Add Transaction
              </h2>
            </div>

            <button
              type="button"
              class="icon-button"
              @click="close"
            >
              <X :size="20" />
            </button>
          </div>

          <form @submit.prevent="submit">

            <div class="type-switch">
              <button
                type="button"
                :class="{ active: form.type === 'expense' }"
                @click="form.type = 'expense'"
              >
                <ArrowDownRight :size="17" />
                Expense
              </button>

              <button
                type="button"
                :class="{ active: form.type === 'income' }"
                @click="form.type = 'income'"
              >
                <ArrowUpRight :size="17" />
                Income
              </button>
            </div>

            <label>
              Amount

              <div class="amount-input">
                <span>₹</span>

                <input
                  v-model.number="form.amount"
                  type="number"
                  min="1"
                  placeholder="0.00"
                  required
                />
              </div>
            </label>

            <div class="form-grid">

              <label>
                Title

                <input
                  v-model="form.title"
                  type="text"
                  placeholder="e.g. Grocery"
                  required
                />
              </label>

              <label>
                Category

                <select
                  v-model="form.category"
                  required
                >
                  <option
                    v-for="category in categories"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
              </label>

            </div>

            <label>
              Date

              <div class="input-with-icon">
                <CalendarDays :size="17" />

                <input
                  v-model="form.date"
                  type="date"
                  required
                />
              </div>
            </label>

            <label>
              Description

              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Optional note..."
              ></textarea>
            </label>

            <div class="modal-actions">
              <button
                type="button"
                class="secondary-button"
                @click="close"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="primary-button"
              >
                <Plus :size="18" />
                Add Transaction
              </button>
            </div>

          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, reactive } from 'vue'
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Plus,
  X
} from 'lucide-vue-next'

const props = defineProps({
  open: { type: Boolean, default: false },
  categories: { type: Array, default: () => [] }
})

const emit = defineEmits([
  'close',
  'submit'
])

const fallbackCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other', 'Salary']
const categories = computed(() => {
  const source = props.categories.length ? props.categories : fallbackCategories.map(name => ({ name }))
  return source.filter(category => category.type ? category.type === form.type : true)
})

const form = reactive({
  type: 'expense',
  amount: '',
  title: '',
  category: 'Food',
  date: new Date().toISOString().slice(0, 10),
  description: ''
})

function close() {
  emit('close')
}

function submit() {
  emit('submit', {
    ...form,
    amount: Number(form.amount),
    icon: form.category === 'Food'
      ? 'food'
      : form.category === 'Transport'
        ? 'transport'
        : 'receipt'
  })

  form.type = 'expense'
  form.amount = ''
  form.title = ''
  form.category = 'Food'
  form.date = new Date().toISOString().slice(0, 10)
  form.description = ''
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(2, 6, 23, 0.6);

  backdrop-filter: blur(8px);
}

.transaction-modal {
  width: min(100%, 520px);
  max-height: calc(100vh - 40px);
  overflow-y: auto;

  padding: 28px;

  border: 1px solid var(--glass-border);
  border-radius: 24px;

  background: var(--modal-bg);
  color: var(--app-text);

  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  margin-bottom: 24px;
}

.eyebrow {
  margin-bottom: 5px;

  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;

  color: var(--accent);
}

.modal-header h2 {
  font-size: 1.45rem;
  font-weight: 800;
}

.icon-button {
  display: grid;
  place-items: center;

  width: 38px;
  height: 38px;

  border: 1px solid var(--glass-border);
  border-radius: 10px;

  background: var(--glass-bg);
  color: var(--app-text);

  cursor: pointer;
}

form {
  display: flex;
  flex-direction: column;
  gap: 17px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 7px;

  font-size: 0.8rem;
  font-weight: 700;

  color: var(--app-text-muted);
}

input,
select,
textarea {
  width: 100%;

  border: 1px solid var(--glass-border);
  border-radius: 11px;

  background: var(--input-bg);
  color: var(--app-text);

  outline: none;

  transition: border-color 0.2s ease;
}

input,
select {
  height: 44px;
  padding: 0 13px;
}

textarea {
  padding: 12px 13px;
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--accent);
}

.amount-input {
  display: flex;
  align-items: center;

  height: 58px;

  padding: 0 15px;

  border: 1px solid var(--glass-border);
  border-radius: 13px;

  background: var(--input-bg);
}

.amount-input span {
  margin-right: 8px;

  font-size: 1.25rem;
  font-weight: 800;
}

.amount-input input {
  height: 100%;
  padding: 0;

  border: 0;
  background: transparent;

  font-size: 1.35rem;
  font-weight: 700;
}

.amount-input input:focus {
  border: 0;
}

.type-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  padding: 5px;

  border-radius: 13px;

  background: var(--input-bg);
}

.type-switch button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  height: 40px;

  border: 0;
  border-radius: 9px;

  background: transparent;
  color: var(--app-text-muted);

  font-weight: 700;

  cursor: pointer;
}

.type-switch button.active {
  background: var(--accent);
  color: white;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.input-with-icon {
  position: relative;
}

.input-with-icon svg {
  position: absolute;
  left: 13px;
  top: 13px;

  color: var(--app-text-muted);
}

.input-with-icon input {
  padding-left: 40px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  margin-top: 8px;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  min-height: 44px;

  padding: 0 16px;

  border-radius: 11px;

  font-weight: 700;

  cursor: pointer;
}

.primary-button {
  border: 0;

  background: var(--accent);
  color: white;
}

.secondary-button {
  border: 1px solid var(--glass-border);

  background: var(--glass-bg);
  color: var(--app-text);
}

@media (max-width: 560px) {
  .transaction-modal {
    padding: 21px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>