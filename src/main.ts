import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Camera from "simple-vue-camera"

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.component("camera", Camera) // if required globally

app.use(createPinia())
app.use(router)

app.mount('#app')
