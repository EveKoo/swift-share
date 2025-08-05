import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'
import router from './router'
import { initStores } from './stores'
import './assets/css/base.css'
import './assets/css/swift-theme.css'

const app = createApp(App)
const pinia = createPinia()

// 全局配置
app.config.globalProperties.$axios = axios
app.use(ElementPlus, { locale: zhCn })

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(pinia)
app.use(router)

// 初始化状态管理
initStores()

app.mount('#app')

