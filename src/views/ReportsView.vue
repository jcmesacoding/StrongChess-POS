<script setup>
import { ref, computed, onMounted } from "vue";
import salesService from "../services/salesService";

const sales = ref([]);
const startDate = ref("");
const endDate = ref("");

const loadSales = async () => {
  try {
    sales.value = (await salesService.getAll()).data;
  } catch (error) {
    console.error(error);
  }
};

const filteredSales = computed(() => {
  return sales.value.filter(sale => {
    if (!startDate.value && !endDate.value) return true;
    const date = sale.saleDate.split("T")[0];
    return (!startDate.value || date >= startDate.value) &&
            (!endDate.value || date <= endDate.value);
  });
});

const totalRevenue = computed(() =>
  filteredSales.value.reduce((total, sale) => total + sale.total, 0)
);

const averageSale = computed(() =>
  filteredSales.value.length === 0 ? 0 : totalRevenue.value / filteredSales.value.length
);

onMounted(loadSales);
</script>

<template>
  <div class="space-y-4 lg:space-y-6">

    <!-- Header -->
    <div>
      <h1 class="text-2xl lg:text-3xl font-bold text-[#213141]">Reports</h1>
      <p class="text-gray-600 text-sm lg:text-base">Sales analytics</p>
    </div>

    <!-- Date filters -->
    <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1">
          <label class="block text-sm text-gray-500 mb-1">Start Date</label>
          <input v-model="startDate" type="date" class="w-full border rounded-xl px-4 py-2 text-sm" />
        </div>
        <div class="flex-1">
          <label class="block text-sm text-gray-500 mb-1">End Date</label>
          <input v-model="endDate" type="date" class="w-full border rounded-xl px-4 py-2 text-sm" />
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-5">
      <div class="bg-white p-4 lg:p-5 rounded-xl shadow-sm flex sm:block justify-between items-center">
        <p class="text-gray-500 text-sm">Revenue</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-[#213141]">${{ totalRevenue.toFixed(2) }}</h2>
      </div>
      <div class="bg-white p-4 lg:p-5 rounded-xl shadow-sm flex sm:block justify-between items-center">
        <p class="text-gray-500 text-sm">Sales</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-[#213141]">{{ filteredSales.length }}</h2>
      </div>
      <div class="bg-white p-4 lg:p-5 rounded-xl shadow-sm flex sm:block justify-between items-center">
        <p class="text-gray-500 text-sm">Average</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-[#213141]">${{ averageSale.toFixed(2) }}</h2>
      </div>
    </div>

    <!-- Tabla desktop -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b" style="background-color:#bef1dd;">
        <h2 class="font-semibold text-[#213141]">Sales Detail</h2>
      </div>
      <table class="w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left p-4">Invoice</th>
            <th class="text-left p-4">Customer</th>
            <th class="text-left p-4">Employee</th>
            <th class="text-left p-4">Total</th>
            <th class="text-left p-4">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in filteredSales" :key="sale.id" class="border-b hover:bg-gray-50">
            <td class="p-4">{{ sale.voucherNumber }}</td>
            <td class="p-4">{{ sale.customerName }}</td>
            <td class="p-4">{{ sale.employeeName }}</td>
            <td class="p-4">${{ sale.total }}</td>
            <td class="p-4">{{ sale.saleDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cards móvil -->
    <div class="lg:hidden space-y-3">
      <div class="px-1 py-2">
        <h2 class="font-semibold text-[#213141]">Sales Detail</h2>
      </div>
      <div v-for="sale in filteredSales" :key="sale.id"
        class="bg-white rounded-xl shadow-sm p-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <p class="font-semibold text-[#213141]">{{ sale.customerName }}</p>
            <p class="text-xs text-gray-500">Invoice #{{ sale.voucherNumber }}</p>
          </div>
          <p class="font-bold text-[#213141]">${{ sale.total }}</p>
        </div>
        <div class="flex justify-between text-sm text-gray-500">
          <span>{{ sale.employeeName }}</span>
          <span>{{ sale.saleDate }}</span>
        </div>
      </div>

      <div v-if="filteredSales.length === 0" class="text-center py-6 text-gray-500 text-sm">
        No sales found
      </div>
    </div>

  </div>
</template>