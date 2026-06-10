<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  visible: Boolean,
  type: String,
  products: Array
});

const emit = defineEmits([
  "close",
  "save"
]);

const form = ref({
  productId: null,
  quantity: 1,
  notes: ""
});

watch(
  () => props.visible,
  (newValue) => {

    if (newValue) {

      form.value = {
        productId: null,
        quantity: 1,
        notes: ""
      };

    }

  }
);

const save = () => {

  emit("save", {
    ...form.value,
    type: props.type
  });

};
</script>

<template>

  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >

    <div
      class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg"
    >

      <h2
        class="text-2xl font-bold mb-6"
        style="color:#213141"
      >
        {{ type }}
      </h2>

      <!-- Product -->

      <div class="mb-4">

        <label class="block mb-2 font-medium">
          Product
        </label>

        <select
          v-model="form.productId"
          class="w-full border rounded-lg px-4 py-3"
        >

          <option :value="null">
            Select Product
          </option>

          <option
            v-for="product in products"
            :key="product.id"
            :value="product.id"
          >
            {{ product.name }}
          </option>

        </select>

      </div>

      <!-- Quantity -->

      <div class="mb-4">

        <label class="block mb-2 font-medium">
          Quantity
        </label>

        <input
          v-model.number="form.quantity"
          type="number"
          min="1"
          class="w-full border rounded-lg px-4 py-3"
        />

      </div>

      <!-- Notes -->

      <div class="mb-6">

        <label class="block mb-2 font-medium">
          Notes
        </label>

        <textarea
          v-model="form.notes"
          rows="3"
          class="w-full border rounded-lg px-4 py-3"
        />

      </div>

      <div class="flex justify-end gap-3">

        <button
          @click="$emit('close')"
          class="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          @click="save"
          class="px-4 py-2 rounded-lg text-white"
          style="background-color:#213141"
        >
          Save
        </button>

      </div>

    </div>

  </div>

</template>