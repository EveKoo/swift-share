// 统一导出所有store
export { useUserStore } from './user'
export { useMusicStore } from './music'
export { useVideoStore } from './video'
export { useAppStore } from './app'

// 初始化所有store
export const initStores = () => {
  const { useAppStore } = require('./app')
  const { useUserStore } = require('./user')
  const { useVideoStore } = require('./video')

  const appStore = useAppStore()
  const userStore = useUserStore()
  const videoStore = useVideoStore()

  // 初始化应用状态
  appStore.init()
  
  // 初始化用户状态
  userStore.initUserState()
  
  // 初始化视频状态
  videoStore.init()
  
  console.log('所有状态管理已初始化')
}

// 清理所有store
export const cleanupStores = () => {
  const { useAppStore } = require('./app')
  const { useMusicStore } = require('./music')
  const { useVideoStore } = require('./video')

  const appStore = useAppStore()
  const musicStore = useMusicStore()
  const videoStore = useVideoStore()

  // 清理资源
  appStore.cleanup()
  musicStore.cleanup()
  videoStore.cleanup()
  
  console.log('所有状态管理已清理')
} 