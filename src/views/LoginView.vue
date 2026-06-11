<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "../services/authService";

const router = useRouter();
const username = ref("");
const password = ref("");
const errorMessage = ref("");

const login = async () => {
  errorMessage.value = "";
  try {
    const response = await authService.login({
      username: username.value,
      password: password.value
    });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("username", response.data.username);
    localStorage.setItem("role", response.data.role);
    await router.push("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.value = "Invalid username or password";
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: #bef1dd;">

    <div class="bg-white w-full max-w-md rounded-3xl shadow-lg p-6 lg:p-8">

      <div class="text-center mb-6 lg:mb-8">
        <h1 class="text-3xl lg:text-4xl font-bold" style="color:#213141">
          ♜ StrongChess POS
        </h1>
        <p class="text-gray-500 mt-2 text-sm lg:text-base">
          Inventory & Sales Management
        </p>
      </div>

      <form @submit.prevent="login" class="space-y-4 lg:space-y-5">

        <div>
          <label class="block mb-2 font-medium text-sm lg:text-base">Username</label>
          <input v-model="username" type="text" placeholder="Enter username"
            class="w-full border rounded-xl px-4 py-3 text-sm lg:text-base outline-none focus:ring-2"
            style="border-color: #21314130;" />
        </div>

        <div>
          <label class="block mb-2 font-medium text-sm lg:text-base">Password</label>
          <input v-model="password" type="password" placeholder="Enter password"
            class="w-full border rounded-xl px-4 py-3 text-sm lg:text-base outline-none focus:ring-2"
            style="border-color: #21314130;" />
        </div>

        <!-- Error message -->
        <div v-if="errorMessage" class="px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm">
          {{ errorMessage }}
        </div>

        <button type="submit"
          class="w-full py-3 rounded-xl text-white font-semibold transition hover:opacity-90 text-sm lg:text-base"
          style="background-color:#213141">
          Login
        </button>

      </form>

    </div>

  </div>
</template>