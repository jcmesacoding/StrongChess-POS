<script setup>
import { ref, onMounted } from "vue";
import dashboardService from "../services/dashboardService";

const dashboardData = ref({
  revenueToday: 0,
  salesToday: 0,
  totalProducts: 0,
  customersToday: 0,
  topProducts: [],
  recentSales: [],
  lowStockProducts: []
});

const loadDashboardData = async () => {
  try {
    dashboardData.value = (await dashboardService.getAll()).data;
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
};

onMounted(() => { loadDashboardData(); });
</script>

<template>
  <div class="space-y-4 lg:space-y-6">

    <!-- Header -->
    <div>
      <h1 class="text-2xl lg:text-3xl font-bold text-[#213141]">Dashboard</h1>
      <p class="text-gray-600 text-sm lg:text-base">Welcome back! Here's what's happening in your business today.</p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">Inventory Value</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-green-600 mt-1 lg:mt-2">
          ${{ dashboardData.inventoryValue }}
        </h2>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">Total Sales</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-[#213141] mt-1 lg:mt-2">
          {{ dashboardData.totalSales }}
        </h2>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">Products</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-[#213141] mt-1 lg:mt-2">
          {{ dashboardData.totalProducts }}
        </h2>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">Customers</p>
        <h2 class="text-2xl lg:text-3xl font-bold text-[#213141] mt-1 lg:mt-2">
          {{ dashboardData.totalCustomers }}
        </h2>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

      <!-- Sales Chart -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <h2 class="font-semibold text-[#213141] mb-4">Sales Overview</h2>
        <div class="h-48 lg:h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-400 text-sm">
          Sales Chart Here
        </div>
      </div>

      <!-- Top Products -->
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <h2 class="font-semibold text-[#213141] mb-4">Top Products</h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center text-sm lg:text-base">
            <span>Wooden Chess Board</span>
            <span class="font-semibold">120</span>
          </div>
          <div class="flex justify-between items-center text-sm lg:text-base">
            <span>Digital Chess Clock</span>
            <span class="font-semibold">89</span>
          </div>
          <div class="flex justify-between items-center text-sm lg:text-base">
            <span>Tournament Set</span>
            <span class="font-semibold">54</span>
          </div>
          <div class="flex justify-between items-center text-sm lg:text-base">
            <span>Chess Pieces Set</span>
            <span class="font-semibold">43</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

      <!-- Recent Sales -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b" style="background-color:#bef1dd;">
          <h2 class="font-semibold text-[#213141]">Recent Sales</h2>
        </div>

        <!-- Tabla desktop -->
        <table class="hidden lg:table w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left px-6 py-4">Invoice</th>
              <th class="text-left px-6 py-4">Customer</th>
              <th class="text-left px-6 py-4">Amount</th>
              <th class="text-left px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="px-6 py-4">INV-1001</td>
              <td class="px-6 py-4">Juan Pérez</td>
              <td class="px-6 py-4">$120</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-green-100 text-green-700">Paid</span>
              </td>
            </tr>
            <tr class="border-b">
              <td class="px-6 py-4">INV-1002</td>
              <td class="px-6 py-4">Ana Gómez</td>
              <td class="px-6 py-4">$75</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-green-100 text-green-700">Paid</span>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4">INV-1003</td>
              <td class="px-6 py-4">Carlos Ruiz</td>
              <td class="px-6 py-4">$45</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">Pending</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Cards móvil -->
        <div class="lg:hidden divide-y">
          <div class="p-4 flex justify-between items-center">
            <div>
              <p class="font-medium text-[#213141]">Juan Pérez</p>
              <p class="text-xs text-gray-500">INV-1001</p>
            </div>
            <div class="text-right">
              <p class="font-bold">$120</p>
              <span class="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Paid</span>
            </div>
          </div>
          <div class="p-4 flex justify-between items-center">
            <div>
              <p class="font-medium text-[#213141]">Ana Gómez</p>
              <p class="text-xs text-gray-500">INV-1002</p>
            </div>
            <div class="text-right">
              <p class="font-bold">$75</p>
              <span class="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Paid</span>
            </div>
          </div>
          <div class="p-4 flex justify-between items-center">
            <div>
              <p class="font-medium text-[#213141]">Carlos Ruiz</p>
              <p class="text-xs text-gray-500">INV-1003</p>
            </div>
            <div class="text-right">
              <p class="font-bold">$45</p>
              <span class="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">Pending</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Low Stock -->
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <h2 class="font-semibold text-[#213141] mb-4">Low Stock Alert</h2>
        <div class="space-y-3">
          <div class="flex justify-between text-sm lg:text-base">
            <span>Digital Chess Clock</span>
            <span class="font-bold text-orange-500">3</span>
          </div>
          <div class="flex justify-between text-sm lg:text-base">
            <span>Tournament Set</span>
            <span class="font-bold text-red-500">1</span>
          </div>
          <div class="flex justify-between text-sm lg:text-base">
            <span>Chess Book</span>
            <span class="font-bold text-orange-500">2</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Product of the Month -->
    <div class="bg-white rounded-xl shadow-sm p-4 lg:p-6">
      <h2 class="font-semibold text-[#213141] mb-3">♟ Product of the Month</h2>
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-lg lg:text-xl font-bold">Wooden Tournament Board</h3>
          <p class="text-gray-500 text-sm">Best-selling product this month</p>
        </div>
        <div class="text-2xl lg:text-3xl font-bold text-[#213141]">120 Sold</div>
      </div>
    </div>

  </div>
</template>