// 直接复制整个文件内容
import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        console.log('发送请求:', config.method.toUpperCase(), config.url)

        // 添加token到请求头
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    error => {
        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        console.log('收到响应:', response.config.url, response.data)

        // 统一处理响应数据
        const { code, message, data } = response.data

        if (code === 200 || code === undefined) {
            return data || response.data
        } else {
            ElMessage.error(message || '请求失败')
            return Promise.reject(new Error(message || '请求失败'))
        }
    },
    error => {
        console.error('响应错误:', error)

        if (error.response) {
            const { status, data } = error.response

            switch (status) {
                case 401:
                    ElMessage.error('未授权，请重新登录')
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                    break
                case 403:
                    ElMessage.error('权限不足')
                    break
                case 404:
                    ElMessage.error('请求的资源不存在')
                    break
                case 500:
                    ElMessage.error('服务器内部错误')
                    break
                default:
                    ElMessage.error(data.message || '请求失败')
            }
        } else if (error.request) {
            ElMessage.error('网络错误，请检查网络连接')
        } else {
            ElMessage.error('请求配置错误')
        }

        return Promise.reject(error)
    }
)

export default request