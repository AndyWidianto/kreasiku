import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/routes'
import { socket } from './untils/socket'


createApp(App).use(router).provide("socket", socket).mount('#app')
