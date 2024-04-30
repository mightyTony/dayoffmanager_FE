import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { createPinia } from "pinia";
//import { createVuetify } from "vuetify";
import vuetify from './plugins/vuetify';

createApp(App)
    .use(createPinia())
    .use(router)
    .use(vuetify)
    .mount('#app')
