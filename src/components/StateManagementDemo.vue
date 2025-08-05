<template>
  <div class="state-management-demo">
    <el-card>
      <template #header>
        <div class="demo-header">
          <span>状态管理演示</span>
          <el-button @click="refreshData" size="small">刷新</el-button>
        </div>
      </template>

      <!-- 用户状态 -->
      <el-divider content-position="left">用户状态</el-divider>
      <div class="demo-section">
        <p><strong>登录状态:</strong> {{ userStore.isLoggedIn ? '已登录' : '未登录' }}</p>
        <p><strong>用户名:</strong> {{ userStore.username || '未登录' }}</p>
        <p><strong>加载状态:</strong> {{ userStore.loading ? '加载中...' : '空闲' }}</p>
        
        <div class="demo-actions">
          <el-button 
            v-if="!userStore.isLoggedIn" 
            @click="mockLogin" 
            type="primary"
            size="small"
          >
            模拟登录
          </el-button>
          <el-button 
            v-else 
            @click="userStore.logout" 
            type="danger"
            size="small"
          >
            登出
          </el-button>
        </div>
      </div>

      <!-- 音乐播放器状态 -->
      <el-divider content-position="left">音乐播放器状态</el-divider>
      <div class="demo-section">
        <p><strong>当前歌曲:</strong> {{ musicStore.currentSong?.title || '无' }}</p>
        <p><strong>播放状态:</strong> {{ musicStore.isPlaying ? '播放中' : '已暂停' }}</p>
        <p><strong>播放进度:</strong> {{ musicStore.progress.toFixed(1) }}%</p>
        <p><strong>播放列表:</strong> {{ musicStore.playlist.length }} 首歌曲</p>
        
        <div class="demo-actions">
          <el-button @click="addMockSong" size="small">添加歌曲</el-button>
          <el-button @click="musicStore.clearPlaylist" size="small">清空列表</el-button>
        </div>
      </div>

      <!-- 视频播放器状态 -->
      <el-divider content-position="left">视频播放器状态</el-divider>
      <div class="demo-section">
        <p><strong>当前视频:</strong> {{ videoStore.currentVideo?.title || '无' }}</p>
        <p><strong>播放状态:</strong> {{ videoStore.isPlaying ? '播放中' : '已暂停' }}</p>
        <p><strong>播放进度:</strong> {{ videoStore.progress.toFixed(1) }}%</p>
        <p><strong>历史记录:</strong> {{ videoStore.historyCount }} 个视频</p>
        <p><strong>收藏数量:</strong> {{ videoStore.favoritesCount }} 个视频</p>
        
        <div class="demo-actions">
          <el-button @click="addMockVideo" size="small">添加视频</el-button>
          <el-button @click="videoStore.clearHistory" size="small">清空历史</el-button>
        </div>
      </div>

      <!-- 应用全局状态 -->
      <el-divider content-position="left">应用全局状态</el-divider>
      <div class="demo-section">
        <p><strong>当前主题:</strong> {{ appStore.theme }}</p>
        <p><strong>深色模式:</strong> {{ appStore.isDarkMode ? '是' : '否' }}</p>
        <p><strong>通知数量:</strong> {{ appStore.notificationCount }}</p>
        <p><strong>未读通知:</strong> {{ appStore.unreadNotificationCount }}</p>
        <p><strong>移动端:</strong> {{ appStore.isMobile ? '是' : '否' }}</p>
        
        <div class="demo-actions">
          <el-button @click="appStore.toggleTheme" size="small">切换主题</el-button>
          <el-button @click="addNotification" size="small">添加通知</el-button>
          <el-button @click="appStore.clearNotifications" size="small">清空通知</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useUserStore, useMusicStore, useVideoStore, useAppStore } from '@/stores'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const musicStore = useMusicStore()
const videoStore = useVideoStore()
const appStore = useAppStore()

// 模拟登录
const mockLogin = async () => {
  const mockUser = {
    username: 'demo_user',
    password: '123456'
  }
  
  await userStore.login(mockUser)
}

// 添加模拟歌曲
const addMockSong = () => {
  const mockSong = {
    id: Date.now(),
    title: `Demo Song ${musicStore.playlist.length + 1}`,
    artist: 'Demo Artist',
    duration: 180,
    url: '/audio/demo.mp3',
    cover: '/images/demo-cover.jpg'
  }
  
  musicStore.addToPlaylist(mockSong)
  ElMessage.success('已添加模拟歌曲')
}

// 添加模拟视频
const addMockVideo = () => {
  const mockVideo = {
    id: Date.now(),
    title: `Demo Video ${videoStore.videoHistory.length + 1}`,
    description: '这是一个演示视频',
    duration: 300,
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    cover: '/images/demo-video-cover.jpg'
  }
  
  videoStore.addToHistory(mockVideo)
  ElMessage.success('已添加模拟视频到历史记录')
}

// 添加通知
const addNotification = () => {
  const notification = {
    type: 'info',
    title: '演示通知',
    message: `这是第 ${appStore.notificationCount + 1} 条演示通知`,
    timestamp: new Date().toISOString()
  }
  
  appStore.addNotification(notification)
  ElMessage.success('已添加通知')
}

// 刷新数据
const refreshData = () => {
  ElMessage.info('数据已刷新')
}
</script>

<style scoped>
.state-management-demo {
  max-width: 800px;
  margin: 20px auto;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-section {
  margin: 16px 0;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.demo-section p {
  margin: 8px 0;
  font-size: 14px;
}

.demo-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.el-divider {
  margin: 24px 0 16px 0;
}
</style> 