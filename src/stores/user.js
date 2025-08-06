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
      // 尝试调用真实API
      const response = await userApi.login(loginData)
      const { token: apiToken, user } = response

      token.value = apiToken
      userInfo.value = user
      isLoggedIn.value = true

      // 保存到本地存储
      localStorage.setItem('token', apiToken)
      localStorage.setItem('userInfo', JSON.stringify(user))

      ElMessage.success('登录成功')
      return { success: true }
    } catch (error) {
      console.warn('API登录失败，使用模拟登录:', error)

      // 模拟登录逻辑
      try {
        const result = await simulateLogin(loginData)
        if (result.success) {
          ElMessage.success('模拟登录成功')
        }
        return result
      } catch (simulateError) {
        // 只有在模拟登录也失败时才显示错误
        ElMessage.error('登录失败，请检查用户名和密码')
        return { success: false, error: simulateError }
      }
    } finally {
      loading.value = false
    }
  }

  // 模拟登录功能
  const simulateLogin = async (loginData) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    // 从本地存储获取模拟用户
    const simulatedUsers = JSON.parse(localStorage.getItem('simulatedUsers') || '[]')
    const user = simulatedUsers.find(u =>
      u.username === loginData.username || u.email === loginData.username
    )

    if (!user) {
      throw new Error('用户不存在')
    }

    // 模拟密码验证（实际项目中应该使用加密密码）
    if (loginData.password !== '123456') {
      throw new Error('密码错误')
    }

    // 生成模拟token
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 设置登录状态
    token.value = mockToken
    userInfo.value = user
    isLoggedIn.value = true

    // 保存到本地存储
    localStorage.setItem('token', mockToken)
    localStorage.setItem('userInfo', JSON.stringify(user))

    return { success: true }
  }

  // 注册
  const register = async (registerData) => {
    loading.value = true
    try {
      // 尝试调用真实API
      await userApi.register(registerData)
      ElMessage.success('注册成功！请登录')
      return { success: true }
    } catch (error) {
      console.warn('API注册失败，使用模拟注册:', error)

      // 模拟注册逻辑
      try {
        await simulateRegister(registerData)
        ElMessage.success('模拟注册成功！请登录')
        return { success: true }
      } catch (simulateError) {
        // 只有在模拟注册也失败时才显示错误
        ElMessage.error('注册失败，请重试')
        return { success: false, error: simulateError }
      }
    } finally {
      loading.value = false
    }
  }

  // 模拟注册功能
  const simulateRegister = async (registerData) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 检查用户是否已存在（模拟）
    const existingUsers = JSON.parse(localStorage.getItem('simulatedUsers') || '[]')
    const existingUser = existingUsers.find(user =>
      user.username === registerData.username || user.email === registerData.email
    )

    if (existingUser) {
      throw new Error('用户名或邮箱已存在')
    }

    // 创建新用户
    const newUser = {
      id: Date.now(),
      username: registerData.username,
      email: registerData.email,
      nickname: registerData.nickname,
      role: 'user',
      avatar: '',
      createdAt: new Date().toISOString()
    }

    // 保存到本地存储
    existingUsers.push(newUser)
    localStorage.setItem('simulatedUsers', JSON.stringify(existingUsers))

    return newUser
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