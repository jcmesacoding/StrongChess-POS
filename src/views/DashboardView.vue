<script setup>
import { ref, onMounted } from "vue";
import dashboardService from "../services/dashboardService";
import { Bar, Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const dashboardData = ref({
  totalProducts: 0,
  totalCustomers: 0,
  totalSales: 0,
  inventoryValue: 0,
  topProducts: [],
  recentSales: [],
  lowStockProducts: []
});

const salesByDayChart = ref({ labels: [], datasets: [] });
const salesByMonthChart = ref({ labels: [], datasets: [] });
const topProductsChart = ref({ labels: [], datasets: [] });

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  }
};

const loadDashboardData = async () => {
  try {
    dashboardData.value = (await dashboardService.getAll()).data;
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
};

const loadCharts = async () => {
  try {
    const [dayRes, monthRes, topRes] = await Promise.all([
      dashboardService.getSalesByDay(),
      dashboardService.getSalesByMonth(),
      dashboardService.getTopProducts()
    ]);

    salesByDayChart.value = {
      labels: dayRes.data.map(d => d.day),
      datasets: [{
        label: 'Sales',
        data: dayRes.data.map(d => d.total),
        backgroundColor: '#2D4A5A',
        borderRadius: 6
      }]
    };

    salesByMonthChart.value = {
      labels: monthRes.data.map(d => d.month),
      datasets: [{
        label: 'Revenue',
        data: monthRes.data.map(d => d.total),
        borderColor: '#213141',
        backgroundColor: '#bef1dd',
        tension: 0.4,
        fill: true
      }]
    };

    topProductsChart.value = {
      labels: topRes.data.map(d => d.name),
      datasets: [{
        label: 'Units Sold',
        data: topRes.data.map(d => d.totalSold),
        backgroundColor: [
          '#2D4A5A', '#3d6b82', '#4e8ca9',
          '#bef1dd', '#91e0c0'
        ],
        borderRadius: 6
      }]
    };

  } catch (error) {
    console.error("Error loading charts:", error);
  }
};

onMounted(async () => {
  await loadDashboardData();
  await loadCharts();
});
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
          ${{ dashboardData.inventoryValue?.toFixed(2) ?? '0.00' }}
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

    <!-- Charts Row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

      <!-- Sales by Day -->
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <h2 class="font-semibold text-[#213141] mb-4">Sales Last 7 Days</h2>
        <div class="h-48 lg:h-64">
          <Bar
            v-if="salesByDayChart.labels.length > 0"
            :data="salesByDayChart"
            :options="chartOptions"
          />
          <div v-else class="h-full flex items-center justify-center text-gray-400 text-sm">
            No sales data yet
          </div>
        </div>
      </div>

      <!-- Sales by Month -->
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <h2 class="font-semibold text-[#213141] mb-4">Revenue This Year</h2>
        <div class="h-48 lg:h-64">
          <Line
            v-if="salesByMonthChart.labels.length > 0"
            :data="salesByMonthChart"
            :options="chartOptions"
          />
          <div v-else class="h-full flex items-center justify-center text-gray-400 text-sm">
            No sales data yet
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row 2 + Low Stock -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

      <!-- Top Products -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <h2 class="font-semibold text-[#213141] mb-4">Top Products</h2>
        <div class="h-48 lg:h-64">
          <Bar
            v-if="topProductsChart.labels.length > 0"
            :data="topProductsChart"
            :options="chartOptions"
          />
          <div v-else class="h-full flex items-center justify-center text-gray-400 text-sm">
            No sales data yet
          </div>
        </div>
      </div>

      <!-- Low Stock -->
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <h2 class="font-semibold text-[#213141] mb-4">Low Stock Alert</h2>
        <div v-if="dashboardData.lowStockProducts.length > 0" class="space-y-3">
          <div v-for="product in dashboardData.lowStockProducts" :key="product.id"
            class="flex justify-between text-sm lg:text-base">
            <span>{{ product.name }}</span>
            <span class="font-bold"
              :class="product.currentStock === 0 ? 'text-red-500' : 'text-orange-500'">
              {{ product.currentStock }}
            </span>
          </div>
        </div>
        <div v-else class="text-center py-6 text-gray-400 text-sm">
          All products well stocked
        </div>
      </div>
    </div>

    <!-- Recent Sales -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b" style="background-color:#bef1dd;">
        <h2 class="font-semibold text-[#213141]">Recent Sales</h2>
      </div>
      <table class="hidden lg:table w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left px-6 py-4">Invoice</th>
            <th class="text-left px-6 py-4">Customer</th>
            <th class="text-left px-6 py-4">Amount</th>
            <th class="text-left px-6 py-4">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in dashboardData.recentSales" :key="sale.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4">{{ sale.voucherSerie }}-{{ sale.voucherNumber }}</td>
            <td class="px-6 py-4">{{ sale.customerName }}</td>
            <td class="px-6 py-4">${{ sale.total?.toFixed(2) }}</td>
            <td class="px-6 py-4">{{ sale.saleDate }}</td>
          </tr>
          <tr v-if="dashboardData.recentSales.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-gray-400">No sales yet</td>
          </tr>
        </tbody>
      </table>
      <div class="lg:hidden divide-y">
        <div v-for="sale in dashboardData.recentSales" :key="sale.id"
          class="p-4 flex justify-between items-center">
          <div>
            <p class="font-medium text-[#213141]">{{ sale.customerName }}</p>
            <p class="text-xs text-gray-500">{{ sale.voucherSerie }}-{{ sale.voucherNumber }}</p>
          </div>
          <div class="text-right">
            <p class="font-bold">${{ sale.total?.toFixed(2) }}</p>
            <p class="text-xs text-gray-500">{{ sale.saleDate }}</p>
          </div>
        </div>
        <div v-if="dashboardData.recentSales.length === 0"
          class="p-6 text-center text-gray-400 text-sm">
          No sales yet
        </div>
      </div>
    </div>

  </div>
</template>