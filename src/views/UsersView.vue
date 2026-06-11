<script setup>
import { ref, onMounted } from 'vue'
import authService from '../services/authService'

const users = ref([])
const showModal = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = ref({
  username: '',
  password: '',
  email: '',
  firstName: '',
  lastName: '',
  role: 'READ'
})

const resetForm = () => {
  form.value = {
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'READ'
  }
  errorMessage.value = ''
}

const createUser = async () => {
  errorMessage.value = ''
  try {
    await authService.register(form.value)
    successMessage.value = `User ${form.value.username} created successfully`
    showModal.value = false
    resetForm()
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Error creating user'
  }
}
</script>

<template>
  <div class="space-y-4 lg:space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-[#213141]">Users</h1>
        <p class="text-gray-600 text-sm lg:text-base">Manage system users and roles</p>
      </div>
      <button @click="showModal = true"
        class="px-3 py-2 lg:px-5 lg:py-3 rounded-xl text-white font-medium text-sm lg:text-base"
        style="background-color:#213141;">
        + Add User
      </button>
    </div>

    <!-- Success toast -->
    <div v-if="successMessage"
      class="px-5 py-3 rounded-xl bg-green-100 text-green-700 text-sm">
      {{ successMessage }}
    </div>

    <!-- Roles info -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6">
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">ADMIN</p>
        <p class="text-xs text-gray-400 mt-1">Full access to all features</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">WRITE</p>
        <p class="text-xs text-gray-400 mt-1">Can create and edit data</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">READ</p>
        <p class="text-xs text-gray-400 mt-1">View only access</p>
      </div>
    </div>

    <!-- Info card -->
    <div class="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
      <p class="text-4xl mb-3">👥</p>
      <p class="font-medium text-[#213141]">Create users with the button above</p>
      <p class="text-sm mt-1">Assign ADMIN, WRITE or READ roles</p>
    </div>

  </div>

  <!-- Create User Modal -->
  <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div class="bg-white rounded-2xl shadow-xl p-5 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">

      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-bold text-[#213141]">New User</h2>
        <button @click="showModal = false; resetForm()" class="text-2xl text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block mb-1 font-medium text-sm">Username</label>
          <input v-model="form.username" placeholder="e.g. john01"
            class="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block mb-1 font-medium text-sm">Password</label>
          <input v-model="form.password" type="password" placeholder="Min 6 characters"
            class="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block mb-1 font-medium text-sm">Email</label>
          <input v-model="form.email" type="email" placeholder="email@example.com"
            class="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block mb-1 font-medium text-sm">First Name</label>
            <input v-model="form.firstName" placeholder="First name"
              class="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block mb-1 font-medium text-sm">Last Name</label>
            <input v-model="form.lastName" placeholder="Last name"
              class="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label class="block mb-1 font-medium text-sm">Role</label>
          <select v-model="form.role" class="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="ADMIN">ADMIN - Full access</option>
            <option value="WRITE">WRITE - Supervisor</option>
            <option value="READ">READ - Employee</option>
          </select>
        </div>

        <!-- Error -->
        <div v-if="errorMessage"
          class="px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm">
          {{ errorMessage }}
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-5">
        <button @click="showModal = false; resetForm()" class="px-4 py-2 border rounded-lg text-sm">
          Cancel
        </button>
        <button @click="createUser" class="px-4 py-2 rounded-lg text-white text-sm"
          style="background-color:#213141">
          Create User
        </button>
      </div>

    </div>
  </div>
</template>