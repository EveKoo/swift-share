import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
    // 状态
    const theme = ref(localStorage.getItem('theme') || 'light')
    const language = ref(localStorage.getItem('language') || 'zh-CN')
    const sidebarCollapsed = ref(false)
    const notifications = ref([])
    const loading = ref(false)
    const loadingText = ref('加载中...')
    const isMobile = ref(false)
    const windowSize = ref({
        width: window.innerWidth,
        height: window.innerHeight
    })

    // 计算属性
    const isDarkMode = computed(() => theme.value === 'dark')
    const notificationCount = computed(() => notifications.value.length)
    const unreadNotificationCount = computed(() =>
        notifications.value.filter(n => !n.read).length
    )

    // 主题管理
    const setTheme = (newTheme) => {
        theme.value = newTheme
        localStorage.setItem('theme', newTheme)

        // 应用主题到DOM
        document.documentElement.setAttribute('data-theme', newTheme)

        // 触发主题变化事件
        window.dispatchEvent(new CustomEvent('theme-change', { detail: newTheme }))
    }

    const toggleTheme = () => {
        const newTheme = theme.value === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
    }

    // 语言管理
    const setLanguage = (newLanguage) => {
        language.value = newLanguage
        localStorage.setItem('language', newLanguage)

        // 触发语言变化事件
        window.dispatchEvent(new CustomEvent('language-change', { detail: newLanguage }))
    }

    // 侧边栏管理
    const toggleSidebar = () => {
        sidebarCollapsed.value = !sidebarCollapsed.value
    }

    const setSidebarCollapsed = (collapsed) => {
        sidebarCollapsed.value = collapsed
    }

    // 通知管理
    const addNotification = (notification) => {
        const id = Date.now() + Math.random()
        const newNotification = {
            id,
            read: false,
            timestamp: new Date().toISOString(),
            ...notification
        }

        notifications.value.unshift(newNotification)

        // 限制通知数量
        if (notifications.value.length > 50) {
            notifications.value = notifications.value.slice(0, 50)
        }

        return id
    }

    const removeNotification = (id) => {
        const index = notifications.value.findIndex(n => n.id === id)
        if (index > -1) {
            notifications.value.splice(index, 1)
        }
    }

    const markNotificationAsRead = (id) => {
        const notification = notifications.value.find(n => n.id === id)
        if (notification) {
            notification.read = true
        }
    }

    const markAllNotificationsAsRead = () => {
        notifications.value.forEach(n => n.read = true)
    }

    const clearNotifications = () => {
        notifications.value = []
    }

    // 加载状态管理
    const showLoading = (text = '加载中...') => {
        loading.value = true
        loadingText.value = text
    }

    const hideLoading = () => {
        loading.value = false
        loadingText.value = '加载中...'
    }

    // 响应式管理
    const updateWindowSize = () => {
        windowSize.value = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        isMobile.value = window.innerWidth <= 768
    }

    const handleResize = () => {
        updateWindowSize()
    }

    // 初始化
    const init = () => {
        // 应用初始主题
        document.documentElement.setAttribute('data-theme', theme.value)

        // 监听窗口大小变化
        updateWindowSize()
        window.addEventListener('resize', handleResize)

        // 从本地存储加载通知
        loadNotificationsFromStorage()
    }

    // 本地存储
    const saveNotificationsToStorage = () => {
        try {
            localStorage.setItem('notifications', JSON.stringify(notifications.value))
        } catch (error) {
            console.error('保存通知失败:', error)
        }
    }

    const loadNotificationsFromStorage = () => {
        try {
            const saved = localStorage.getItem('notifications')
            if (saved) {
                notifications.value = JSON.parse(saved)
            }
        } catch (error) {
            console.error('加载通知失败:', error)
        }
    }

    // 清理
    const cleanup = () => {
        window.removeEventListener('resize', handleResize)
    }

    return {
        // 状态
        theme,
        language,
        sidebarCollapsed,
        notifications,
        loading,
        loadingText,
        isMobile,
        windowSize,

        // 计算属性
        isDarkMode,
        notificationCount,
        unreadNotificationCount,

        // 主题管理
        setTheme,
        toggleTheme,

        // 语言管理
        setLanguage,

        // 侧边栏管理
        toggleSidebar,
        setSidebarCollapsed,

        // 通知管理
        addNotification,
        removeNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        saveNotificationsToStorage,
        loadNotificationsFromStorage,

        // 加载状态管理
        showLoading,
        hideLoading,

        // 响应式管理
        updateWindowSize,

        // 初始化和清理
        init,
        cleanup
    }
}) 