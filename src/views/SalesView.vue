<script setup>
import { ref, onMounted, computed } from "vue";
import productService from "../services/productService";
import salesService from "../services/salesService";
import customerService from "../services/customerService";
import employeeService from "../services/employeeService";
import voucherTypeService from "../services/voucherTypeService";
import ToastNotification from "../components/ToastNotification.vue";
import SalesChart from "../components/SalesChart.vue";

const products = ref([]);
const customers = ref([]);
const employees = ref([]);
const voucherTypes = ref([]);
const employeeId = ref("");
const customerId = ref("");
const voucherTypeId = ref("");
const cart = ref([]);
const sales = ref([]);
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");
const search = ref("");

const total = computed(() => {
  return cart.value.reduce(
    (sum, item) =>
      sum + (item.salePrice * item.units) - item.discount,
    0
  );
});

const addToCart = (product) => {

  const existing = cart.value.find(
    item => item.productId === product.id
  );

  if (existing) {
    existing.units++;
    return;
  }

  cart.value.push({
    productId: product.id,
    productName: product.name,
    salePrice: product.salePrice,
    units: 1,
    discount: 0
  });

  triggerToast(
    `${product.name} added to cart`,
    "success"
  );
};

const increaseQuantity = (item) => {

  item.units++;

};

const decreaseQuantity = (item) => {

  if (item.units > 1) {

    item.units--;

    return;
  }

  removeItem(item.productId);

};

const removeItem = (productId) => {

  cart.value = cart.value.filter(
    item => item.productId !== productId
  );

};

const formattedTotal = computed(() => {

  return total.value.toFixed(2);

});

const filteredProducts = computed(() => {

  if (!search.value) {
    return products.value;
  }

  const text = search.value.toLowerCase();

  return products.value.filter(product =>
    product.name
      .toLowerCase()
      .includes(text)
  );

});

const completeSale = async () => {

  if (
    !customerId.value ||
    !employeeId.value ||
    !voucherTypeId.value
  ) {
    triggerToast("Please select customer, employee and voucher type", "error");
    return;
  }

  if (cart.value.length === 0) {
    triggerToast("Cart is empty", "error");
    return;
  }

  try {

    const payload = {
      customerId: Number(customerId.value),
      employeeId: employeeId.value,
      voucherTypeId: Number(voucherTypeId.value),

      details: cart.value.map(item => ({
        productId: item.productId,
        units: item.units,
        salePrice: item.salePrice,
        discount: item.discount
      }))
    };

    await salesService.create(payload);

    await loadSales();

    triggerToast("Sale completed successfully", "success");

    cart.value = [];
    customerId.value = "";
    employeeId.value = "";
    voucherTypeId.value = "";

  } catch (error) {

    console.error(error);

    triggerToast(
      error.response?.data?.message ||
      "Error creating sale"
      , "error");
  }
};

const loadCustomers = async () => {

  try {

    const response =
      await customerService.getAll();

    customers.value = response.data;

  } catch (error) {

    console.error(error);

    triggerToast(
      "Error loading customers",
      "error");
  }

};

const loadEmployees = async () => {

  try {

    const response =
      await employeeService.getAll();

    employees.value = response.data;

  } catch (error) {

    console.error(error);

    triggerToast(
      "Error loading employees",
      "error");
  }

};

const loadVoucherTypes = async () => {

  try {

    const response =
      await voucherTypeService.getAll();

    voucherTypes.value = response.data;

  } catch (error) {

    console.error(error);

    triggerToast(
      "Error loading voucher types",
      "error");
  }

};

const loadSales = async () => {

  try {

    const response =
      await salesService.getAll();

    sales.value = response.data;

  } catch (error) {

    console.error(error);

    triggerToast(
      "Error loading sales",
      "error");
  }

};

onMounted(async () => {

  try {

    const response =
      await productService.getAll();

    products.value = response.data;

    await loadCustomers();
    await loadEmployees();
    await loadVoucherTypes();
    await loadSales();

  } catch (error) {

    console.error(error);

  }

});

let toastTimeout;

const triggerToast = (
  message,
  type = "success"
) => {

  clearTimeout(toastTimeout);

  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  toastTimeout = setTimeout(() => {
    showToast.value = false;
  }, 3000);

};

</script>

