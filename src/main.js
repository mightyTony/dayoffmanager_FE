import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { createPinia } from "pinia";
//import { createVuetify } from "vuetify";
import vuetify from './plugins/vuetify';
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {createPersistedState} from "pinia-plugin-persistedstate";
// import './assets/styles/global.css'

const pinia = createPinia();
pinia.use(createPersistedState({
    storage: localStorage,
    auto: true,
}))

createApp(App)
    .component('VueDatePicker', DatePicker)
    .use(pinia)
    .use(router)
    .use(vuetify)
    .mount('#app');
