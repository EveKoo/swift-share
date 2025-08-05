import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

export const useMusicStore = defineStore('music', () => {
    // 状态
    const currentSong = ref(null)
    const playlist = ref([])
    const isPlaying = ref(false)
    const currentTime = ref(0)
    const duration = ref(0)
    const volume = ref(0.7)
    const isMuted = ref(false)
    const playMode = ref('sequence') // sequence, loop, random
    const audioElement = ref(null)

    // 计算属性
    const currentIndex = computed(() => {
        if (!currentSong.value || playlist.value.length === 0) return -1
        return playlist.value.findIndex(song => song.id === currentSong.value.id)
    })

    const hasNext = computed(() => {
        if (playlist.value.length === 0) return false
        if (playMode.value === 'loop') return true
        return currentIndex.value < playlist.value.length - 1
    })

    const hasPrev = computed(() => {
        if (playlist.value.length === 0) return false
        if (playMode.value === 'loop') return true
        return currentIndex.value > 0
    })

    const progress = computed(() => {
        if (duration.value === 0) return 0
        return (currentTime.value / duration.value) * 100
    })

    // 播放控制
    const play = (song = null) => {
        if (song) {
            currentSong.value = song
            // 如果歌曲不在播放列表中，添加到播放列表
            if (!playlist.value.find(s => s.id === song.id)) {
                playlist.value.push(song)
            }
        }

        if (audioElement.value) {
            audioElement.value.play()
            isPlaying.value = true
        }
    }

    const pause = () => {
        if (audioElement.value) {
            audioElement.value.pause()
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

    const next = () => {
        if (playlist.value.length === 0) return

        let nextIndex
        if (playMode.value === 'random') {
            nextIndex = Math.floor(Math.random() * playlist.value.length)
        } else {
            nextIndex = currentIndex.value + 1
            if (nextIndex >= playlist.value.length) {
                if (playMode.value === 'loop') {
                    nextIndex = 0
                } else {
                    return // 播放结束
                }
            }
        }

        play(playlist.value[nextIndex])
    }

    const prev = () => {
        if (playlist.value.length === 0) return

        let prevIndex
        if (playMode.value === 'random') {
            prevIndex = Math.floor(Math.random() * playlist.value.length)
        } else {
            prevIndex = currentIndex.value - 1
            if (prevIndex < 0) {
                if (playMode.value === 'loop') {
                    prevIndex = playlist.value.length - 1
                } else {
                    return
                }
            }
        }

        play(playlist.value[prevIndex])
    }

    const seek = (time) => {
        if (audioElement.value) {
            audioElement.value.currentTime = time
            currentTime.value = time
        }
    }

    const setVolume = (vol) => {
        volume.value = vol
        if (audioElement.value) {
            audioElement.value.volume = vol
        }
    }

    const toggleMute = () => {
        isMuted.value = !isMuted.value
        if (audioElement.value) {
            audioElement.value.muted = isMuted.value
        }
    }

    const setPlayMode = (mode) => {
        playMode.value = mode
        ElMessage.success(`播放模式：${getPlayModeText(mode)}`)
    }

    const getPlayModeText = (mode) => {
        const modeMap = {
            sequence: '顺序播放',
            loop: '循环播放',
            random: '随机播放'
        }
        return modeMap[mode] || '顺序播放'
    }

    // 播放列表管理
    const setPlaylist = (songs) => {
        playlist.value = songs
        if (songs.length > 0 && !currentSong.value) {
            play(songs[0])
        }
    }

    const addToPlaylist = (song) => {
        if (!playlist.value.find(s => s.id === song.id)) {
            playlist.value.push(song)
            ElMessage.success('已添加到播放列表')
        } else {
            ElMessage.info('歌曲已在播放列表中')
        }
    }

    const removeFromPlaylist = (songId) => {
        const index = playlist.value.findIndex(s => s.id === songId)
        if (index > -1) {
            playlist.value.splice(index, 1)
            ElMessage.success('已从播放列表移除')
        }
    }

    const clearPlaylist = () => {
        playlist.value = []
        currentSong.value = null
        isPlaying.value = false
        currentTime.value = 0
        duration.value = 0
        ElMessage.success('播放列表已清空')
    }

    // 音频事件处理
    const onTimeUpdate = (event) => {
        currentTime.value = event.target.currentTime
    }

    const onLoadedMetadata = (event) => {
        duration.value = event.target.duration
    }

    const onEnded = () => {
        if (playMode.value === 'loop' || hasNext.value) {
            next()
        } else {
            isPlaying.value = false
            currentTime.value = 0
            ElMessage.info('播放完成')
        }
    }

    const onError = (error) => {
        ElMessage.error('播放出错，请检查音频文件')
        console.error('Audio error:', error)
    }

    // 初始化音频元素
    const initAudioElement = (element) => {
        audioElement.value = element
        if (element) {
            element.addEventListener('timeupdate', onTimeUpdate)
            element.addEventListener('loadedmetadata', onLoadedMetadata)
            element.addEventListener('ended', onEnded)
            element.addEventListener('error', onError)

            // 设置初始音量
            element.volume = volume.value
        }
    }

    // 清理
    const cleanup = () => {
        if (audioElement.value) {
            audioElement.value.removeEventListener('timeupdate', onTimeUpdate)
            audioElement.value.removeEventListener('loadedmetadata', onLoadedMetadata)
            audioElement.value.removeEventListener('ended', onEnded)
            audioElement.value.removeEventListener('error', onError)
            audioElement.value = null
        }
    }

    return {
        // 状态
        currentSong,
        playlist,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playMode,
        audioElement,

        // 计算属性
        currentIndex,
        hasNext,
        hasPrev,
        progress,

        // 播放控制
        play,
        pause,
        togglePlay,
        next,
        prev,
        seek,
        setVolume,
        toggleMute,
        setPlayMode,
        getPlayModeText,

        // 播放列表管理
        setPlaylist,
        addToPlaylist,
        removeFromPlaylist,
        clearPlaylist,

        // 音频控制
        initAudioElement,
        cleanup
    }
}) 