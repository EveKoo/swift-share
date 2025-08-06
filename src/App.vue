<template>
  <div id="app">
    <!-- 全局导航头部 -->
    <SwiftHeader 
      :is-fixed="isHeaderFixed"
      @show-login="showLoginModal"
      @show-register="showRegisterModal"
    />
    
    <!-- 主要内容区域 -->
    <main class="app-main" :class="{ 'with-fixed-header': isHeaderFixed }">
      <router-view v-slot="{ Component, route }">
        <transition name="page-transition" mode="out-in">
          <keep-alive :include="cachedPages">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </main>

    <!-- 登录模态框 -->
    <el-dialog
      v-model="showLogin"
      title="登录 SwiftShare"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <SwiftLogin 
        @login-success="handleLoginSuccess"
        @switch-to-register="switchToRegister"
      />
    </el-dialog>

    <!-- 注册模态框 -->
    <el-dialog
      v-model="showRegister"
      title="注册 SwiftShare"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <SwiftRegister 
        @register-success="handleRegisterSuccess"
        @switch-to-login="switchToLogin"
      />
    </el-dialog>

    <!-- 全局加载状态 -->
    <div v-if="appStore.loading" class="global-loading">
        <el-loading />
        <p>{{ appStore.loadingText }}</p>
    </div>

    <!-- 返回顶部按钮 -->
    <el-backtop 
      :right="40" 
      :bottom="40"
      :visibility-height="300"
    />

    <!-- 通知中心 -->
    <NotificationCenter />
    
    <!-- 全局错误处理 -->
    <div v-if="appStore.error" class="global-error">
      <el-alert
        :title="appStore.error.title"
        :description="appStore.error.message"
        type="error"
        :closable="true"
        @close="appStore.clearError"
        show-icon
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import SwiftHeader from '@/views/swift/SwiftHeader.vue'
import SwiftLogin from '@/views/swift/SwiftLogin.vue'
import SwiftRegister from '@/views/swift/SwiftRegister.vue'
import NotificationCenter from '@/components/NotificationCenter.vue'
import { useAppStore, useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'

export default {
  name: 'App',
  components: {
    SwiftHeader,
    SwiftLogin,
    SwiftRegister,
    NotificationCenter
  },
  setup() {
    const route = useRoute()
    const appStore = useAppStore()
    const userStore = useUserStore()
    
    const showLogin = ref(false)
    const showRegister = ref(false)
    const isHeaderFixed = ref(false)
    const scrollY = ref(0)

      // 需要缓存的页面
      const cachedPages = computed(() => {
        const pages = ['SwiftHome', 'SwiftMusic', 'SwiftVideos', 'SwiftCommunity', 'SwiftNews']
        return pages.filter(() => route.meta?.keepAlive)
      })

      // 显示登录模态框
      const showLoginModal = () => {
        showLogin.value = true
      }

      // 显示注册模态框
      const showRegisterModal = () => {
        showRegister.value = true
      }

      // 处理登录成功
      const handleLoginSuccess = () => {
        showLogin.value = false
        ElMessage.success('登录成功！欢迎回到 SwiftShare')
      }

      // 处理注册成功
      const handleRegisterSuccess = () => {
        showRegister.value = false
        showLogin.value = true
        ElMessage.success('注册成功！请登录您的账户')
      }

      // 切换到注册
      const switchToRegister = () => {
        showLogin.value = false
        showRegister.value = true
      }

      // 切换到登录
      const switchToLogin = () => {
        showRegister.value = false
        showLogin.value = true
      }

      // 监听滚动事件
      const handleScroll = () => {
        scrollY.value = window.scrollY
        isHeaderFixed.value = scrollY.value > 100
      }

      onMounted(() => {
        window.addEventListener('scroll', handleScroll)
      })

      onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll)
      })

      return {
        appStore,
        userStore,
        showLogin,
        showRegister,
        isHeaderFixed,
        cachedPages,
        showLoginModal,
        showRegisterModal,
        handleLoginSuccess,
        handleRegisterSuccess,
        switchToRegister,
        switchToLogin
      }
  }
}
</script>

<style>
/* 重置默认样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--swift-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  background: var(--swift-bg-gradient, linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%));
  color: var(--swift-text-primary, #333333);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主内容区域 */
.app-main {
  flex: 1;
  padding-top: 0;
  transition: padding-top 0.3s ease;
}

.app-main.with-fixed-header {
  padding-top: 64px;
}

/* 页面切换动画 */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.3s ease;
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 全局加载状态 */
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.global-loading p {
  margin-top: 16px;
  color: var(--swift-pink);
  font-weight: 500;
}

/* 注册占位符样式 */
.register-placeholder {
  padding: 20px 0;
}

/* Element Plus 组件样式优化 */
.el-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.el-dialog__header {
  background: linear-gradient(135deg, var(--swift-pink) 0%, var(--swift-purple) 100%);
  color: white;
  padding: 20px 24px;
}

.el-dialog__title {
  color: white;
  font-weight: 600;
}

.el-dialog__headerbtn .el-dialog__close {
  color: white;
}

.el-dialog__body {
  padding: 24px;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--swift-pink);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--swift-dark-pink);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-main.with-fixed-header {
    padding-top: 56px;
  }
  
  .el-dialog {
    width: 90% !important;
    margin: 5vh auto;
  }
}

/* 全局错误处理 */
.global-error {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  max-width: 500px;
  width: 90%;
}

/* 打印样式 */
@media print {
  .swift-header,
  .el-backtop,
  .global-loading,
  .global-error {
    display: none !important;
  }
  
  .app-main {
    padding-top: 0 !important;
  }
}
</style>
