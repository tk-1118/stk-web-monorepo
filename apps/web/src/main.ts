import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './app/App.vue'

// Element Plus 样式
import 'element-plus/dist/index.css'
// 暗黑主题变量（官方）
import 'element-plus/theme-chalk/dark/css-vars.css'

// 全局样式
import './assets/styles/base.scss'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#root')
