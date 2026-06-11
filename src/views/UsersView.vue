<script setup>
import { ref, onMounted } from 'vue'
import authService from '../services/authService'
import userService from '../services/userService'

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

const loadUsers = async () => {
  try {
    users.value = (await userService.getAll()).data
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

const createUser = async () => {
  errorMessage.value = ''
  try {
    await authService.register(form.value)
    successMessage.value = `User ${form.value.username} created successfully`
    showModal.value = false
    resetForm()
    await loadUsers()
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Error creating user'
  }
}

onMounted(() => { loadUsers() })
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

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6">
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">Total Users</p>
        <h2 class="text-2xl font-bold text-[#213141]">{{ users.length }}</h2>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">Admins</p>
        <h2 class="text-2xl font-bold text-[#213141]">
          {{ users.filter(u => u.roles.includes('ADMIN')).length }}
        </h2>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-5">
        <p class="text-gray-500 text-sm">Employees</p>
        <h2 class="text-2xl font-bold text-[#213141]">
          {{ users.filter(u => !u.roles.includes('ADMIN')).length }}
        </h2>
      </div>
    </div>

    <!-- Tabla desktop -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b" style="background-color:#bef1dd;">
        <h2 class="font-semibold text-[#213141]">User List</h2>
      </div>
      <table class="w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left px-6 py-4">Username</th>
            <th class="text-left px-6 py-4">Name</th>
            <th class="text-left px-6 py-4">Email</th>
            <th class="text-left px-6 py-4">Role</th>
            <th class="text-left px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-medium">{{ user.username }}</td>
            <td class="px-6 py-4">{{ user.firstName }} {{ user.lastName }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">
              <span v-for="role in user.roles" :key="role"
                class="px-2 py-1 rounded-full text-xs mr-1"
                :class="{
                  'bg-purple-100 text-purple-700': role === 'ADMIN',
                  'bg-blue-100 text-blue-700': role === 'WRITE',
                  'bg-gray-100 text-gray-700': role === 'READ'
                }">
                {{ role }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 rounded-full text-sm"
                :class="user.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ user.enabled ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cards móvil -->
    <div class="lg:hidden space-y-3">
      <div class="px-1 py-2">
        <h2 class="font-semibold text-[#213141]">User List</h2>
      </div>
      <div v-for="user in users" :key="user.id"
        class="bg-white rounded-xl shadow-sm p-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <p class="font-semibold text-[#213141]">{{ user.username }}</p>
            <p class="text-sm text-gray-500">{{ user.firstName }} {{ user.lastName }}</p>
            <p class="text-xs text-gray-400">{{ user.email }}</p>
          </div>
          <div class="text-right">
            <span v-for="role in user.roles" :key="role"
              class="px-2 py-1 rounded-full text-xs block mb-1"
              :class="{
                'bg-purple-100 text-purple-700': role === 'ADMIN',
                'bg-blue-100 text-blue-700': role === 'WRITE',
                'bg-gray-100 text-gray-700': role === 'READ'
              }">
              {{ role }}
            </span>
            <span class="px-2 py-1 rounded-full text-xs"
              :class="user.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
              {{ user.enabled ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </div>
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