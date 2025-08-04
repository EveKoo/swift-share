import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path: '/',
        name: 'HomePage', // 改为多词名称
        component: () => import('../views/Home.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router