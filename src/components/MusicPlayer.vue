<template>
    <div class="music-player-container">
        <!-- 音乐播放器模态框 -->
        <el-dialog
            v-model="visible"
            :title="currentTrack?.title || '音乐播放'"
            width="70%"
            :close-on-click-modal="false"
            :close-on-press-escape="true"
            class="music-player-dialog"
            @close="handleClose"
        >
            <div class="music-player-content">
                <!-- 专辑封面 -->
                <div class="album-cover-section">
                    <div class="album-cover">
                        <img :src="currentTrack?.cover || currentAlbum?.cover" :alt="currentTrack?.title">
                        <div class="play-overlay" v-if="!isPlaying">
                            <el-icon size="48"><VideoPlay /></el-icon>
                        </div>
                    </div>
                </div>

                <!-- 播放控制 -->
                <div class="player-controls">
                    <div class="track-info">
                        <h2 class="track-title">{{ currentTrack?.title || '未知歌曲' }}</h2>
                        <p class="track-artist">{{ currentTrack?.artist || 'Taylor Swift' }}</p>
                        <p class="track-album">{{ currentAlbum?.name || '未知专辑' }}</p>
                    </div>

                    <!-- 进度条 -->
                    <div class="progress-section">
                        <div class="time-display">
                            <span class="current-time">{{ formatTime(currentTime) }}</span>
                            <span class="total-time">{{ formatTime(duration) }}</span>
                        </div>
                        <el-slider
                            v-model="progress"
                            :max="100"
                            @change="seekTo"
                            class="progress-slider"
                        />
                    </div>

                    <!-- 控制按钮 -->
                    <div class="control-buttons">
                        <el-button 
                            circle 
                            size="large"
                            @click="previousTrack"
                            :disabled="!canGoPrevious"
                        >
                            <el-icon><VideoPlay /></el-icon>
                        </el-button>
                        
                        <el-button 
                            circle 
                            size="large"
                            type="primary"
                            @click="togglePlay"
                        >
                            <el-icon v-if="isPlaying"><VideoPause /></el-icon>
                            <el-icon v-else><VideoPlay /></el-icon>
                        </el-button>
                        
                        <el-button 
                            circle 
                            size="large"
                            @click="nextTrack"
                            :disabled="!canGoNext"
                        >
                            <el-icon><VideoPlay /></el-icon>
                        </el-button>
                    </div>

                    <!-- 音量控制 -->
                    <div class="volume-section">
                        <el-icon><Microphone /></el-icon>
                        <el-slider
                            v-model="volume"
                            :max="100"
                            @change="setVolume"
                            class="volume-slider"
                        />
                    </div>
                </div>

                <!-- 播放列表 -->
                <div class="playlist-section">
                    <div class="playlist-header">
                        <h3>播放列表</h3>
                        <el-button size="small" @click="toggleShuffle">
                            <el-icon><Refresh /></el-icon>
                            随机播放
                        </el-button>
                    </div>
                    
                    <div class="playlist">
                        <div 
                            v-for="(track, index) in playlist" 
                            :key="track.id"
                            class="playlist-item"
                            :class="{ 'active': currentTrackIndex === index }"
                            @click="playTrack(index)"
                        >
                            <div class="track-number">{{ index + 1 }}</div>
                            <div class="track-info">
                                <div class="track-name">{{ track.title }}</div>
                                <div class="track-duration">{{ formatTime(track.duration) }}</div>
                            </div>
                            <div class="track-actions">
                                <el-button 
                                    size="small" 
                                    circle
                                    @click.stop="toggleFavorite(track)"
                                >
                                                                         <el-icon><Star v-if="!track.isFavorite" /><StarFilled v-else /></el-icon>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { 
    VideoPlay, 
    VideoPause, 
    Microphone, 
    Refresh,
    Star,
    StarFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
    name: 'MusicPlayer',
    components: {
        VideoPlay,
        VideoPause,
        Microphone,
        Refresh,
        Star,
        StarFilled
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        album: {
            type: Object,
            default: null
        },
        song: {
            type: Object,
            default: null
        }
    },
    emits: ['update:modelValue', 'track-end'],
    setup(props, { emit }) {
        const audioRef = ref(null)
        const isPlaying = ref(false)
        const currentTime = ref(0)
        const duration = ref(0)
        const volume = ref(50)
        const currentTrackIndex = ref(0)
        const isShuffled = ref(false)
        const originalPlaylist = ref([])

        // 模拟播放列表数据
        const playlist = ref([
            {
                id: 1,
                title: 'Anti-Hero',
                artist: 'Taylor Swift',
                duration: 200,
                cover: '',
                isFavorite: false,
                url: '/audio/anti-hero.mp3'
            },
            {
                id: 2,
                title: 'Cruel Summer',
                artist: 'Taylor Swift',
                duration: 178,
                cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzljMjdiMCIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q3J1ZWwgU3VtbWVyPC90ZXh0Pjwvc3ZnPg==',
                isFavorite: true,
                url: '/audio/cruel-summer.mp3'
            },
            {
                id: 3,
                title: 'Cardigan',
                artist: 'Taylor Swift',
                duration: 239,
                cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmOTgwMCIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2FyZGlnYW48L3RleHQ+PC9zdmc+',
                isFavorite: false,
                url: '/audio/cardigan.mp3'
            },
            {
                id: 4,
                title: 'Lover',
                artist: 'Taylor Swift',
                duration: 221,
                cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG92ZXI8L3RleHQ+PC9zdmc+',
                isFavorite: true,
                url: '/audio/shake-it-off.mp3'
            }
        ])

        // 根据传入的歌曲创建播放列表
        const createPlaylistFromSong = (song) => {
            if (!song) return playlist.value
            
            // 如果传入了歌曲，创建一个包含该歌曲的播放列表
            const songPlaylist = [{
                id: song.id || Date.now(),
                title: song.title,
                artist: song.artist || 'Taylor Swift',
                duration: song.duration || 200,
                cover: song.cover,
                isFavorite: song.isFavorite || false,
                url: song.url || 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
            }]
            
            // 添加一些相关的歌曲到播放列表
            const relatedSongs = [
                {
                    id: 2,
                    title: 'Cruel Summer',
                    artist: 'Taylor Swift',
                    duration: 178,
                    cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzljMjdiMCIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q3J1ZWwgU3VtbWVyPC90ZXh0Pjwvc3ZnPg==',
                    isFavorite: true,
                    url: '/audio/cruel-summer.mp3'
                },
                {
                    id: 3,
                    title: 'Cardigan',
                    artist: 'Taylor Swift',
                    duration: 239,
                    cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmOTgwMCIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2FyZGlnYW48L3RleHQ+PC9zdmc+',
                    isFavorite: false,
                    url: '/audio/cardigan.mp3'
                },
                {
                    id: 4,
                    title: 'Lover',
                    artist: 'Taylor Swift',
                    duration: 221,
                    cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG92ZXI8L3RleHQ+PC9zdmc+',
                    isFavorite: true,
                    url: '/audio/shake-it-off.mp3'
                }
            ]
            
            return [...songPlaylist, ...relatedSongs]
        }

        const visible = computed({
            get: () => props.modelValue,
            set: (value) => emit('update:modelValue', value)
        })

        const currentTrack = computed(() => playlist.value[currentTrackIndex.value])
        const currentAlbum = computed(() => props.album)
        const progress = computed(() => duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0)
        const canGoPrevious = computed(() => currentTrackIndex.value > 0)
        const canGoNext = computed(() => currentTrackIndex.value < playlist.value.length - 1)

        // 格式化时间
        const formatTime = (seconds) => {
            if (!seconds) return '0:00'
            const mins = Math.floor(seconds / 60)
            const secs = Math.floor(seconds % 60)
            return `${mins}:${secs.toString().padStart(2, '0')}`
        }

        // 播放控制
        const togglePlay = () => {
            if (!audioRef.value) return
            
            if (isPlaying.value) {
                audioRef.value.pause()
            } else {
                audioRef.value.play()
            }
        }

        const playTrack = (index) => {
            currentTrackIndex.value = index
            loadAndPlayTrack()
        }

        const nextTrack = () => {
            if (canGoNext.value) {
                currentTrackIndex.value++
                loadAndPlayTrack()
            }
        }

        const previousTrack = () => {
            if (canGoPrevious.value) {
                currentTrackIndex.value--
                loadAndPlayTrack()
            }
        }

        const loadAndPlayTrack = () => {
            if (!audioRef.value) return
            
            audioRef.value.src = currentTrack.value.url
            audioRef.value.load()
            audioRef.value.play()
        }

        const seekTo = (value) => {
            if (!audioRef.value) return
            const newTime = (value / 100) * duration.value
            audioRef.value.currentTime = newTime
        }

        const setVolume = (value) => {
            if (!audioRef.value) return
            audioRef.value.volume = value / 100
        }

        const toggleShuffle = () => {
            isShuffled.value = !isShuffled.value
            if (isShuffled.value) {
                originalPlaylist.value = [...playlist.value]
                playlist.value = [...playlist.value].sort(() => Math.random() - 0.5)
            } else {
                playlist.value = [...originalPlaylist.value]
            }
            ElMessage.success(isShuffled.value ? '已开启随机播放' : '已关闭随机播放')
        }

        const toggleFavorite = (track) => {
            track.isFavorite = !track.isFavorite
            ElMessage.success(track.isFavorite ? '已添加到收藏' : '已取消收藏')
        }

        // 音频事件处理
        const onLoadedMetadata = () => {
            if (audioRef.value) {
                duration.value = audioRef.value.duration
            }
        }

        const onTimeUpdate = () => {
            if (audioRef.value) {
                currentTime.value = audioRef.value.currentTime
            }
        }

        const onEnded = () => {
            isPlaying.value = false
            emit('track-end', currentTrack.value)
            nextTrack()
        }

        const onPlay = () => {
            isPlaying.value = true
        }

        const onPause = () => {
            isPlaying.value = false
        }

        const handleClose = () => {
            if (audioRef.value) {
                audioRef.value.pause()
            }
        }

        // 监听专辑变化
        watch(() => props.album, (newAlbum) => {
            if (newAlbum) {
                // 这里可以根据专辑更新播放列表
                console.log('专辑变化:', newAlbum)
            }
        })

        // 监听歌曲变化
        watch(() => props.song, (newSong) => {
            if (newSong) {
                // 根据新歌曲更新播放列表
                playlist.value = createPlaylistFromSong(newSong)
                currentTrackIndex.value = 0
                console.log('歌曲变化:', newSong)
            }
        })

        // 监听播放器显示状态
        watch(visible, (newVisible) => {
            if (newVisible && currentTrack.value) {
                loadAndPlayTrack()
            }
        })

        onMounted(() => {
            // 创建音频元素
            audioRef.value = new Audio()
            audioRef.value.addEventListener('loadedmetadata', onLoadedMetadata)
            audioRef.value.addEventListener('timeupdate', onTimeUpdate)
            audioRef.value.addEventListener('ended', onEnded)
            audioRef.value.addEventListener('play', onPlay)
            audioRef.value.addEventListener('pause', onPause)
            
            // 设置初始音量
            audioRef.value.volume = volume.value / 100
        })

        onUnmounted(() => {
            if (audioRef.value) {
                audioRef.value.removeEventListener('loadedmetadata', onLoadedMetadata)
                audioRef.value.removeEventListener('timeupdate', onTimeUpdate)
                audioRef.value.removeEventListener('ended', onEnded)
                audioRef.value.removeEventListener('play', onPlay)
                audioRef.value.removeEventListener('pause', onPause)
                audioRef.value.pause()
            }
        })

        return {
            audioRef,
            visible,
            isPlaying,
            currentTime,
            duration,
            volume,
            currentTrackIndex,
            playlist,
            currentTrack,
            currentAlbum,
            progress,
            canGoPrevious,
            canGoNext,
            formatTime,
            togglePlay,
            playTrack,
            nextTrack,
            previousTrack,
            seekTo,
            setVolume,
            toggleShuffle,
            toggleFavorite,
            handleClose
        }
    }
}
</script>

