import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
    const globalLoading = ref(false)

    const showLoader = () => globalLoading.value = true
    const hideLoader = () => globalLoading.value = false

    return { globalLoading, showLoader, hideLoader }
})