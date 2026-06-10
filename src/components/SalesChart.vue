<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "vue-chartjs";
import { computed } from "vue";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  sales: {
    type: Array,
    required: true
  }
});

const chartData = computed(() => ({

  labels: props.sales.map(
    sale =>
      sale.saleDate.split("T")[0]
  ),

  datasets: [
    {
      label: "Revenue",
      data: props.sales.map(
        sale => sale.total
      ),
      tension: 0.3
    }
  ]

}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
};
</script>

<template>
  <div class="h-96">
    <Line
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>