<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import productService from '../services/productService'
import inventoryMovementService from '../services/inventoryMovementService'
import InventoryMovementModal from '../components/InventoryMovementModal.vue'

const { t } = useI18n()

const products = ref([])
const search = ref("")
const statusFilter = ref("All")
const movements = ref([])
const showMovementModal = ref(false)
const movementType = ref("ENTRY")

const openMovementModal = (type) => {
  movementType.value = type
  showMovementModal.value = true
}

const saveMovement = async (data) => {
  try {
    if (data.type === "ENTRY") await inventoryMovementService.registerEntry(data)
    if (data.type === "OUTPUT") await inventoryMovementService.registerOutput(data)
    if (data.type === "ADJUSTMENT") await inventoryMovementService.registerAdjustment(data)
    showMovementModal.value = false
    await loadProducts()
    await loadMovements()
  } catch (error) {
    console.error(error)
  }
}

const loadProducts = async () => {
  try {
    products.value = (await productService.getAll()).data
  } catch (error) {
    console.error(error)
  }
}

const loadMovements = async () => {
  try {
    movements.value = (await inventoryMovementService.findAll()).data
  } catch (error) {
    console.error("Error loading movements", error)
  }
}

onMounted(async () => {
  await loadProducts()
  await loadMovements()
})

const totalStock = computed(() =>
  products.value.reduce((total, product) => total + (product.currentStock || 0), 0)
)

const lowStock = computed(() =>
  products.value.filter(p => p.currentStock > 0 && p.currentStock <= p.minStock).length
)

const outOfStock = computed(() =>
  products.value.filter(p => p.currentStock === 0).length
)

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.value.toLowerCase())
    let matchesStatus = true
    if (statusFilter.value === "Low Stock") matchesStatus = product.currentStock > 0 && product.currentStock <= product.minStock
    if (statusFilter.value === "Out of Stock") matchesStatus = product.currentStock === 0
    if (statusFilter.value === "In Stock") matchesStatus = product.currentStock > product.minStock
    return matchesSearch && matchesStatus
  })
})

const formatDate = (date) => new Date(date).toLocaleString()
</script>

