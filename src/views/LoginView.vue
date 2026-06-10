<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "../services/authService";

const router = useRouter();

const username = ref("");
const password = ref("");

const login = async () => {

  console.log("1. Login ejecutado");

  try {

    console.log("2. Antes del backend");

    const response = await authService.login({
      username: username.value,
      password: password.value
    });

    console.log("3. Respuesta recibida");
    console.log(response);

    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "username",
      response.data.username
    );

    console.log("4. Antes de router.push");

    await router.push("/dashboard");

  } catch (error) {

    console.error("ERROR COMPLETO:", error);

    console.error("MESSAGE:", error.message);

    console.error("RESPONSE:", error.response);

    console.error("REQUEST:", error.request);

  }

};

</script>

<template>
  <div class="min-h-screen flex items-center justify-center" style="background-color: #bef1dd;">

    <div class="bg-white w-full max-w-md rounded-3xl shadow-lg p-8">

      <div class="text-center mb-8">

        <h1 class="text-4xl font-bold" style="color:#213141">
          StrongChess POS
        </h1>

        <p class="text-gray-500 mt-2">
          Inventory & Sales Management
        </p>

      </div>

      <form @submit.prevent="login" class="space-y-5">

        <div>
          <label class="block mb-2 font-medium">
            Username
          </label>

          <input v-model="username" type="text" placeholder="Enter username"
            class="w-full border rounded-xl px-4 py-3" />
        </div>

        <div>
          <label class="block mb-2 font-medium">
            Password
          </label>

          <input v-model="password" type="password" placeholder="Enter password"
            class="w-full border rounded-xl px-4 py-3" />
        </div>

        <button type="submit" class="w-full py-3 rounded-xl text-white font-semibold" style="background-color:#213141">
          Login
        </button>

      </form>

    </div>

  </div>
</template>