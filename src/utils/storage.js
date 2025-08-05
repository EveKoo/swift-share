// 本地存储工具函数
export const storage = {
    // 设置存储
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error('Storage set error:', error)
        }
    },

    // 获取存储
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : defaultValue
        } catch (error) {
            console.error('Storage get error:', error)
            return defaultValue
        }
    },

    // 移除存储
    remove(key) {
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error('Storage remove error:', error)
        }
    },

    // 清空所有存储
    clear() {
        try {
            localStorage.clear()
        } catch (error) {
            console.error('Storage clear error:', error)
        }
    },

    // 检查是否存在
    has(key) {
        return localStorage.getItem(key) !== null
    },

    // 获取所有键
    keys() {
        return Object.keys(localStorage)
    },

    // 获取存储大小
    size() {
        return localStorage.length
    }
}

// 会话存储工具函数
export const sessionStorage = {
    // 设置存储
    set(key, value) {
        try {
            window.sessionStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error('SessionStorage set error:', error)
        }
    },

    // 获取存储
    get(key, defaultValue = null) {
        try {
            const item = window.sessionStorage.getItem(key)
            return item ? JSON.parse(item) : defaultValue
        } catch (error) {
            console.error('SessionStorage get error:', error)
            return defaultValue
        }
    },

    // 移除存储
    remove(key) {
        try {
            window.sessionStorage.removeItem(key)
        } catch (error) {
            console.error('SessionStorage remove error:', error)
        }
    },

    // 清空所有存储
    clear() {
        try {
            window.sessionStorage.clear()
        } catch (error) {
            console.error('SessionStorage clear error:', error)
        }
    },

    // 检查是否存在
    has(key) {
        return window.sessionStorage.getItem(key) !== null
    },

    // 获取所有键
    keys() {
        return Object.keys(window.sessionStorage)
    },

    // 获取存储大小
    size() {
        return window.sessionStorage.length
    }
}

// 缓存工具函数
export const cache = {
    // 内存缓存
    memory: new Map(),

    // 设置缓存
    set(key, value, ttl = 0) {
        const item = {
            value,
            timestamp: Date.now(),
            ttl
        }
        this.memory.set(key, item)
    },

    // 获取缓存
    get(key) {
        const item = this.memory.get(key)
        if (!item) return null

        // 检查是否过期
        if (item.ttl > 0 && Date.now() - item.timestamp > item.ttl) {
            this.memory.delete(key)
            return null
        }

        return item.value
    },

    // 移除缓存
    remove(key) {
        this.memory.delete(key)
    },

    // 清空缓存
    clear() {
        this.memory.clear()
    },

    // 检查是否存在
    has(key) {
        return this.memory.has(key)
    },

    // 获取缓存大小
    size() {
        return this.memory.size
    }
}

export default {
    storage,
    sessionStorage,
    cache
} 