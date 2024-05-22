import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { createPinia } from "pinia";
//import { createVuetify } from "vuetify";
import vuetify from './plugins/vuetify';
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

createApp(App)
    .component('VueDatePicker', DatePicker)
    .use(createPinia())
    .use(router)
    .use(vuetify)
    .mount('#app');
