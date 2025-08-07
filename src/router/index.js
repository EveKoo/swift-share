// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
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
    history: createWebHashHistory(),
    routes
});

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const appStore = useAppStore()

    // 显示全局加载状态
    appStore.showLoading('页面加载中...')

    try {
        // 设置页面标题
        if (to.meta.title) {
            document.title = to.meta.title
        }

        // 检查是否需要登录
        if (to.meta.requestAuth) {
            // 检查登录状态
            if (!userStore.isLoggedIn) {
                // 尝试从本地存储恢复用户状态
                await userStore.initUserState()

                if (!userStore.isLoggedIn) {
                    // 仍然未登录，跳转到登录页
                    next({
                        name: "swift-login",
                        query: { redirect: to.fullPath }
                    });
                    return
                }
            }

            // 检查用户信息是否完整
            if (!userStore.userInfo) {
                try {
                    await userStore.fetchUserInfo()
                } catch (error) {
                    // 获取用户信息失败，清除登录状态
                    userStore.logout()
                    next({
                        name: "swift-login",
                        query: { redirect: to.fullPath }
                    });
                    return
                }
            }
        }

        // 检查角色权限（如果有的话）
        if (to.meta.roles && to.meta.roles.length > 0) {
            const userRole = userStore.userInfo?.role || 'user'
            if (!to.meta.roles.includes(userRole)) {
                next({ name: 'notfound' })
                return
            }
        }

        // 所有检查通过
        next()

    } catch (error) {
        console.error('路由守卫错误:', error)
        next({ name: 'notfound' })
    } finally {
        // 隐藏加载状态
        appStore.hideLoading()
    }
});

// 全局后置钩子
router.afterEach((to, from) => {
    // 页面访问统计
    console.log(`页面跳转: ${from.path} -> ${to.path}`)

    // 可以在这里添加页面访问统计、埋点等
    if (to.meta.analytics) {
        // 发送页面访问统计
        // analytics.track('page_view', { page: to.path })
    }
});

// 路由错误处理
router.onError((error) => {
    console.error('路由错误:', error)
    const appStore = useAppStore()
    appStore.hideLoading()

    // 可以跳转到错误页面
    // router.push('/error')
});

export default router