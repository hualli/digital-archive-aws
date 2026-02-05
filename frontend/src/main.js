import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router' // Importamos el router

const app = createApp(App)

app.use(createPinia())
app.use(router) // Le decimos a Vue que use el router

app.mount('#app')