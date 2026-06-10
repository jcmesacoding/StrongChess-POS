<script setup>
import { ref, computed, onMounted } from "vue";
import customerService from "../services/customerService";
import ToastNotification from "../components/ToastNotification.vue";
import CustomerModal from "../components/CustomerModal.vue";

const customers = ref([]);
const search = ref("");
const showModal = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

const triggerToast = (
  message,
  type = "success"
) => {

  toastMessage.value = message;

  toastType.value = type;

  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);

};

const createCustomer =
  async (customer) => {

    try {

      await customerService.create({

        documentTypeId: 1,

        personTypeId: 1,

        genderId: 1,

        departmentId: 1,

        provinceId: 1,

        districtId: 1,

        birthdate:
          "2000-01-01",

        registrationDate:
          new Date().toISOString(),

        ...customer

      });

      await loadCustomers();

      showModal.value =
        false;

      triggerToast(
        "Customer created",
        "success"
      );

    }
    catch (error) {

      console.error(error);

      triggerToast(
        "Error creating customer",
        "error"
      );

    }

  };

const filteredCustomers = computed(() => {

  if (!search.value) {
    return customers.value;
  }

  const text = search.value.toLowerCase();

  return customers.value.filter(customer =>
    (
      customer.firstname +
      " " +
      customer.lastname +
      " " +
      customer.socialReason
    )
      .toLowerCase()
      .includes(text)
  );

});

const loadCustomers = async () => {

  try {

    const response =
      await customerService.getAll();

    customers.value = response.data;

  } catch (error) {

    console.error(error);

  }

};

onMounted(() => {

  loadCustomers();

});
</script>

<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">

      <div>
        <h1 class="text-3xl font-bold text-[#213141]">
          Customers
        </h1>

        <p class="text-gray-600">
          Manage your customers and their purchase history
        </p>
      </div>

      <button @click="showModal = true" class="px-5 py-3 rounded-xl text-white font-medium"
        style="background-color:#213141;">

        + Add Customer

      </button>

    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-6">

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">Total Customers</p>
        <h2 class="text-3xl font-bold text-[#213141]">
          {{ customers.length }}
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">New This Month</p>
        <h2 class="text-3xl font-bold text-green-600">
          0
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">VIP Customers</p>
        <h2 class="text-3xl font-bold text-amber-600">
          0
        </h2>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5">
        <p class="text-gray-500">Active Customers</p>
        <h2 class="text-3xl font-bold text-blue-600">
          0
        </h2>
      </div>

    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl shadow-sm p-5">

      <div class="flex gap-4">

        <input v-model="search" type="text" placeholder="Search customer..."
          class="flex-1 border rounded-lg px-4 py-2" />

        <select class="border rounded-lg px-4 py-2">
          <option>All Customers</option>
          <option>VIP</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

      </div>

    </div>

    <!-- Customers Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">

      <div class="px-6 py-4 border-b" style="background-color:#bef1dd;">
        <h2 class="font-semibold text-[#213141]">
          Customer List
        </h2>
      </div>

      <table class="w-full">

        <thead>
          <tr class="border-b">

            <th class="text-left px-6 py-4">
              Customer
            </th>

            <th class="text-left px-6 py-4">
              Email
            </th>

            <th class="text-left px-6 py-4">
              Phone
            </th>

            <th class="text-left px-6 py-4">
              Purchases
            </th>

            <th class="text-left px-6 py-4">
              Total Spent
            </th>

            <th class="text-left px-6 py-4">
              Status
            </th>

            <th class="text-left px-6 py-4">
              Actions
            </th>

          </tr>
        </thead>

        <tbody>

          <tr v-for="customer in filteredCustomers" :key="customer.id" class="border-b hover:bg-gray-50">

            <td class="px-6 py-4">

              {{
                customer.socialReason
                  ? customer.socialReason
                  : customer.firstname + " " + customer.lastname
              }}

            </td>

            <td class="px-6 py-4">
              {{ customer.email }}
            </td>

            <td class="px-6 py-4">
              {{ customer.phoneNumber }}
            </td>

            <td class="px-6 py-4">
              -
            </td>

            <td class="px-6 py-4">
              -
            </td>

            <td class="px-6 py-4">

              <span class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                Active
              </span>

            </td>

            <td class="px-6 py-4">

              <button @click="editCustomer(customer)" class="mr-3">
                ✏️
              </button>

              <button @click="deleteCustomer(customer.id)">
                🗑️
              </button>

            </td>

          </tr>

        </tbody>

      </table>

    </div>

    <!-- Top Customers
    <div class="bg-white rounded-xl shadow-sm p-6">

      <h2 class="font-semibold text-[#213141] mb-5">
        Top Customers
      </h2>

      <div class="space-y-4">

        <div class="flex justify-between">
          <span>Ana Gómez</span>
          <span class="font-semibold">
            $3,540
          </span>
        </div>

        <div class="flex justify-between">
          <span>Juan Pérez</span>
          <span class="font-semibold">
            $1,250
          </span>
        </div>

        <div class="flex justify-between">
          <span>Carlos Ruiz</span>
          <span class="font-semibold">
            $980
          </span>
        </div>

      </div>

    </div> -->

  </div>

  <CustomerModal v-if="showModal" @close="showModal = false" @save="createCustomer" />
  <Transition name="toast">
    <ToastNotification v-if="showToast" :message="toastMessage" :type="toastType" />
  </Transition>
</template>
<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all .3s ease;
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