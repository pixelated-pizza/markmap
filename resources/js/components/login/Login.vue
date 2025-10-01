<template>
    <div class="flex h-screen w-screen">
        <div
            class="hidden md:flex w-1/2 bg-gradient-to-br from-gray-600 via-black to-gray-600 items-center justify-center text-white">
            <div class="text-center">
                <img :src="'/app_icon.png'" alt="Logo" class="w-64 h-64 mx-auto mb-4 rounded-full" />
                <h1 class="text-3xl font-bold tracking-wide">MillsBrands&copy;</h1>
            </div>
        </div>

        <div class="flex w-full md:w-1/2 items-center justify-center p-6 bg-black">
            <div class="w-full max-w-md">
                
                <h2 class="text-2xl font-semibold mb-6">Login with your account</h2>

                <form @submit.prevent="handleLogin" class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium mb-1">Email</label>
                        <InputText id="email" v-model="email" fluid placeholder="Enter your email" />
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium mb-1">Password</label>
                        <Password id="password" v-model="password" class="w-full" :feedback="false" fluid
                            placeholder="Enter your password" />
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="rememberMe" binary />
                            <label class="text-sm">Remember Me</label>
                        </div>
                        <router-link to="#">
                            <span class="text-sm text-blue-600 hover:underline">Forgot password?</span>
                        </router-link>
                    </div>
                    <Button type="submit" label="Login" fluid :loading="loading" class="login-btn"/>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";   
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import { login } from "@/api/login_api.js";

const loading = ref(false);

const email = ref("");
const password = ref("");
const rememberMe = ref(false);

const router = useRouter();  
const { appContext } = getCurrentInstance();
const $toastr = appContext.config.globalProperties.$toastr;

const handleLogin = async () => {
  loading.value = true;
  try {
    const response = await login({
      email: email.value,
      password: password.value,
      remember: rememberMe.value,
    });

    if (response.token) {
      localStorage.setItem("auth_token", response.token);
    }

    $toastr.success("Welcome back!", "Login Successful");
    router.push("/dashboard");
  } catch (err) {
    const message = err.response?.data?.message || "Invalid credentials";
    $toastr.error(message, "Login Failed");
  } finally {
    loading.value = false; 
  }
};

</script>

<style scoped>
.login-btn {
  background-color: white;
}
</style>
