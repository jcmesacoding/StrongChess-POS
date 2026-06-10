<template>
  <div class="space-y-6">

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-[#213141]">
        Reports
      </h1>

      <p class="text-gray-600">
        Business performance and analytics
      </p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm p-5">

      <div class="flex gap-4">

        <select class="border rounded-lg px-4 py-2">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>

        <button class="px-5 py-2 rounded-lg text-white" style="background-color:#213141;">
          Generate Report
        </button>

      </div>

    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-4 gap-6">

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">
          Total Revenue
        </p>

        <h2 class="text-3xl font-bold text-green-600">
          $25,420
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">
          Total Orders
        </p>

        <h2 class="text-3xl font-bold text-[#213141]">
          342
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">
          Average Ticket
        </p>

        <h2 class="text-3xl font-bold text-blue-600">
          $74
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">
          Profit
        </p>

        <h2 class="text-3xl font-bold text-amber-600">
          $8,950
        </h2>
      </div>

    </div>

    <!-- Charts -->
    <div class="grid grid-cols-3 gap-6">

      <!-- Revenue Chart -->
      <div class="col-span-2 bg-white rounded-xl shadow-sm p-6 h-96">

        <h2 class="font-semibold mb-4 text-[#213141]">
          Revenue Overview
        </h2>

        <div class="h-72 flex items-center justify-center text-gray-400">
          Revenue Chart Here
        </div>

      </div>

      <!-- Best Sellers -->
      <div class="bg-white rounded-xl shadow-sm p-6">

        <h2 class="font-semibold mb-4 text-[#213141]">
          Best Sellers
        </h2>

        <div class="space-y-4">

          <div class="flex justify-between">
            <span>Wooden Chess Board</span>
            <span class="font-semibold">
              120
            </span>
          </div>

          <div class="flex justify-between">
            <span>Digital Chess Clock</span>
            <span class="font-semibold">
              89
            </span>
          </div>

          <div class="flex justify-between">
            <span>Tournament Set</span>
            <span class="font-semibold">
              54
            </span>
          </div>

        </div>

      </div>

    </div>

    <!-- Detailed Report -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">

      <div class="px-6 py-4 border-b" style="background-color:#bef1dd;">
        <h2 class="font-semibold text-[#213141]">
          Sales Summary
        </h2>
      </div>

      <table class="w-full">

        <thead>
          <tr class="border-b">

            <th class="text-left px-6 py-4">
              Date
            </th>

            <th class="text-left px-6 py-4">
              Orders
            </th>

            <th class="text-left px-6 py-4">
              Revenue
            </th>

            <th class="text-left px-6 py-4">
              Profit
            </th>

          </tr>
        </thead>

        <tbody>

          <tr class="border-b">
            <td class="px-6 py-4">
              2026-06-01
            </td>

            <td class="px-6 py-4">
              35
            </td>

            <td class="px-6 py-4">
              $2,350
            </td>

            <td class="px-6 py-4">
              $820
            </td>
          </tr>

          <tr class="border-b">
            <td class="px-6 py-4">
              2026-06-02
            </td>

            <td class="px-6 py-4">
              42
            </td>

            <td class="px-6 py-4">
              $3,120
            </td>

            <td class="px-6 py-4">
              $1,040
            </td>
          </tr>

        </tbody>

      </table>

    </div>

  </div>
</template>