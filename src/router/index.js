// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import swiftRoutes from './swiftRouter'

// 404页面
const NotFound = () => import('@/views/NotFound.vue')

const routes = [
    // SwiftShare主题路由
    ...swiftRoutes,

    // 404页面
    { path: '/:catchAll(.*)', name: "notfound", component: NotFound, meta: { requestAuth: false } },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题
    if (to.meta.title) {
        document.title = to.meta.title
    }

    // 检查登录状态
    if (to.meta.requestAuth && !localStorage.getItem("swift_token")) {
        next({
            name: "swift-login",
            query: { redirect: to.fullPath }
        });
    } else {
        next();
    }
});

export default router