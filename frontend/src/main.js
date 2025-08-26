import { createApp } from 'vue'
import './style.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/navigation'
import App from './App.vue'
import router from './router/routes'
import { socket } from './untils/socket'
import { createPinia } from 'pinia'


createApp(App).use(router).use(createPinia()).provide("socket", socket).mount('#app')