<template>
  <div class="space-y-6">

    <Transition name="toast">

      <ToastNotification v-if="showToast" :message="toastMessage" :type="toastType" />

    </Transition>

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-[#213141]">
        Sales
      </h1>

      <p class="text-gray-600">
        Create and manage sales transactions
      </p>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-5">

      <select v-model="customerId" class="border rounded-lg px-4 py-3">

        <option value="">
          Select customer
        </option>

        <option v-for="customer in customers" :key="customer.id" :value="customer.id">
          {{
            customer.socialReason
              ? customer.socialReason
              : customer.firstname + ' ' + customer.lastname
          }}
        </option>

      </select>

      <select v-model="employeeId" class="border rounded-lg px-4 py-3">

        <option value="">
          Select Employee
        </option>

        <option v-for="employee in employees" :key="employee.id" :value="employee.id">
          {{ employee.firstname }}
          {{ employee.lastname }}
        </option>

      </select>

      <select v-model="voucherTypeId" class="border rounded-lg px-4 py-3">

        <option value="">
          Select Voucher
        </option>

        <option v-for="voucher in voucherTypes" :key="voucher.id" :value="voucher.id">
          {{ voucher.description }}
        </option>

      </select>

    </div>
    <div class="grid grid-cols-3 gap-6">

      <!-- Products -->
      <div class="col-span-2">

        <div class="bg-white rounded-xl shadow-sm p-5">

          <div class="mb-5">

            <input v-model="search" type="text" placeholder="Search products..."
              class="w-full border rounded-lg px-4 py-3" />

          </div>

          <div class="grid grid-cols-2 gap-4">

            <div v-for="product in filteredProducts" :key="product.id"
              class="border rounded-xl p-4 hover:shadow-md transition">
              <h3 class="font-semibold">
                {{ product.name }}
              </h3>

              <p class="text-gray-500">
                Stock: {{ product.currentStock }}
              </p>

              <p class="text-xl font-bold mt-3">
                ${{ product.salePrice }}
              </p>

              <button @click="addToCart(product)" class="mt-4 w-full py-2 rounded-lg text-white"
                style="background-color:#213141;">
                Add
              </button>

            </div>

          </div>

          <div v-if="filteredProducts.length === 0" class="text-center py-6 text-gray-500">
            No products found
          </div>

        </div>

      </div>

      <!-- Cart -->
      <div>

        <div class="bg-white rounded-xl shadow-sm p-5">

          <h2 class="text-xl font-semibold mb-5 text-[#213141]">
            Current Sale
          </h2>

          <div class="space-y-4">

            <div v-for="item in cart" :key="item.productId" class="flex justify-between border-b pb-3">
              <div>

                <div class="font-medium">
                  {{ item.productName }}
                </div>

                <div class="flex items-center gap-2 mt-2">

                  <button @click="decreaseQuantity(item)" class="px-2 py-1 bg-gray-200 rounded">
                    -
                  </button>

                  <span>
                    {{ item.units }}
                  </span>

                  <button @click="increaseQuantity(item)" class="px-2 py-1 bg-gray-200 rounded">
                    +
                  </button>

                </div>

              </div>

              <div class="text-right">
                <div>
                  ${{ item.salePrice * item.units }}
                </div>

                <div class="text-xs text-gray-500">
                  {{ item.units }} x ${{ item.salePrice }}
                </div>

                <button @click="removeItem(item.productId)" class="text-red-500 text-sm">
                  Remove
                </button>
              </div>

            </div>

            <div v-if="cart.length === 0" class="text-center text-gray-500">
              No products added
            </div>

          </div>

          <div class="mt-6 space-y-3">

            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>${{ formattedTotal }}</span>
            </div>

            <div class="flex justify-between">
              <span>Tax</span>
              <span>$0.00</span>
            </div>

            <div class="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${{ formattedTotal }}</span>
            </div>

          </div>

          <button @click="completeSale" class="w-full mt-6 py-3 rounded-xl text-white font-semibold"
            style="background-color:#213141;">
            Complete Sale
          </button>

        </div>

      </div>

    </div>

    <!-- Recent Sales -->

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">

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
              Employee
            </th>

            <th class="text-left px-6 py-4">
              Amount
            </th>

            <th class="text-left px-6 py-4">
              Date
            </th>

          </tr>
        </thead>

        <tbody>

          <tr v-for="sale in sales" :key="sale.id" class="border-b hover:bg-gray-50">

            <td class="px-6 py-4">
              {{ sale.voucherSerie }}-{{ sale.voucherNumber }}
            </td>

            <td class="px-6 py-4">
              {{ sale.customerName }}
            </td>

            <td class="px-6 py-4">
              {{ sale.employeeName }}
            </td>

            <td class="px-6 py-4">
              ${{ sale.total.toFixed(2) }}
            </td>

            <td class="px-6 py-4">
              {{ sale.saleDate }}
            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>

</template>
<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>