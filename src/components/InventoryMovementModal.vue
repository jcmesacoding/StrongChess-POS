<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  visible: Boolean,
  type: String,
  products: Array
});

const emit = defineEmits(["close", "save"]);

const form = ref({
  productId: null,
  quantity: 1,
  notes: ""
});

watch(() => props.visible, (newValue) => {
  if (newValue) {
    form.value = { productId: null, quantity: 1, notes: "" };
  }
});

const save = () => {
  emit("save", { ...form.value, type: props.type });
};
</script>

<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

    <div class="bg-white rounded-2xl shadow-xl p-5 lg:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">

      <div class="flex justify-between items-center mb-5 lg:mb-6">
        <h2 class="text-xl lg:text-2xl font-bold" style="color:#213141">{{ type }}</h2>
        <button @click="emit('close')" class="text-2xl text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <div class="mb-4">
        <label class="block mb-2 font-medium text-sm lg:text-base">Product</label>
        <select v-model="form.productId" class="w-full border rounded-lg px-4 py-3 text-sm lg:text-base">
          <option :value="null">Select Product</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block mb-2 font-medium text-sm lg:text-base">Quantity</label>
        <input v-model.number="form.quantity" type="number" min="1"
          class="w-full border rounded-lg px-4 py-3 text-sm lg:text-base" />
      </div>

      <div class="mb-5 lg:mb-6">
        <label class="block mb-2 font-medium text-sm lg:text-base">Notes</label>
        <textarea v-model="form.notes" rows="3"
          class="w-full border rounded-lg px-4 py-3 text-sm lg:text-base" />
      </div>

      <div class="flex justify-end gap-3">
        <button @click="emit('close')" class="px-4 py-2 border rounded-lg text-sm">Cancel</button>
        <button @click="save" class="px-4 py-2 rounded-lg text-white text-sm"
          style="background-color:#213141">
          Save
        </button>
      </div>

    </div>
  </div>
</template>