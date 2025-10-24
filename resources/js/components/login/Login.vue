<template>
  <div class="flex h-screen w-screen overflow-hidden">
    <div class="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-gray-700 via-black to-gray-900 text-white overflow-hidden">
      
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] animate-pulse"></div>

      <div class="relative z-10 text-center">
        <h1 class="text-3xl font-bold tracking-wide mb-2">MillsBrands&copy;</h1>
        <p class="text-gray-300 text-sm">The world of seamless eCommerce</p>
      </div>

      <div class="absolute ecommerce-world ml-10">
        <div class="globe"></div>

        <i class="pi pi-shopping-cart float-icon" style="--i:1"></i>
        <i class="pi pi-box float-icon" style="--i:2"></i>
        <i class="pi pi-truck float-icon" style="--i:3"></i>
        <i class="pi pi-globe float-icon" style="--i:4"></i>
        <i class="pi pi-store float-icon" style="--i:5"></i>
      </div>
    </div>

    <div class="flex w-full md:w-1/2 items-center justify-center p-6 bg-black text-white">
      <div class="w-full max-w-md">
        <img :src="'/app_icon.png'" alt="Logo" class="w-34 h-34 mx-auto mb-4 rounded-full" />
        <h2 class="text-xl font-semibold mb-6 text-center">Login with your account</h2>

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
              <span class="text-sm text-blue-400 hover:underline">Forgot password?</span>
            </router-link>
          </div>
          <Button type="submit" icon="pi pi-unlock" label="Login" fluid :loading="loading" severity="contrast" />
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

    if (response.token) localStorage.setItem("auth_token", response.token);

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

.ecommerce-world {
  position: relative;
  width: 250px;
  height: 250px;
  animation: rotateWorld 20s linear infinite;
}

.globe {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  margin: auto;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #4ade80, #1e3a8a 70%);
  box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
  /* animation: spinGlobe 12s linear infinite; */
}

.float-icon {
  position: absolute;
  font-size: 1.5rem;
  color: #facc15;
  text-shadow: 0 0 10px rgba(255,255,255,0.4);
  animation: floatIcons 6s ease-in-out infinite;
}

.float-icon[style*="--i:1"] { top: -20px; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
.float-icon[style*="--i:2"] { bottom: -10px; left: 20%; animation-delay: 1.5s; }
.float-icon[style*="--i:3"] { right: -10px; top: 40%; animation-delay: 3s; }
.float-icon[style*="--i:4"] { top: 10%; left: 10%; animation-delay: 2s; }
.float-icon[style*="--i:5"] { bottom: 15%; right: 25%; animation-delay: 4.5s; }

@keyframes spinGlobe {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}

@keyframes rotateWorld {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes floatIcons {
  0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
  50% { transform: translateY(-10px) scale(1.1); opacity: 0.8; }
}
</style>
