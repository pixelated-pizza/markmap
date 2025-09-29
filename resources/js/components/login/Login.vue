<template>
    <div class="flex h-screen w-screen">
        <div
            class="hidden md:flex w-1/2 bg-gradient-to-br from-gray-600 via-black to-gray-600 items-center justify-center text-white">
            <div class="text-center">
                <img :src="'/app_icon.png'" alt="Logo" class="w-64 h-64 mx-auto mb-4 rounded-full" />
                <h1 class="text-3xl font-bold tracking-wide">MillsBrands | Crylls.Inc</h1>
            </div>
        </div>

        <div class="flex w-full md:w-1/2 items-center justify-center p-6">
            <div class="w-full max-w-md">
                <h2 class="text-2xl font-semibold text-gray-100 mb-6">Login with your account</h2>

                <form @submit.prevent="handleLogin" class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium mb-1">Email</label>
                        <InputText id="email" v-model="email" class="w-full" placeholder="Enter your email" />
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium mb-1">Password</label>
                        <Password id="password" v-model="password" class="w-full" :feedback="false"
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
                    <Button type="submit" label="Login" class="w-full" />
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);

const handleLogin = () => {
    console.log("Login submitted:", { email: email.value, password: password.value, rememberMe: rememberMe.value });
};
</script>

<style scoped></style>
