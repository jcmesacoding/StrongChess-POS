<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'

const route = useRoute()
const router = useRouter()

const username = computed(() =>
  localStorage.getItem('username') || 'User'
)

const userInitial = computed(() =>
  username.value.charAt(0).toUpperCase()
)

const showLogoutModal = ref(false)

const logout = () => {

  showLogoutModal.value = false
  
  localStorage.removeItem('token')
  localStorage.removeItem('username')

  router.replace('/login')
}

</script>

<template>

  <!-- Login sin Sidebar ni Header -->
  <RouterView v-if="route.name === 'login'" />

  <!-- Layout principal -->
  <div v-else class="min-h-screen flex" style="background-color: #bcf7d9;">

    <Sidebar />

    <main class="flex-1">

      <header class="h-16 border-b flex items-center justify-between px-6" style="
          background-color: #bef1dd;
          border-color: #21314120;
        ">

        <!-- Search -->
        <input placeholder="Search..." class="border rounded-lg px-4 py-2 w-80 outline-none focus:ring-2" style="
            background-color: white;
            border-color: #21314130;
            color: #213141;
          " />

        <!-- User Area -->
        <div class="flex items-center gap-4" style="color: #213141;">

          <button class="text-xl hover:opacity-80 transition" title="Notifications">
            🔔
          </button>

          <!-- Avatar -->
          <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
            style="background-color: #213141;">
            {{ userInitial }}
          </div>

          <!-- Username -->
          <div class="font-medium">
            {{ username }}
          </div>

          <!-- Logout -->
          <button @click="showLogoutModal = true"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition hover:opacity-80" style="
              background-color: white;
              border-color: #21314130;
              color: #213141;
            ">
            Logout
          </button>

        </div>

      </header>

      <section class="p-6">
        <RouterView />
      </section>

    </main>

  </div>

  <!-- Logout Confirmation Modal -->
  <div v-if="showLogoutModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">

      <h2 class="text-xl font-bold mb-3" style="color: #213141;">
        Logout
      </h2>

      <p class="text-gray-600 mb-6">
        Are you sure you want to logout?
      </p>

      <div class="flex justify-end gap-3">

        <button @click="showLogoutModal = false" class="px-4 py-2 border rounded-lg">
          Cancel
        </button>

        <button @click="logout" class="px-4 py-2 rounded-lg text-white" style="background-color: #dc2626;">
          Logout
        </button>

      </div>

    </div>
  </div>
</template>