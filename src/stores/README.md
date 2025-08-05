# Pinia 状态管理使用指南

## 概述

本项目使用 Pinia 作为状态管理库，替代了 Vuex。Pinia 提供了更简洁的 API 和更好的 TypeScript 支持。

## Store 结构

### 1. 用户状态管理 (`user.js`)

管理用户登录、注册、用户信息等状态。

```javascript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 登录
await userStore.login({ username: 'test', password: '123456' })

// 获取用户信息
console.log(userStore.userInfo)

// 检查登录状态
if (userStore.isLoggedIn) {
  console.log('用户已登录')
}

// 登出
userStore.logout()
```

### 2. 音乐播放器状态管理 (`music.js`)

管理音乐播放、播放列表、播放控制等状态。

```javascript
import { useMusicStore } from '@/stores/music'

const musicStore = useMusicStore()

// 播放音乐
musicStore.play(song)

// 暂停
musicStore.pause()

// 下一首
musicStore.next()

// 添加到播放列表
musicStore.addToPlaylist(song)

// 获取当前播放进度
console.log(musicStore.progress)
```

### 3. 视频播放器状态管理 (`video.js`)

管理视频播放、历史记录、收藏等状态。

```javascript
import { useVideoStore } from '@/stores/video'

const videoStore = useVideoStore()

// 播放视频
videoStore.play(video)

// 添加到收藏
videoStore.toggleFavorite(video)

// 获取播放历史
console.log(videoStore.videoHistory)

// 设置播放速度
videoStore.setPlaybackRate(1.5)
```

### 4. 应用全局状态管理 (`app.js`)

管理主题、语言、通知、加载状态等全局状态。

```javascript
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 切换主题
appStore.toggleTheme()

// 添加通知
appStore.addNotification({
  type: 'success',
  title: '成功',
  message: '操作成功'
})

// 显示加载状态
appStore.showLoading('正在加载...')
appStore.hideLoading()
```

## 在组件中使用

### 基本用法

```vue
<template>
  <div>
    <p>欢迎，{{ userStore.username }}</p>
    <button @click="userStore.logout">登出</button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>
```

### 响应式状态

```vue
<script setup>
import { useMusicStore } from '@/stores/music'
import { storeToRefs } from 'pinia'

const musicStore = useMusicStore()

// 使用 storeToRefs 保持响应性
const { currentSong, isPlaying, progress } = storeToRefs(musicStore)
</script>
```

### 计算属性

```vue
<script setup>
import { useVideoStore } from '@/stores/video'

const videoStore = useVideoStore()

// 计算属性会自动更新
console.log(videoStore.isFavorite) // 当前视频是否已收藏
console.log(videoStore.historyCount) // 历史记录数量
</script>
```

## 状态持久化

### 自动持久化

某些状态会自动保存到 localStorage：

- 用户登录状态和用户信息
- 主题设置
- 语言设置
- 视频播放历史
- 视频收藏

### 手动持久化

```javascript
// 保存状态
localStorage.setItem('myData', JSON.stringify(data))

// 恢复状态
const data = JSON.parse(localStorage.getItem('myData'))
```

## 最佳实践

### 1. 状态分离

将不同功能的状态分离到不同的 store 中：

- `user.js` - 用户相关状态
- `music.js` - 音乐播放相关状态
- `video.js` - 视频播放相关状态
- `app.js` - 应用全局状态

### 2. 使用计算属性

对于需要基于其他状态计算的值，使用计算属性：

```javascript
const hasNext = computed(() => {
  return currentIndex.value < playlist.value.length - 1
})
```

### 3. 异步操作

在 store 中处理异步操作：

```javascript
const login = async (loginData) => {
  loading.value = true
  try {
    const response = await userApi.login(loginData)
    // 处理响应
  } catch (error) {
    // 处理错误
  } finally {
    loading.value = false
  }
}
```

### 4. 错误处理

在 store 中统一处理错误：

```javascript
try {
  // 异步操作
} catch (error) {
  ElMessage.error(error.message || '操作失败')
  console.error('操作错误:', error)
}
```

### 5. 资源清理

在组件卸载时清理资源：

```javascript
onUnmounted(() => {
  musicStore.cleanup()
  videoStore.cleanup()
})
```

## 调试

### Vue DevTools

安装 Vue DevTools 可以查看和调试 Pinia 状态：

1. 安装 Vue DevTools 浏览器扩展
2. 打开开发者工具
3. 切换到 Pinia 标签页
4. 查看和修改状态

### 控制台调试

```javascript
// 在控制台中访问 store
const userStore = useUserStore()
console.log(userStore.userInfo)

// 修改状态（仅用于调试）
userStore.userInfo = { ... }
```

## 迁移指南

### 从 Vuex 迁移

1. 安装 Pinia：`npm install pinia`
2. 配置 Pinia：在 main.js 中添加 `createPinia()`
3. 将 Vuex modules 转换为 Pinia stores
4. 更新组件中的状态访问方式
5. 移除 Vuex 相关代码

### 主要变化

- `this.$store.state` → `useStore()`
- `this.$store.commit` → 直接修改状态
- `this.$store.dispatch` → 调用 store 方法
- `mapState` → `storeToRefs`

## 注意事项

1. **状态响应性**：使用 `storeToRefs` 保持响应性
2. **异步操作**：在 store 中处理异步操作
3. **错误处理**：统一处理错误和异常
4. **资源清理**：及时清理事件监听器和定时器
5. **性能优化**：避免在 store 中存储大量数据 