<!-- src/views/swift/SwiftMusic.vue -->
<template>
    <div class="swift-music">
        <div class="music-header">
            <h1 class="page-title">🎵 音乐库</h1>
            <p class="page-subtitle">探索 Taylor Swift 的所有音乐作品</p>
        </div>
        
        <div class="music-content">
            <div class="music-grid">
                <div 
                    v-for="album in albums" 
                    :key="album.id"
                    class="album-card"
                    @click="playAlbum(album)"
                >
                    <div class="album-cover">
                        <img :src="album.cover" :alt="album.name">
                        <div class="play-overlay">
                            <el-icon size="32"><VideoPlay /></el-icon>
                        </div>
                    </div>
                    <div class="album-info">
                        <h3 class="album-name">{{ album.name }}</h3>
                        <p class="album-year">{{ album.year }}</p>
                        <p class="album-songs">{{ album.songs }} 首歌曲</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 音乐播放器 -->
        <MusicPlayer 
            v-model="showMusicPlayer"
            :album="currentAlbum"
            @track-end="onTrackEnd"
        />
    </div>
</template>

<script>
import { ref } from 'vue'
import { VideoPlay } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MusicPlayer from '@/components/MusicPlayer.vue'

export default {
    name: 'SwiftMusic',
    components: {
        VideoPlay,
        MusicPlayer
    },
    setup() {
        const showMusicPlayer = ref(false)
        const currentAlbum = ref(null)

        const albums = ref([
            {
                id: 1,
                name: 'Midnights',
                year: '2022',
                songs: 13,
                cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U5MWU2MyIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TWlkbmlnaHRzPC90ZXh0Pjwvc3ZnPg=='
            },
            {
                id: 2,
                name: 'Red (Taylor\'s Version)',
                year: '2021',
                songs: 30,
                cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzljMjdiMCIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UmVkIChUVik8L3RleHQ+PC9zdmc+'
            },
            {
                id: 3,
                name: 'Folklore',
                year: '2020',
                songs: 16,
                cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmOTgwMCIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Rm9sa2xvcmU8L3RleHQ+PC9zdmc+'
            },
            {
                id: 4,
                name: 'Lover',
                year: '2019',
                songs: 18,
                cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIxOTZmMyIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG92ZXI8L3RleHQ+PC9zdmc+'
            }
        ])

        const playAlbum = (album) => {
            currentAlbum.value = album
            showMusicPlayer.value = true
            ElMessage.success(`正在播放专辑: ${album.name}`)
        }

        const onTrackEnd = (track) => {
            ElMessage.info(`歌曲播放完成: ${track.title}`)
        }

        return {
            albums,
            showMusicPlayer,
            currentAlbum,
            playAlbum,
            onTrackEnd
        }
    }
}
</script>

<style scoped>
.swift-music {
    padding: 40px 20px;
    min-height: calc(100vh - 64px);
}

.music-header {
    text-align: center;
    margin-bottom: 40px;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--swift-dark-pink);
    margin-bottom: 12px;
}

.page-subtitle {
    color: var(--swift-text-secondary);
    font-size: 1.1rem;
}

.music-content {
    max-width: 1200px;
    margin: 0 auto;
}

.music-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
}

.album-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    cursor: pointer;
}

.album-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(233, 30, 99, 0.2);
}

.album-cover {
    position: relative;
    height: 280px;
    overflow: hidden;
}

.album-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.album-card:hover .album-cover img {
    transform: scale(1.05);
}

.play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
    color: white;
}

.album-card:hover .play-overlay {
    opacity: 1;
}

.album-info {
    padding: 20px;
}

.album-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.album-year {
    color: var(--swift-pink);
    font-weight: 500;
    margin-bottom: 4px;
}

.album-songs {
    color: var(--swift-text-muted);
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .swift-music {
        padding: 20px 15px;
    }
    
    .page-title {
        font-size: 2rem;
    }
    
    .music-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
    }
}
</style>