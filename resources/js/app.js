import './bootstrap';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import PrimeVue from 'primevue/config';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'primeicons/primeicons.css';

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

app.config.globalProperties.$toastr = toastr;

for (const [name, comp] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, comp);
}

app.use(PrimeVue).use(ElementPlusIconsVue).use(router).mount('#app');
