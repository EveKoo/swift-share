<!-- src/views/swift/SwiftVideos.vue -->
<template>
    <div class="swift-videos">
        <!-- 页面头部 -->
        <div class="videos-header">
            <h1 class="page-title">🎬 视频库</h1>
            <p class="page-subtitle">观看MV、演唱会、采访等精彩内容</p>
        </div>

        <!-- 搜索和筛选 -->
        <div class="videos-controls">
            <div class="search-section">
                <el-input
                    v-model="searchKeyword"
                    placeholder="搜索视频..."
                    class="search-input"
                    @keyup.enter="handleSearch"
                >
                    <template #prefix>
                        <el-icon><Search /></el-icon>
                    </template>
                </el-input>
                <el-button type="primary" @click="handleSearch">
                    <el-icon><Search /></el-icon>
                    搜索
                </el-button>
            </div>

            <div class="filter-section">
                <el-select v-model="selectedCategory" placeholder="选择分类" @change="filterVideos">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="MV" value="mv"></el-option>
                    <el-option label="演唱会" value="concert"></el-option>
                    <el-option label="采访" value="interview"></el-option>
                    <el-option label="幕后花絮" value="behind"></el-option>
                    <el-option label="现场表演" value="live"></el-option>
                </el-select>

                <el-select v-model="sortBy" placeholder="排序方式" @change="sortVideos">
                    <el-option label="最新发布" value="latest"></el-option>
                    <el-option label="最多播放" value="views"></el-option>
                    <el-option label="最多点赞" value="likes"></el-option>
                    <el-option label="最多评论" value="comments"></el-option>
                </el-select>
            </div>
        </div>

        <!-- 视频网格 -->
        <div class="videos-grid">
            <div 
                v-for="video in filteredVideos" 
                :key="video.id"
                class="video-card"
                @click="playVideo(video)"
            >
                <div class="video-thumbnail">
                    <img :src="video.thumbnail" :alt="video.title">
                    <div class="video-overlay">
                        <el-icon size="32"><VideoPlay /></el-icon>
                    </div>
                    <div class="video-duration">{{ video.duration }}</div>
                    <div class="video-badge" v-if="video.badge">{{ video.badge }}</div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">{{ video.title }}</h3>
                    <p class="video-description">{{ video.description }}</p>
                    <div class="video-meta">
                        <span class="meta-item">
                            <el-icon><View /></el-icon>
                            {{ video.views }}
                        </span>
                        <span class="meta-item">
                            <el-icon><Star /></el-icon>
                            {{ video.likes }}
                        </span>
                        <span class="meta-item">
                            <el-icon><ChatDotRound /></el-icon>
                            {{ video.comments }}
                        </span>
                    </div>
                    <div class="video-tags">
                        <el-tag 
                            v-for="tag in video.tags" 
                            :key="tag"
                            size="small"
                            class="video-tag"
                        >
                            {{ tag }}
                        </el-tag>
                    </div>
                </div>
            </div>
        </div>

        <!-- 加载更多 -->
        <div class="load-more" v-if="hasMore">
            <el-button @click="loadMore" :loading="loading">
                加载更多视频
            </el-button>
        </div>

        <!-- 视频播放器模态框 -->
        <el-dialog
            v-model="showVideoPlayer"
            title="视频播放"
            width="80%"
            :before-close="closeVideoPlayer"
            class="video-player-dialog"
        >
            <div class="video-player-content">
                <div class="video-placeholder">
                    <el-icon size="64"><VideoPlay /></el-icon>
                    <p>视频播放器</p>
                    <p class="video-title">{{ currentVideo?.title }}</p>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { 
    Search, 
    VideoPlay, 
    View, 
    Star, 
    ChatDotRound 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
    name: 'SwiftVideos',
    components: {
        Search,
        VideoPlay,
        View,
        Star,
        ChatDotRound
    },
    setup() {
        const searchKeyword = ref('')
        const selectedCategory = ref('')
        const sortBy = ref('latest')
        const loading = ref(false)
        const showVideoPlayer = ref(false)
        const currentVideo = ref(null)

        // 模拟视频数据
        const videos = ref([
            {
                id: 1,
                title: 'Taylor Swift - Cruel Summer (Official Music Video)',
                description: 'Official music video for "Cruel Summer" from the Lover album',
                thumbnail: 'https://via.placeholder.com/320x180/e91e63/ffffff?text=Cruel+Summer+MV',
                duration: '3:28',
                views: '2.1M',
                likes: '156K',
                comments: '8.9K',
                category: 'mv',
                tags: ['MV', 'Lover', 'Official'],
                badge: 'NEW'
            },
            {
                id: 2,
                title: 'Eras Tour - Anti-Hero Live Performance',
                description: 'Taylor Swift performing "Anti-Hero" during the Eras Tour',
                thumbnail: 'https://via.placeholder.com/320x180/9c27b0/ffffff?text=Anti-Hero+Live',
                duration: '4:12',
                views: '1.8M',
                likes: '234K',
                comments: '12.3K',
                category: 'concert',
                tags: ['Live', 'Eras Tour', 'Anti-Hero']
            },
            {
                id: 3,
                title: 'Taylor Swift Interview - The Tonight Show',
                description: 'Taylor Swift talks about her new album and upcoming tour',
                thumbnail: 'https://via.placeholder.com/320x180/ff9800/ffffff?text=Interview',
                duration: '8:45',
                views: '956K',
                likes: '67K',
                comments: '3.2K',
                category: 'interview',
                tags: ['Interview', 'Talk Show', 'Behind the Scenes']
            },
            {
                id: 4,
                title: 'Midnights Album Recording Process',
                description: 'Behind the scenes of recording the Midnights album',
                thumbnail: 'https://via.placeholder.com/320x180/2196f3/ffffff?text=Recording',
                duration: '12:30',
                views: '1.2M',
                likes: '89K',
                comments: '5.6K',
                category: 'behind',
                tags: ['Behind the Scenes', 'Recording', 'Studio']
            },
            {
                id: 5,
                title: 'Shake It Off - Grammy Performance',
                description: 'Taylor Swift performing "Shake It Off" at the Grammy Awards',
                thumbnail: 'https://via.placeholder.com/320x180/4caf50/ffffff?text=Grammy+Performance',
                duration: '3:55',
                views: '3.4M',
                likes: '456K',
                comments: '23.1K',
                category: 'live',
                tags: ['Live', 'Grammy', 'Performance']
            },
            {
                id: 6,
                title: 'Cardigan - Folklore Live Session',
                description: 'Intimate live performance of "Cardigan" from Folklore',
                thumbnail: 'https://via.placeholder.com/320x180/795548/ffffff?text=Cardigan+Live',
                duration: '4:08',
                views: '1.5M',
                likes: '178K',
                comments: '9.8K',
                category: 'live',
                tags: ['Live', 'Folklore', 'Intimate']
            }
        ])

        // 计算属性：过滤后的视频
        const filteredVideos = computed(() => {
            let result = videos.value

            // 按分类过滤
            if (selectedCategory.value) {
                result = result.filter(video => video.category === selectedCategory.value)
            }

            // 按关键词搜索
            if (searchKeyword.value) {
                const keyword = searchKeyword.value.toLowerCase()
                result = result.filter(video => 
                    video.title.toLowerCase().includes(keyword) ||
                    video.description.toLowerCase().includes(keyword) ||
                    video.tags.some(tag => tag.toLowerCase().includes(keyword))
                )
            }

            // 排序
            switch (sortBy.value) {
                case 'views':
                    result = [...result].sort((a, b) => parseInt(b.views) - parseInt(a.views))
                    break
                case 'likes':
                    result = [...result].sort((a, b) => parseInt(b.likes) - parseInt(a.likes))
                    break
                case 'comments':
                    result = [...result].sort((a, b) => parseInt(b.comments) - parseInt(a.comments))
                    break
                default:
                    // 最新发布（按ID倒序）
                    result = [...result].sort((a, b) => b.id - a.id)
            }

            return result
        })

        // 是否有更多视频
        const hasMore = computed(() => {
            return videos.value.length < 50 // 模拟限制
        })

        // 方法
        const handleSearch = () => {
            ElMessage.success(`搜索: ${searchKeyword.value}`)
        }

        const filterVideos = () => {
            ElMessage.success(`已筛选: ${selectedCategory.value || '全部'}`)
        }

        const sortVideos = () => {
            const sortText = {
                latest: '最新发布',
                views: '最多播放',
                likes: '最多点赞',
                comments: '最多评论'
            }
            ElMessage.success(`已排序: ${sortText[sortBy.value]}`)
        }

        const playVideo = (video) => {
            currentVideo.value = video
            showVideoPlayer.value = true
            ElMessage.success(`正在播放: ${video.title}`)
        }

        const closeVideoPlayer = () => {
            showVideoPlayer.value = false
            currentVideo.value = null
        }

        const loadMore = async () => {
            loading.value = true
            // 模拟加载更多视频
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const newVideos = [
                {
                    id: videos.value.length + 1,
                    title: 'New Video ' + (videos.value.length + 1),
                    description: 'This is a newly loaded video',
                    thumbnail: `https://via.placeholder.com/320x180/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=Video+${videos.value.length + 1}`,
                    duration: '3:30',
                    views: '500K',
                    likes: '25K',
                    comments: '1.2K',
                    category: 'mv',
                    tags: ['New', 'Video']
                }
            ]
            
            videos.value.push(...newVideos)
            loading.value = false
            ElMessage.success('已加载更多视频')
        }

        return {
            searchKeyword,
            selectedCategory,
            sortBy,
            loading,
            showVideoPlayer,
            currentVideo,
            videos,
            filteredVideos,
            hasMore,
            handleSearch,
            filterVideos,
            sortVideos,
            playVideo,
            closeVideoPlayer,
            loadMore
        }
    }
}
</script>

