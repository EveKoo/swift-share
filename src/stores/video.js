import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

export const useVideoStore = defineStore('video', () => {
    // 状态
    const currentVideo = ref(null)
    const isPlaying = ref(false)
    const currentTime = ref(0)
    const duration = ref(0)
    const volume = ref(0.7)
    const isMuted = ref(false)
    const isFullscreen = ref(false)
    const playbackRate = ref(1.0)
    const videoHistory = ref([])
    const favorites = ref([])
    const videoElement = ref(null)

    // 计算属性
    const progress = computed(() => {
        if (duration.value === 0) return 0
        return (currentTime.value / duration.value) * 100
    })

    const isFavorite = computed(() => {
        if (!currentVideo.value) return false
        return favorites.value.some(video => video.id === currentVideo.value.id)
    })

    const historyCount = computed(() => videoHistory.value.length)
    const favoritesCount = computed(() => favorites.value.length)

    // 播放控制
    const play = (video = null) => {
        if (video) {
            currentVideo.value = video
            addToHistory(video)
        }

        if (videoElement.value) {
            videoElement.value.play()
            isPlaying.value = true
        }
    }

    const pause = () => {
        if (videoElement.value) {
            videoElement.value.pause()
            isPlaying.value = false
        }
    }

    const togglePlay = () => {
        if (isPlaying.value) {
            pause()
        } else {
            play()
        }
    }

    const seek = (time) => {
        if (videoElement.value) {
            videoElement.value.currentTime = time
            currentTime.value = time
        }
    }

    const setVolume = (vol) => {
        volume.value = vol
        if (videoElement.value) {
            videoElement.value.volume = vol
        }
    }

    const toggleMute = () => {
        isMuted.value = !isMuted.value
        if (videoElement.value) {
            videoElement.value.muted = isMuted.value
        }
    }

    const setPlaybackRate = (rate) => {
        playbackRate.value = rate
        if (videoElement.value) {
            videoElement.value.playbackRate = rate
        }
        ElMessage.success(`播放速度：${rate}x`)
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (videoElement.value?.requestFullscreen) {
                videoElement.value.requestFullscreen()
                isFullscreen.value = true
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
                isFullscreen.value = false
            }
        }
    }

    // 历史记录管理
    const addToHistory = (video) => {
        // 移除已存在的相同视频
        const index = videoHistory.value.findIndex(v => v.id === video.id)
        if (index > -1) {
            videoHistory.value.splice(index, 1)
        }

        // 添加到开头
        videoHistory.value.unshift({
            ...video,
            watchTime: new Date().toISOString()
        })

        // 限制历史记录数量
        if (videoHistory.value.length > 50) {
            videoHistory.value = videoHistory.value.slice(0, 50)
        }

        // 保存到本地存储
        saveHistoryToStorage()
    }

    const removeFromHistory = (videoId) => {
        const index = videoHistory.value.findIndex(v => v.id === videoId)
        if (index > -1) {
            videoHistory.value.splice(index, 1)
            saveHistoryToStorage()
            ElMessage.success('已从历史记录移除')
        }
    }

    const clearHistory = () => {
        videoHistory.value = []
        saveHistoryToStorage()
        ElMessage.success('历史记录已清空')
    }

    const saveHistoryToStorage = () => {
        try {
            localStorage.setItem('videoHistory', JSON.stringify(videoHistory.value))
        } catch (error) {
            console.error('保存历史记录失败:', error)
        }
    }

    const loadHistoryFromStorage = () => {
        try {
            const saved = localStorage.getItem('videoHistory')
            if (saved) {
                videoHistory.value = JSON.parse(saved)
            }
        } catch (error) {
            console.error('加载历史记录失败:', error)
        }
    }

    // 收藏管理
    const toggleFavorite = (video) => {
        const index = favorites.value.findIndex(v => v.id === video.id)
        if (index > -1) {
            favorites.value.splice(index, 1)
            ElMessage.success('已取消收藏')
        } else {
            favorites.value.push({
                ...video,
                favoriteTime: new Date().toISOString()
            })
            ElMessage.success('已添加到收藏')
        }
        saveFavoritesToStorage()
    }

    const removeFromFavorites = (videoId) => {
        const index = favorites.value.findIndex(v => v.id === videoId)
        if (index > -1) {
            favorites.value.splice(index, 1)
            saveFavoritesToStorage()
            ElMessage.success('已从收藏移除')
        }
    }

    const clearFavorites = () => {
        favorites.value = []
        saveFavoritesToStorage()
        ElMessage.success('收藏已清空')
    }

    const saveFavoritesToStorage = () => {
        try {
            localStorage.setItem('videoFavorites', JSON.stringify(favorites.value))
        } catch (error) {
            console.error('保存收藏失败:', error)
        }
    }

    const loadFavoritesFromStorage = () => {
        try {
            const saved = localStorage.getItem('videoFavorites')
            if (saved) {
                favorites.value = JSON.parse(saved)
            }
        } catch (error) {
            console.error('加载收藏失败:', error)
        }
    }

    // 视频事件处理
    const onTimeUpdate = (event) => {
        currentTime.value = event.target.currentTime
    }

    const onLoadedMetadata = (event) => {
        duration.value = event.target.duration
    }

    const onEnded = () => {
        isPlaying.value = false
        currentTime.value = 0
        ElMessage.info('视频播放完成')
    }

    const onError = (error) => {
        ElMessage.error('视频播放出错，请检查视频文件')
        console.error('Video error:', error)
    }

    const onFullscreenChange = () => {
        isFullscreen.value = !!document.fullscreenElement
    }

    // 初始化视频元素
    const initVideoElement = (element) => {
        videoElement.value = element
        if (element) {
            element.addEventListener('timeupdate', onTimeUpdate)
            element.addEventListener('loadedmetadata', onLoadedMetadata)
            element.addEventListener('ended', onEnded)
            element.addEventListener('error', onError)
            document.addEventListener('fullscreenchange', onFullscreenChange)

            // 设置初始属性
            element.volume = volume.value
            element.playbackRate = playbackRate.value
        }
    }

    // 清理
    const cleanup = () => {
        if (videoElement.value) {
            videoElement.value.removeEventListener('timeupdate', onTimeUpdate)
            videoElement.value.removeEventListener('loadedmetadata', onLoadedMetadata)
            videoElement.value.removeEventListener('ended', onEnded)
            videoElement.value.removeEventListener('error', onError)
            document.removeEventListener('fullscreenchange', onFullscreenChange)
            videoElement.value = null
        }
    }

    // 初始化
    const init = () => {
        loadHistoryFromStorage()
        loadFavoritesFromStorage()
    }

    return {
        // 状态
        currentVideo,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isFullscreen,
        playbackRate,
        videoHistory,
        favorites,
        videoElement,

        // 计算属性
        progress,
        isFavorite,
        historyCount,
        favoritesCount,

        // 播放控制
        play,
        pause,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        setPlaybackRate,
        toggleFullscreen,

        // 历史记录管理
        addToHistory,
        removeFromHistory,
        clearHistory,
        saveHistoryToStorage,
        loadHistoryFromStorage,

        // 收藏管理
        toggleFavorite,
        removeFromFavorites,
        clearFavorites,
        saveFavoritesToStorage,
        loadFavoritesFromStorage,

        // 视频控制
        initVideoElement,
        cleanup,
        init
    }
}) 