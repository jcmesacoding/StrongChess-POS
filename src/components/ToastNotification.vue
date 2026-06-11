<script setup>
defineProps({
  message: String,
  type: {
    type: String,
    default: "success"
  }
});
</script>

<template>
  <div
    class="fixed top-5 right-5 left-5 sm:left-auto px-5 py-3 rounded-lg shadow-lg text-white z-50 text-sm"
    :class="{
      'bg-green-500': type === 'success',
      'bg-red-500 opacity-90': type === 'error',
      'bg-blue-500': type === 'info'
    }"
  >
    {{ message }}
  </div>
</template>