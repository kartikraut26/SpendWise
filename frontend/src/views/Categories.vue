<template>
  <div class="module-page">
    <section class="page-heading"><div><p class="eyebrow">ORGANISE</p><h1>Categories</h1><p>Create categories that match the way you manage money.</p></div><button class="primary" @click="openCreate"><Plus :size="18"/> Add category</button></section>
    <p v-if="error" class="error">{{ error }}</p>
    <div class="columns">
      <section class="glass-surface card"><div class="card-head"><h2>Expense categories</h2><span>{{ expenses.length }}</span></div><div v-for="c in expenses" :key="c._id" class="row"><div class="swatch" :style="{background:c.color}"></div><div class="name"><strong>{{c.name}}</strong><small>{{c.type}}</small></div><div class="row-actions"><button @click="edit(c)">Edit</button><button class="danger" @click="remove(c)">Delete</button></div></div></section>
      <section class="glass-surface card"><div class="card-head"><h2>Income categories</h2><span>{{ incomes.length }}</span></div><div v-for="c in incomes" :key="c._id" class="row"><div class="swatch" :style="{background:c.color}"></div><div class="name"><strong>{{c.name}}</strong><small>{{c.type}}</small></div><div class="row-actions"><button @click="edit(c)">Edit</button><button class="danger" @click="remove(c)">Delete</button></div></div></section>
    </div>

    <div v-if="modalOpen" class="backdrop" @click.self="close">
      <form class="modal glass-surface" @submit.prevent="save"><div class="modal-head"><h2>{{ editing?'Edit category':'New category' }}</h2><button type="button" @click="close"><X/></button></div>
        <label>Name<input v-model="form.name" maxlength="50" required></label>
        <label>Type<select v-model="form.type"><option value="expense">Expense</option><option value="income">Income</option></select></label>
        <label>Color<input v-model="form.color" type="color"></label>
        <p v-if="form.type==='expense'" class="hint">Existing transactions using a renamed category will be updated automatically.</p>
        <div class="modal-actions"><button type="button" class="secondary" @click="close">Cancel</button><button class="primary">{{ editing?'Save changes':'Create category' }}</button></div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import api from '../services/api'
import { useFinanceStore } from '../stores/finance'

const finance=useFinanceStore(), modalOpen=ref(false), editing=ref(null), error=ref('')
const form=reactive({name:'',type:'expense',color:'#6366f1'})
const expenses=computed(()=>finance.categories.filter(c=>c.type==='expense'))
const incomes=computed(()=>finance.categories.filter(c=>c.type==='income'))
async function load(){try{await finance.fetchCategories()}catch(e){error.value=e.response?.data?.message||'Could not load categories.'}}
function openCreate(){editing.value=null;Object.assign(form,{name:'',type:'expense',color:'#6366f1'});modalOpen.value=true;error.value=''}
function edit(c){editing.value=c._id;Object.assign(form,{name:c.name,type:c.type,color:c.color||'#6366f1'});modalOpen.value=true;error.value=''}
function close(){modalOpen.value=false}
async function save(){try{if(editing.value)await api.patch(`/categories/${editing.value}`,form);else await api.post('/categories',form);close();await load()}catch(e){error.value=e.response?.data?.message||'Could not save category.'}}
async function remove(c){if(!confirm(`Delete "${c.name}"? Transactions will become uncategorized.`))return;try{await api.delete(`/categories/${c._id}`);await load()}catch(e){error.value=e.response?.data?.message||'Could not delete category.'}}
onMounted(load)
</script>


<style scoped>
.module-page{max-width:1180px;margin:auto;padding:34px 30px 50px}.page-heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:22px}.eyebrow{font-size:.68rem;font-weight:800;letter-spacing:.1em;color:var(--accent);margin-bottom:5px}h1{font-size:2rem;font-weight:800}.page-heading p:not(.eyebrow){color:var(--app-text-muted);margin-top:6px}.primary,.secondary{border:0;border-radius:11px;min-height:44px;padding:0 16px;font-weight:700;cursor:pointer}.primary{background:var(--accent);color:#fff}.secondary{background:var(--glass-bg);border:1px solid var(--glass-border);color:var(--app-text)}.columns{display:grid;grid-template-columns:1fr 1fr;gap:18px}.card{padding:20px}.card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.card-head h2{font-size:1.05rem;font-weight:800}.card-head span{padding:4px 8px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-weight:800;font-size:.75rem}.row{display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--glass-border)}.row:last-child{border-bottom:0}.swatch{width:12px;height:12px;border-radius:50%;flex:0 0 auto}.name{display:flex;flex-direction:column;gap:2px;flex:1}.name small{color:var(--app-text-muted);text-transform:capitalize}.row-actions{display:flex;gap:8px}.row-actions button{border:0;background:transparent;color:var(--accent);font-weight:700;cursor:pointer}.row-actions .danger{color:var(--danger)}.backdrop{position:fixed;inset:0;z-index:100;background:rgba(2,6,23,.6);display:flex;align-items:center;justify-content:center;padding:20px}.modal{width:min(100%,460px);padding:26px;background:var(--modal-bg)}.modal-head{display:flex;justify-content:space-between;margin-bottom:20px}.modal-head h2{font-size:1.4rem;font-weight:800}.modal-head button{border:0;background:transparent;color:var(--app-text);cursor:pointer}.modal label{display:flex;flex-direction:column;gap:7px;font-size:.8rem;font-weight:700;color:var(--app-text-muted);margin-bottom:14px}.modal input,.modal select{height:44px;padding:0 12px;border:1px solid var(--glass-border);border-radius:10px;background:var(--input-bg);color:var(--app-text)}.modal input[type=color]{padding:3px}.hint{font-size:.78rem;color:var(--app-text-muted);margin-bottom:14px}.modal-actions{display:flex;justify-content:flex-end;gap:8px}.error{color:var(--danger);margin-bottom:12px}@media(max-width:800px){.columns{grid-template-columns:1fr}.page-heading{align-items:flex-start;flex-direction:column}}
</style>