<style scoped>
.music-player-dialog {
    max-width: 800px;
}

.music-player-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.album-cover-section {
    display: flex;
    justify-content: center;
}

.album-cover {
    position: relative;
    width: 300px;
    height: 300px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.album-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.play-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.album-cover:hover .play-overlay {
    opacity: 1;
}

.player-controls {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.track-info {
    text-align: center;
}

.track-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.track-artist {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 4px;
}

.track-album {
    font-size: 0.9rem;
    color: #999;
}

.progress-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.time-display {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #666;
}

.progress-slider {
    width: 100%;
}

.control-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.volume-section {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
}

.volume-slider {
    width: 120px;
}

.playlist-section {
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
}

.playlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.playlist-header h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.playlist {
    max-height: 300px;
    overflow-y: auto;
}

.playlist-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.playlist-item:hover {
    background-color: #f5f5f5;
}

.playlist-item.active {
    background-color: #e3f2fd;
    color: #1976d2;
}

.track-number {
    width: 30px;
    font-weight: 500;
    color: #666;
}

.track-info {
    flex: 1;
    margin-left: 12px;
}

.track-name {
    font-weight: 500;
    margin-bottom: 4px;
}

.track-duration {
    font-size: 0.8rem;
    color: #666;
}

.track-actions {
    margin-left: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .music-player-dialog {
        width: 95% !important;
    }
    
    .album-cover {
        width: 200px;
        height: 200px;
    }
    
    .control-buttons {
        gap: 12px;
    }
    
    .volume-section {
        flex-direction: column;
        gap: 8px;
    }
    
    .volume-slider {
        width: 100px;
    }
}
</style> 