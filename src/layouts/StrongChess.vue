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
const sidebarOpen = ref(false)

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
  <div v-else class="min-h-screen flex items-stretch" style="background-color: #bcf7d9;">

    <!-- Overlay para cerrar sidebar en móvil -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black/40 z-20 lg:hidden" @click="sidebarOpen = false" />

    <!-- Sidebar -->
    <div :class="[
      'fixed inset-y-0 left-0 z-30 transition-transform duration-300 lg:static lg:translate-x-0',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <Sidebar @close="sidebarOpen = false" />
    </div>

    <main class="flex-1 min-w-0">

      <header class="h-16 border-b flex items-center justify-between px-4 lg:px-6" style="
        background-color: #bef1dd;
        border-color: #21314120;
        ">

        <div class="flex items-center gap-3">
          <button class="lg:hidden text-2xl" @click="sidebarOpen = true">☰</button>
          <input placeholder="Search..."
            class="hidden sm:block border rounded-lg px-4 py-2 w-48 md:w-80 outline-none focus:ring-2" style="
            background-color: white;
            border-color: #21314130;
            color: #213141;
            " />
        </div>

        <div class="flex items-center gap-2 lg:gap-4" style="color: #213141;">
          <button class="text-xl hover:opacity-80 transition" title="Notifications">🔔</button>

          <!-- Avatar + Username como link al perfil -->
          <RouterLink to="/profile" class="flex items-center gap-2 hover:opacity-80 transition">
            <div
              class="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
              style="background-color: #213141;">
              {{ userInitial }}
            </div>
            <div class="hidden md:block font-medium">
              {{ username }}
            </div>
          </RouterLink>

          <button @click="showLogoutModal = true"
            class="px-3 py-2 lg:px-4 rounded-lg border text-sm font-medium transition hover:opacity-80" style="
            background-color: white;
            border-color: #21314130;
            color: #213141;
            ">
            Logout
          </button>
        </div>

      </header>

      <section class="p-4 lg:p-6">
        <RouterView />
      </section>

    </main>

  </div>

  <!-- Logout Confirmation Modal -->
  <div v-if="showLogoutModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
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