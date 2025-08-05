import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoggedIn = ref(!!token.value)
  const loading = ref(false)

  // 计算属性
  const username = computed(() => userInfo.value?.username || '')
  const avatar = computed(() => userInfo.value?.avatar || '/images/default-avatar.jpg')
  const userId = computed(() => userInfo.value?.id || null)

  // 登录
  const login = async (loginData) => {
    loading.value = true
    try {
      const response = await userApi.login(loginData)
      const { token: userToken, user } = response.data

      // 保存token和用户信息
      token.value = userToken
      userInfo.value = user
      isLoggedIn.value = true

      // 保存到本地存储
      localStorage.setItem('token', userToken)
      localStorage.setItem('userInfo', JSON.stringify(user))

      ElMessage.success('登录成功！')
      return { success: true }
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '登录失败，请重试')
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  // 注册
  const register = async (registerData) => {
    loading.value = true
    try {
      await userApi.register(registerData)
      ElMessage.success('注册成功！请登录')
      return { success: true }
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '注册失败，请重试')
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = () => {
    token.value = null
    userInfo.value = null
    isLoggedIn.value = false

    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')

    ElMessage.success('已退出登录')
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) return

    try {
      const response = await userApi.getUserInfo()
      userInfo.value = response.data
      localStorage.setItem('userInfo', JSON.stringify(response.data))
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // token可能过期，清除登录状态
      logout()
    }
  }

  // 更新用户信息
  const updateUserInfo = async (userData) => {
    loading.value = true
    try {
      const response = await userApi.updateUserInfo(userData)
      userInfo.value = { ...userInfo.value, ...response.data }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      ElMessage.success('用户信息更新成功')
      return { success: true }
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '更新失败，请重试')
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  // 初始化用户状态
  const initUserState = () => {
    if (token.value) {
      const savedUserInfo = localStorage.getItem('userInfo')
      if (savedUserInfo) {
        try {
          userInfo.value = JSON.parse(savedUserInfo)
        } catch (error) {
          console.error('解析用户信息失败:', error)
          logout()
        }
      } else {
        fetchUserInfo()
      }
    }
  }

  return {
    // 状态
    userInfo,
    token,
    isLoggedIn,
    loading,

    // 计算属性
    username,
    avatar,
    userId,

    // 方法
    login,
    register,
    logout,
    fetchUserInfo,
    updateUserInfo,
    initUserState
  }
}) 