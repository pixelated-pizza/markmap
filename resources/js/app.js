import './bootstrap';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import PrimeVue from 'primevue/config';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// import 'primeicons/primeicons.css';
import Aura from '@primeuix/themes/aura';
import { ref } from "vue";
import ganttastic from '@infectoone/vue-ganttastic';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import VueApexCharts from "vue3-apexcharts";


import '../css/assets/tailwind.css';      // Tailwind base
import '../css/assets/styles.scss';        // layout/demo SCSS

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.tz.setDefault('Australia/Sydney')

export const isPageLoading = ref(false);

router.beforeEach((to, from, next) => {
  isPageLoading.value = true;
  next();
});

router.afterEach(() => {
  setTimeout(() => {
    isPageLoading.value = false;
  }, 200);
});


toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "3000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut"
};

const app = createApp(App);

const pinia = createPinia();
app.config.globalProperties.$toastr = toastr;

for (const [name, comp] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, comp);
}

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark'
    }
  }
}).use(pinia)
  .use(ToastService)
  .use(VueApexCharts)
  .use(ConfirmationService)
  .use(ElementPlusIconsVue).use(ganttastic)
  .use(router).mount('#app');
