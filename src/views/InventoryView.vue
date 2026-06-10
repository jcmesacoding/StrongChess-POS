<script setup>

import { ref, onMounted, computed } from 'vue'
import productService from '../services/productService'
import inventoryMovementService from '../services/inventoryMovementService'
import InventoryMovementModal from '../components/InventoryMovementModal.vue'

const products = ref([])
const search = ref("")
const statusFilter = ref("All")
const movements = ref([]);
const showMovementModal = ref(false);
const movementType = ref("ENTRY");

const entryForm = ref({
  productId: null,
  quantity: 1,
  notes: ""
});

const openMovementModal = (type) => {
  movementType.value = type;

  showMovementModal.value = true;
};

const saveMovement = async (data) => {

  try {

    if (data.type === "ENTRY") {

      await inventoryMovementService
        .registerEntry(data);

    }

    if (data.type === "OUTPUT") {

      await inventoryMovementService
        .registerOutput(data);

    }

    if (data.type === "ADJUSTMENT") {

      await inventoryMovementService
        .registerAdjustment(data);

    }

    showMovementModal.value = false;

    await loadProducts();
    await loadMovements();

  } catch (error) {

    console.error(error);

  }
};

const loadProducts = async () => {
  try {
    const response = await productService.getAll()
    products.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const loadMovements = async () => {

  try {

    const response =
      await inventoryMovementService.findAll();

    movements.value = response.data;

  } catch (error) {

    console.error(
      "Error loading movements",
      error
    );

  }

};

onMounted(async () => {

  await loadProducts();

  await loadMovements();

});

const totalStock = computed(() =>
  products.value.reduce(
    (total, product) =>
      total + (product.currentStock || 0),
    0
  )
)

const lowStock = computed(() =>
  products.value.filter(
    product =>
      product.currentStock > 0 &&
      product.currentStock <= product.minStock
  ).length
)

const outOfStock = computed(() =>
  products.value.filter(
    product => product.currentStock === 0
  ).length
)

const filteredProducts = computed(() => {

  return products.value.filter(product => {

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.value.toLowerCase())

    let matchesStatus = true

    if (statusFilter.value === "Low Stock") {
      matchesStatus =
        product.currentStock > 0 &&
        product.currentStock <= product.minStock
    }

    if (statusFilter.value === "Out of Stock") {
      matchesStatus =
        product.currentStock === 0
    }

    if (statusFilter.value === "In Stock") {
      matchesStatus =
        product.currentStock > product.minStock
    }

    return matchesSearch && matchesStatus

  })

})

const formatDate = (date) => {

  return new Date(date)
    .toLocaleString();

};

</script>



<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">

      <div>
        <h1 class="text-3xl font-bold text-[#213141]">
          Inventory
        </h1>

        <p class="text-gray-600">
          Manage stock levels and inventory movements
        </p>
      </div>

      <div class="flex gap-3">

        <button @click="openMovementModal('ENTRY')" class="px-5 py-3 rounded-xl text-white font-medium"
          style="background-color: #213141;">
          + Stock Entry
        </button>

        <button @click="openMovementModal('OUTPUT')" class="px-5 py-3 rounded-xl text-white"
          style="background-color:#a22111">
          - Stock Output
        </button>

        <button @click="openMovementModal('ADJUSTMENT')" class="px-5 py-3 rounded-xl font-medium border" style="
            background-color: #bef1dd;
            border-color: #21314130;
            color: #213141;
          ">
          Stock Adjustment
        </button>

      </div>

    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-6">

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">Units in Stock</p>
        <h2 class="text-3xl font-bold text-[#213141]">
          {{ totalStock }}
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">Low Stock</p>
        <h2 class="text-3xl font-bold text-orange-500">
          {{ lowStock }}
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">Out of Stock</p>
        <h2 class="text-3xl font-bold text-red-500">
          {{ outOfStock }}
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">Movements Today</p>
        <h2 class="text-3xl font-bold text-green-600">
          28
        </h2>
      </div>

    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl shadow-sm p-5">

      <div class="flex gap-4">

        <input v-model="search" type="text" placeholder="Search product..."
          class="flex-1 border rounded-lg px-4 py-2" />

        <select v-model="statusFilter" class="border rounded-lg px-4 py-2">
          <option>All</option>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>

      </div>

    </div>

    <!-- Current Inventory -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">

      <div class="px-6 py-4 border-b" style="background-color: #bef1dd;">
        <h2 class="font-semibold text-[#213141]">
          Current Inventory
        </h2>
      </div>

      <table class="w-full">

        <thead>
          <tr class="border-b">

            <th class="text-left px-6 py-4">
              Product
            </th>

            <th class="text-left px-6 py-4">
              SKU
            </th>

            <th class="text-left px-6 py-4">
              Current Stock
            </th>

            <th class="text-left px-6 py-4">
              Min Stock
            </th>

            <th class="text-left px-6 py-4">
              Status
            </th>

          </tr>
        </thead>

        <tbody>

          <tr v-for="product in filteredProducts" :key="product.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4">
              {{ product.name }}
            </td>

            <td class="px-6 py-4">
              {{ product.id }}
            </td>

            <td class="px-6 py-4">
              {{ product.currentStock }}
            </td>

            <td class="px-6 py-4">
              {{ product.minStock }}
            </td>

            <td class="px-6 py-4">

              <span v-if="product.currentStock === 0" class="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                Out of Stock
              </span>

              <span v-else-if="product.currentStock <= product.minStock"
                class="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                Low Stock
              </span>

              <span v-else class="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                In Stock
              </span>

            </td>
          </tr>

        </tbody>

      </table>

    </div>

    <!-- Recent Movements -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">

      <div class="px-6 py-4 border-b" style="background-color: #bef1dd;">
        <h2 class="font-semibold text-[#213141]">
          Recent Movements
        </h2>
      </div>

      <table class="w-full">

        <thead>
          <tr class="border-b">

            <th class="text-left px-6 py-4">
              Date
            </th>

            <th class="text-left px-6 py-4">
              Product
            </th>

            <th class="text-left px-6 py-4">
              Type
            </th>

            <th class="text-left px-6 py-4">
              Quantity
            </th>

          </tr>
        </thead>
        <tbody>

          <tr v-for="movement in movements" :key="movement.id" class="border-b hover:bg-gray-50">

            <td class="px-6 py-4">
              {{ formatDate(movement.movementDate) }}
            </td>

            <td class="px-6 py-4">
              {{ movement.productName }}
            </td>

            <td class="px-6 py-4">

              <span v-if="movement.type === 'ENTRY'" class="text-green-600 font-medium">
                ENTRY
              </span>

              <span v-else-if="movement.type === 'OUTPUT'" class="text-red-600 font-medium">
                OUTPUT
              </span>

              <span v-else class="text-blue-600 font-medium">
                ADJUSTMENT
              </span>

            </td>

            <td class="px-6 py-4">

              <span v-if="movement.type === 'ENTRY'" class="text-green-600">
                +{{ movement.quantity }}
              </span>

              <span v-else-if="movement.type === 'OUTPUT'" class="text-red-600">
                -{{ movement.quantity }}
              </span>

              <span v-else class="text-blue-600">
                {{ movement.quantity }}
              </span>

            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>

  <!-- Inventory Movement Modal -->
  <InventoryMovementModal 
    :visible="showMovementModal" 
    :type="movementType" 
    :products="products"
      @close="showMovementModal = false" 
      @save="saveMovement" />
</template>