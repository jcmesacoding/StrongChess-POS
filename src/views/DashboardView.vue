<script setup>
import { ref, computed, onMounted } from "vue";
import customerService from "../services/customerService";
import salesService from "../services/salesService";
import productService from "../services/productService";
import ToastNotification from "../components/ToastNotification.vue";
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
    const response = await dashboardService.getAll();
    dashboardData.value = response.data;
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
};

onMounted(() => {
  loadDashboardData();
});

const triggerToast = (message, type = "success") => {
  // Implement your toast notification logic here
  // For example, you can use a global event bus or a state management solution
  console.log(`Toast: ${message} (${type})`);
};




</script>


<template>
  <div class="space-y-6">

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-[#213141]">
        Dashboard
      </h1>

      <p class="text-gray-600">
        Welcome back! Here's what's happening in your business today.
      </p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-4 gap-6">

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">
          Inventory Value
        </p>

        <h2 class="text-3xl font-bold text-green-600 mt-2">
          ${{ dashboardData.inventoryValue }}
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">
          Total Sales
        </p>

        <h2 class="text-3xl font-bold text-[#213141] mt-2">
          {{ dashboardData.totalSales }}
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">
          Products
        </p>

        <h2 class="text-3xl font-bold text-[#213141] mt-2">
          {{ dashboardData.totalProducts }}
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">
          Customers
        </p>

        <h2 class="text-3xl font-bold text-[#213141] mt-2">
          {{ dashboardData.totalCustomers }}
        </h2>
      </div>

    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-3 gap-6">

      <!-- Sales Chart -->
      <div class="col-span-2 bg-white rounded-xl shadow-sm p-6">

        <h2 class="font-semibold text-[#213141] mb-4">
          Sales Overview
        </h2>

        <div
          class="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-400">
          Sales Chart Here
        </div>

      </div>

      <!-- Top Products -->
      <div class="bg-white rounded-xl shadow-sm p-6">

        <h2 class="font-semibold text-[#213141] mb-5">
          Top Products
        </h2>

        <div class="space-y-4">

          <div class="flex justify-between items-center">
            <span>Wooden Chess Board</span>
            <span class="font-semibold">
              120
            </span>
          </div>

          <div class="flex justify-between items-center">
            <span>Digital Chess Clock</span>
            <span class="font-semibold">
              89
            </span>
          </div>

          <div class="flex justify-between items-center">
            <span>Tournament Set</span>
            <span class="font-semibold">
              54
            </span>
          </div>

          <div class="flex justify-between items-center">
            <span>Chess Pieces Set</span>
            <span class="font-semibold">
              43
            </span>
          </div>

        </div>

      </div>

    </div>

    <!-- Bottom Section -->
    <div class="grid grid-cols-3 gap-6">

      <!-- Recent Sales -->
      <div class="col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">

        <div class="px-6 py-4 border-b" style="background-color:#bef1dd;">
          <h2 class="font-semibold text-[#213141]">
            Recent Sales
          </h2>
        </div>

        <table class="w-full">

          <thead>
            <tr class="border-b">

              <th class="text-left px-6 py-4">
                Invoice
              </th>

              <th class="text-left px-6 py-4">
                Customer
              </th>

              <th class="text-left px-6 py-4">
                Amount
              </th>

              <th class="text-left px-6 py-4">
                Status
              </th>

            </tr>
          </thead>

          <tbody>

            <tr class="border-b">
              <td class="px-6 py-4">
                INV-1001
              </td>

              <td class="px-6 py-4">
                Juan Pérez
              </td>

              <td class="px-6 py-4">
                $120
              </td>

              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-green-100 text-green-700">
                  Paid
                </span>
              </td>
            </tr>

            <tr class="border-b">
              <td class="px-6 py-4">
                INV-1002
              </td>

              <td class="px-6 py-4">
                Ana Gómez
              </td>

              <td class="px-6 py-4">
                $75
              </td>

              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-green-100 text-green-700">
                  Paid
                </span>
              </td>
            </tr>

            <tr>
              <td class="px-6 py-4">
                INV-1003
              </td>

              <td class="px-6 py-4">
                Carlos Ruiz
              </td>

              <td class="px-6 py-4">
                $45
              </td>

              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                  Pending
                </span>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

      <!-- Low Stock -->
      <div class="bg-white rounded-xl shadow-sm p-6">

        <h2 class="font-semibold text-[#213141] mb-5">
          Low Stock Alert
        </h2>

        <div class="space-y-4">

          <div class="flex justify-between">
            <span>
              Digital Chess Clock
            </span>

            <span class="font-bold text-orange-500">
              3
            </span>
          </div>

          <div class="flex justify-between">
            <span>
              Tournament Set
            </span>

            <span class="font-bold text-red-500">
              1
            </span>
          </div>

          <div class="flex justify-between">
            <span>
              Chess Book
            </span>

            <span class="font-bold text-orange-500">
              2
            </span>
          </div>

        </div>

      </div>

    </div>

    <!-- Special StrongChess Card -->
    <div class="bg-white rounded-xl shadow-sm p-6">

      <h2 class="font-semibold text-[#213141] mb-3">
        ♟ Product of the Month
      </h2>

      <div class="flex justify-between items-center">

        <div>
          <h3 class="text-xl font-bold">
            Wooden Tournament Board
          </h3>

          <p class="text-gray-500">
            Best-selling product this month
          </p>
        </div>

        <div class="text-3xl font-bold text-[#213141]">
          120 Sold
        </div>

      </div>

    </div>

  </div>
</template>