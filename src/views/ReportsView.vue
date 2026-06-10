<script setup>
import {
  ref,
  computed,
  onMounted
} from "vue";

import salesService
from "../services/salesService";

const sales = ref([]);

const startDate =
ref("");

const endDate =
ref("");

const loadSales =
async () => {

  try {

    const response =
      await salesService.getAll();

    sales.value =
      response.data;

  }

  catch(error){

    console.error(error);

  }

};

const filteredSales =
computed(() => {

  return sales.value.filter(
    sale => {

      if (
        !startDate.value &&
        !endDate.value
      )
        return true;

      const date =
        sale.saleDate
          .split("T")[0];

      return (
        (!startDate.value ||
          date >= startDate.value)
        &&
        (!endDate.value ||
          date <= endDate.value)
      );

    }
  );

});

const totalRevenue =
computed(() => {

  return filteredSales.value
    .reduce(
      (
        total,
        sale
      ) =>
        total +
        sale.total,
      0
    );

});

const averageSale =
computed(() => {

  if (
    filteredSales.value
      .length === 0
  )
    return 0;

  return (
    totalRevenue.value
    /
    filteredSales.value
      .length
  );

});

onMounted(
  loadSales
);
</script>

<template>

<div class="space-y-6">

<div>

<h1
class="text-3xl font-bold text-[#213141]"
>
Reports
</h1>

<p class="text-gray-600">
Sales analytics
</p>

</div>

<div class="flex gap-4">

<input
v-model="startDate"
type="date"
class="border rounded-xl px-4 py-2"
/>

<input
v-model="endDate"
type="date"
class="border rounded-xl px-4 py-2"
/>

</div>

<div
class="grid grid-cols-3 gap-5"
>

<div
class="bg-white p-5 rounded-xl shadow"
>

<p>
Revenue
</p>

<h2
class="text-3xl font-bold"
>
${{
totalRevenue.toFixed(2)
}}
</h2>

</div>

<div
class="bg-white p-5 rounded-xl shadow"
>

<p>
Sales
</p>

<h2
class="text-3xl font-bold"
>
{{
filteredSales.length
}}
</h2>

</div>

<div
class="bg-white p-5 rounded-xl shadow"
>

<p>
Average
</p>

<h2
class="text-3xl font-bold"
>
${{
averageSale.toFixed(2)
}}
</h2>

</div>

</div>

<div
class="bg-white rounded-xl shadow"
>

<table
class="w-full"
>

<thead>

<tr>

<th class="p-4">
Invoice
</th>

<th>
Customer
</th>

<th>
Employee
</th>

<th>
Total
</th>

<th>
Date
</th>

</tr>

</thead>

<tbody>

<tr
v-for="
sale
in
filteredSales
"
:key="
sale.id
"
class="
border-b
"
>

<td
class="
p-4
"
>
{{sale.voucherNumber}}
</td>

<td>
{{sale.customerName}}
</td>

<td>
{{sale.employeeName}}
</td>

<td>
${{
sale.total
}}
</td>

<td>
{{
sale.saleDate
}}
</td>

</tr>

</tbody>

</table>

</div>

</div>

</template>