<template>
  <div class="space-y-4 lg:space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-[#213141]">{{ $t('inventory.title') }}</h1>
        <p class="text-gray-600 text-sm lg:text-base">{{ $t('inventory.subtitle') }}</p>
      </div>
      <div class="grid grid-cols-2 lg:flex gap-2 lg:gap-3">
        <button @click="openMovementModal('ENTRY')"
          class="px-3 py-2 lg:px-5 lg:py-3 rounded-xl text-white font-medium text-sm lg:text-base"
          style="background-color: #213141;">
          {{ $t('inventory.entry') }}
        </button>
        <button @click="openMovementModal('OUTPUT')"
          class="px-3 py-2 lg:px-5 lg:py-3 rounded-xl text-white text-sm lg:text-base"
          style="background-color:#a22111">
          {{ $t('inventory.output') }}
        </button>
        <button @click="openMovementModal('ADJUSTMENT')"
          class="col-span-2 lg:col-span-1 px-3 py-2 lg:px-5 lg:py-3 rounded-xl font-medium border text-sm lg:text-base"
          style="background-color: #bef1dd; border-color: #21314130; color: #213141;">
          {{ $t('inventory.adjustment') }}
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">{{ $t('inventory.units_in_stock') }}</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-[#213141]">{{ totalStock }}</h2>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">{{ $t('inventory.low_stock') }}</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-orange-500">{{ lowStock }}</h2>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">{{ $t('inventory.out_of_stock') }}</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-red-500">{{ outOfStock }}</h2>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">{{ $t('inventory.movements_today') }}</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-green-600">{{ movements.length }}</h2>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
      <div class="flex flex-col sm:flex-row gap-3">
        <input v-model="search" type="text" :placeholder="$t('inventory.search')"
          class="flex-1 border rounded-lg px-4 py-2 text-sm" />
        <select v-model="statusFilter" class="border rounded-lg px-4 py-2 text-sm">
          <option value="All">{{ $t('debts.all_status') }}</option>
          <option value="In Stock">{{ $t('inventory.in_stock') }}</option>
          <option value="Low Stock">{{ $t('inventory.low_stock') }}</option>
          <option value="Out of Stock">{{ $t('inventory.out_of_stock') }}</option>
        </select>
      </div>
    </div>

    <!-- Current Inventory -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b" style="background-color: #bef1dd;">
        <h2 class="font-semibold text-[#213141]">{{ $t('inventory.current_inventory') }}</h2>
      </div>

      <!-- Tabla desktop -->
      <table class="hidden lg:table w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left px-6 py-4">{{ $t('inventory.product') }}</th>
            <th class="text-left px-6 py-4">{{ $t('products.sku') }}</th>
            <th class="text-left px-6 py-4">{{ $t('inventory.current_stock') }}</th>
            <th class="text-left px-6 py-4">{{ $t('inventory.min_stock') }}</th>
            <th class="text-left px-6 py-4">{{ $t('common.status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4">{{ product.name }}</td>
            <td class="px-6 py-4">{{ product.id }}</td>
            <td class="px-6 py-4">{{ product.currentStock }}</td>
            <td class="px-6 py-4">{{ product.minStock }}</td>
            <td class="px-6 py-4">
              <span v-if="product.currentStock === 0"
                class="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                {{ $t('inventory.out_of_stock') }}
              </span>
              <span v-else-if="product.currentStock <= product.minStock"
                class="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                {{ $t('inventory.low_stock') }}
              </span>
              <span v-else
                class="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                {{ $t('inventory.in_stock') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Cards móvil -->
      <div class="lg:hidden divide-y">
        <div v-for="product in filteredProducts" :key="product.id" class="p-4">
          <div class="flex justify-between items-start mb-1">
            <p class="font-semibold text-[#213141]">{{ product.name }}</p>
            <span v-if="product.currentStock === 0"
              class="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
              {{ $t('inventory.out_of_stock') }}
            </span>
            <span v-else-if="product.currentStock <= product.minStock"
              class="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
              {{ $t('inventory.low_stock') }}
            </span>
            <span v-else
              class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
              {{ $t('inventory.in_stock') }}
            </span>
          </div>
          <div class="flex gap-4 text-sm text-gray-600">
            <span>{{ $t('inventory.current_stock') }}: <strong>{{ product.currentStock }}</strong></span>
            <span>{{ $t('inventory.min_stock') }}: <strong>{{ product.minStock }}</strong></span>
            <span>SKU: <strong>{{ product.id }}</strong></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Movements -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b" style="background-color: #bef1dd;">
        <h2 class="font-semibold text-[#213141]">{{ $t('inventory.recent_movements') }}</h2>
      </div>

      <!-- Tabla desktop -->
      <table class="hidden lg:table w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left px-6 py-4">{{ $t('inventory.date') }}</th>
            <th class="text-left px-6 py-4">{{ $t('inventory.product') }}</th>
            <th class="text-left px-6 py-4">{{ $t('inventory.type') }}</th>
            <th class="text-left px-6 py-4">{{ $t('inventory.quantity') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movement in movements" :key="movement.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4">{{ formatDate(movement.movementDate) }}</td>
            <td class="px-6 py-4">{{ movement.productName }}</td>
            <td class="px-6 py-4">
              <span v-if="movement.type === 'ENTRY'" class="text-green-600 font-medium">ENTRY</span>
              <span v-else-if="movement.type === 'OUTPUT'" class="text-red-600 font-medium">OUTPUT</span>
              <span v-else class="text-blue-600 font-medium">ADJUSTMENT</span>
            </td>
            <td class="px-6 py-4">
              <span v-if="movement.type === 'ENTRY'" class="text-green-600">+{{ movement.quantity }}</span>
              <span v-else-if="movement.type === 'OUTPUT'" class="text-red-600">-{{ movement.quantity }}</span>
              <span v-else class="text-blue-600">{{ movement.quantity }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Cards móvil -->
      <div class="lg:hidden divide-y">
        <div v-for="movement in movements" :key="movement.id" class="p-4">
          <div class="flex justify-between items-start mb-1">
            <p class="font-semibold text-[#213141]">{{ movement.productName }}</p>
            <span v-if="movement.type === 'ENTRY'" class="text-green-600 font-medium text-sm">+{{ movement.quantity }}</span>
            <span v-else-if="movement.type === 'OUTPUT'" class="text-red-600 font-medium text-sm">-{{ movement.quantity }}</span>
            <span v-else class="text-blue-600 font-medium text-sm">{{ movement.quantity }}</span>
          </div>
          <div class="flex justify-between text-sm text-gray-500">
            <span v-if="movement.type === 'ENTRY'" class="text-green-600">ENTRY</span>
            <span v-else-if="movement.type === 'OUTPUT'" class="text-red-600">OUTPUT</span>
            <span v-else class="text-blue-600">ADJUSTMENT</span>
            <span>{{ formatDate(movement.movementDate) }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>

  <InventoryMovementModal
    :visible="showMovementModal"
    :type="movementType"
    :products="products"
    @close="showMovementModal = false"
    @save="saveMovement" />
</template>