<style scoped>
.swift-videos {
    padding: 40px 20px;
    min-height: calc(100vh - 64px);
}

.videos-header {
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

.videos-controls {
    max-width: 1200px;
    margin: 0 auto 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
}

.search-section {
    display: flex;
    gap: 12px;
    align-items: center;
}

.search-input {
    width: 300px;
}

.filter-section {
    display: flex;
    gap: 12px;
}

.videos-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
}

.video-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    cursor: pointer;
}

.video-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(233, 30, 99, 0.2);
}

.video-thumbnail {
    position: relative;
    height: 180px;
    overflow: hidden;
}

.video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.video-card:hover .video-thumbnail img {
    transform: scale(1.05);
}

.video-overlay {
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

.video-card:hover .video-overlay {
    opacity: 1;
}

.video-duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8rem;
}

.video-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    background: var(--swift-pink);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
}

.video-info {
    padding: 16px;
}

.video-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.video-description {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 12px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.video-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
    color: #999;
    font-size: 0.9rem;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.video-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.video-tag {
    background: var(--swift-light-pink);
    color: var(--swift-pink);
    border: none;
}

.load-more {
    text-align: center;
    margin-top: 40px;
}

.video-player-dialog {
    border-radius: 16px;
}

.video-player-content {
    text-align: center;
    padding: 40px;
}

.video-placeholder {
    background: #f5f5f5;
    border-radius: 12px;
    padding: 60px 20px;
    color: #666;
}

.video-placeholder .el-icon {
    color: var(--swift-pink);
    margin-bottom: 16px;
}

.video-placeholder .video-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin-top: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .videos-controls {
        flex-direction: column;
        align-items: stretch;
    }
    
    .search-section {
        flex-direction: column;
    }
    
    .search-input {
        width: 100%;
    }
    
    .filter-section {
        justify-content: center;
    }
    
    .videos-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }
    
    .page-title {
        font-size: 2rem;
    }
    
    .swift-videos {
        padding: 20px 15px;
    }
}
</style>