<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const emit = defineEmits(['close'])
const router = useRouter()
const isAdmin = computed(() => localStorage.getItem('role') === 'ADMIN')

const navigate = (path) => {
  router.push(path)
  emit('close')
}
</script>

<template>
  <aside class="w-72 lg:w-80 h-full" style="background-color: #2D4A5A; color: #ffffff;">

    <div class="h-16 flex items-center justify-between px-6 border-b">
      <h1 class="text-base font-semibold" style="color: #bcf7d9;">
        ♜ Strongchess POS
      </h1>
      <!-- Botón cerrar solo en móvil -->
      <button class="lg:hidden text-white text-xl hover:opacity-70" @click="emit('close')">
        ✕
      </button>
    </div>

    <nav class="p-4 space-y-2">

      <button @click="navigate('/')"
        class="w-full text-left p-3 rounded-lg hover:bg-slate-100 hover:text-black transition">
        {{ $t('nav.dashboard') }}
      </button>

      <button @click="navigate('/products')"
        class="w-full text-left p-3 rounded-lg hover:bg-slate-100 hover:text-black transition">
        {{ $t('nav.products') }}
      </button>

      <button @click="navigate('/inventory')"
        class="w-full text-left p-3 rounded-lg hover:bg-slate-100 hover:text-black transition">
        {{ $t('nav.inventory') }}
      </button>

      <button @click="navigate('/sales')"
        class="w-full text-left p-3 rounded-lg hover:bg-slate-100 hover:text-black transition">
        {{ $t('nav.sales') }}
      </button>

      <button @click="navigate('/customers')"
        class="w-full text-left p-3 rounded-lg hover:bg-slate-100 hover:text-black transition">
        {{ $t('nav.customers') }}
      </button>

      <button @click="navigate('/debts')"
        class="w-full text-left p-3 rounded-lg hover:bg-slate-100 hover:text-black transition">
        {{ $t('nav.debts') }}
      </button>

      <button @click="navigate('/reports')"
        class="w-full text-left p-3 rounded-lg hover:bg-slate-100 hover:text-black transition">
        {{ $t('nav.reports') }}
      </button>

      <button v-if="isAdmin" @click="navigate('/users')"
        class="w-full text-left p-3 rounded-lg hover:bg-slate-100 hover:text-black transition">
        {{ $t('nav.users') }}
      </button>
    </nav>

  </aside>
</template>