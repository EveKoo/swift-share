<template>
    <div class="video-player-container">
        <!-- 视频播放器模态框 -->
        <el-dialog
            v-model="visible"
            :title="video?.title || '视频播放'"
            width="90%"
            :close-on-click-modal="false"
            :close-on-press-escape="true"
            class="video-player-dialog"
            @close="handleClose"
            @closed="handleDialogClosed"
        >
            <div class="video-player-content">
                <!-- 视频播放区域 -->
                <div class="video-area">
                    <!-- 直接视频文件播放 -->
                    <video
                        v-if="!isEmbeddedVideo"
                        ref="videoRef"
                        :src="video?.url"
                        :poster="video?.thumbnail"
                        controls
                        preload="metadata"
                        class="video-element"
                        @loadedmetadata="onVideoLoaded"
                        @timeupdate="onTimeUpdate"
                        @ended="onVideoEnded"
                        @play="onPlay"
                        @pause="onPause"
                    >
                        您的浏览器不支持视频播放
                    </video>
                    
                    <!-- 嵌入播放器 -->
                    <iframe
                        v-else
                        ref="iframeRef"
                        :src="currentIframeSrc"
                        class="video-element embedded-video"
                        frameborder="0"
                        allowfullscreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                </div>

                <!-- 视频信息 -->
                <div class="video-info-panel">
                    <div class="video-header">
                        <h2 class="video-title">{{ video?.title }}</h2>
                        <div class="video-stats">
                            <span class="stat-item">
                                <el-icon><View /></el-icon>
                                {{ formatNumber(video?.views || 0) }} 次观看
                            </span>
                            <span class="stat-item">
                                <el-icon><Star /></el-icon>
                                {{ formatNumber(video?.likes || 0) }} 点赞
                            </span>
                            <span class="stat-item">
                                <el-icon><ChatDotRound /></el-icon>
                                {{ formatNumber(video?.comments || 0) }} 评论
                            </span>
                        </div>
                    </div>

                    <div class="video-description">
                        <p>{{ video?.description }}</p>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="video-actions">
                        <el-button 
                            type="primary" 
                            :icon="isLiked ? 'StarFilled' : 'Star'"
                            @click="toggleLike"
                        >
                            {{ isLiked ? '已点赞' : '点赞' }}
                        </el-button>
                        <el-button 
                            :icon="isFavorited ? 'HeartFilled' : 'Heart'"
                            @click="toggleFavorite"
                        >
                            {{ isFavorited ? '已收藏' : '收藏' }}
                        </el-button>
                        <el-button icon="Share" @click="shareVideo">
                            分享
                        </el-button>
                        <el-button icon="Download" @click="downloadVideo">
                            下载
                        </el-button>
                    </div>

                    <!-- 标签 -->
                    <div class="video-tags" v-if="video?.tags?.length">
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

            <!-- 相关视频推荐 -->
            <div class="related-videos" v-if="relatedVideos.length">
                <h3 class="related-title">相关视频</h3>
                <div class="related-grid">
                    <div 
                        v-for="relatedVideo in relatedVideos" 
                        :key="relatedVideo.id"
                        class="related-video-item"
                        @click="playVideo(relatedVideo)"
                    >
                        <div class="related-thumbnail">
                            <img :src="relatedVideo.thumbnail" :alt="relatedVideo.title">
                            <div class="play-overlay">
                                <el-icon><VideoPlay /></el-icon>
                            </div>
                        </div>
                        <div class="related-info">
                            <h4 class="related-title">{{ relatedVideo.title }}</h4>
                            <p class="related-views">{{ formatNumber(relatedVideo.views) }} 次观看</p>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { 
    View, 
    Star, 
    ChatDotRound, 
    VideoPlay
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
    name: 'VideoPlayer',
    components: {
        View,
        Star,
        ChatDotRound,
        VideoPlay
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        video: {
            type: Object,
            default: null
        }
    },
    emits: ['update:modelValue', 'video-end'],
    setup(props, { emit }) {
        const videoRef = ref(null)
        const iframeRef = ref(null)
        const isLiked = ref(false)
        const isFavorited = ref(false)
        const currentTime = ref(0)
        const duration = ref(0)
        const currentIframeSrc = ref('') // 添加 iframe src 控制

        // 相关视频数据
        const relatedVideos = ref([
            {
                id: 1,
                title: 'Anti-Hero MV',
                thumbnail: 'https://via.placeholder.com/160x90/e91e63/ffffff?text=Anti-Hero',
                views: 15000000,
                url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
            },
            {
                id: 2,
                title: 'Cruel Summer Live',
                thumbnail: 'https://via.placeholder.com/160x90/9c27b0/ffffff?text=Cruel+Summer',
                views: 8500000,
                url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
            },
            {
                id: 3,
                title: 'Cardigan MV',
                thumbnail: 'https://via.placeholder.com/160x90/ff9800/ffffff?text=Cardigan',
                views: 12000000,
                url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
            }
        ])

        const visible = computed({
            get: () => props.modelValue,
            set: (value) => emit('update:modelValue', value)
        })

        // 判断是否是嵌入视频 URL
        const isEmbeddedVideo = computed(() => {
            if (!props.video || !props.video.url) {
                return false
            }
            // 检查 URL 是否包含常见的嵌入平台域名
            const embeddedDomains = ['youtube.com', 'vimeo.com', 'dailymotion.com', 'facebook.com', 'bilibili.com']
            const url = new URL(props.video.url)
            return embeddedDomains.some(domain => url.hostname.includes(domain))
        })

        // 格式化数字
        const formatNumber = (num) => {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M'
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K'
            }
            return num.toString()
        }

        // 视频事件处理
        const onVideoLoaded = () => {
            if (videoRef.value) {
                duration.value = videoRef.value.duration
            }
        }

        const onTimeUpdate = () => {
            if (videoRef.value) {
                currentTime.value = videoRef.value.currentTime
            }
        }

        const onVideoEnded = () => {
            emit('video-end', props.video)
            ElMessage.success('视频播放完成')
        }

        const onPlay = () => {
            console.log('视频开始播放')
        }

        const onPause = () => {
            console.log('视频暂停')
        }

        // 操作按钮处理
        const toggleLike = () => {
            isLiked.value = !isLiked.value
            ElMessage.success(isLiked.value ? '已点赞' : '取消点赞')
        }

        const toggleFavorite = () => {
            isFavorited.value = !isFavorited.value
            ElMessage.success(isFavorited.value ? '已收藏' : '取消收藏')
        }

        const shareVideo = () => {
            if (navigator.share) {
                navigator.share({
                    title: props.video?.title,
                    text: props.video?.description,
                    url: window.location.href
                })
            } else {
                // 复制链接到剪贴板
                navigator.clipboard.writeText(window.location.href)
                ElMessage.success('链接已复制到剪贴板')
            }
        }

        const downloadVideo = () => {
            ElMessage.info('下载功能开发中...')
        }

        const playVideo = (relatedVideo) => {
            // eslint-disable-next-line no-unused-vars
            console.log('播放相关视频:', relatedVideo.title)
            emit('update:modelValue', false)
            // 延迟打开新视频，避免冲突
            setTimeout(() => {
                emit('update:modelValue', true)
            }, 100)
        }

        const handleClose = () => {
            if (videoRef.value) {
                videoRef.value.pause()
            }
            // 对于嵌入视频，清空 iframe src
            if (isEmbeddedVideo.value) {
                currentIframeSrc.value = ''
            }
            // 触发视频结束事件，通知父组件
            emit('video-end', props.video)
        }

        const handleDialogClosed = () => {
            // 确保 iframe src 被清空
            if (isEmbeddedVideo.value) {
                currentIframeSrc.value = ''
            }
        }

        // 监听视频变化
        watch(() => props.video, (newVideo) => {
            if (newVideo) {
                if (isEmbeddedVideo.value) {
                    currentIframeSrc.value = newVideo.url
                } else if (videoRef.value) {
                    videoRef.value.currentTime = 0
                }
            }
        }, { immediate: true })

        // 监听对话框可见性变化
        watch(visible, (newVal) => {
            if (!newVal && isEmbeddedVideo.value) {
                // 当对话框关闭时，清空 iframe src
                currentIframeSrc.value = ''
            } else if (newVal && isEmbeddedVideo.value && props.video?.url) {
                // 当对话框打开时，设置 iframe src
                currentIframeSrc.value = props.video.url
            }
        })

        return {
            videoRef,
            iframeRef,
            visible,
            isLiked,
            isFavorited,
            currentTime,
            duration,
            relatedVideos,
            formatNumber,
            onVideoLoaded,
            onTimeUpdate,
            onVideoEnded,
            onPlay,
            onPause,
            toggleLike,
            toggleFavorite,
            shareVideo,
            downloadVideo,
            playVideo,
            handleClose,
            handleDialogClosed,
            isEmbeddedVideo,
            currentIframeSrc
        }
    }
}
</script>

<style scoped>
.video-player-dialog {
    max-width: 1400px; /* 增加最大宽度 */
}

.video-player-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.video-area {
    position: relative;
    width: 100%;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
    min-height: 500px; /* 设置最小高度 */
}

.video-element {
    width: 100%;
    height: auto;
    max-height: 80vh; /* 增加最大高度从 70vh 到 80vh */
    min-height: 500px; /* 设置最小高度 */
    display: block;
}

.embedded-video {
    width: 100%;
    height: 600px; /* 为嵌入视频设置固定高度 */
    min-height: 500px;
    border: none; /* Remove default iframe border */
}

.video-info-panel {
    padding: 20px 0;
}

.video-header {
    margin-bottom: 16px;
}

.video-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
}

.video-stats {
    display: flex;
    gap: 20px;
    color: #666;
    font-size: 0.9rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.video-description {
    margin-bottom: 20px;
    color: #666;
    line-height: 1.6;
}

.video-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
}

.video-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.video-tag {
    background: #f0f0f0;
    color: #666;
}

.related-videos {
    margin-top: 30px;
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
}

.related-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
}

.related-video-item {
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
}

.related-video-item:hover {
    transform: translateY(-2px);
}

.related-thumbnail {
    position: relative;
    width: 100%;
    height: 120px;
    overflow: hidden;
}

.related-thumbnail img {
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
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
}

.related-video-item:hover .play-overlay {
    opacity: 1;
}

.related-info {
    padding: 12px;
}

.related-info .related-title {
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 4px;
    color: #333;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.related-views {
    font-size: 0.8rem;
    color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .video-player-dialog {
        width: 95% !important;
    }
    
    .video-area {
        min-height: 300px; /* 移动端减小最小高度 */
    }
    
    .video-element {
        max-height: 60vh; /* 移动端减小最大高度 */
        min-height: 300px;
    }
    
    .embedded-video {
        height: 400px; /* 移动端减小嵌入视频高度 */
        min-height: 300px;
    }
    
    .video-stats {
        flex-direction: column;
        gap: 8px;
    }
    
    .video-actions {
        flex-wrap: wrap;
    }
    
    .related-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
}

/* 大屏幕优化 */
@media (min-width: 1200px) {
    .video-player-dialog {
        max-width: 1600px; /* 大屏幕进一步增加宽度 */
    }
    
    .video-area {
        min-height: 600px; /* 大屏幕增加最小高度 */
    }
    
    .video-element {
        max-height: 85vh; /* 大屏幕增加最大高度 */
        min-height: 600px;
    }
    
    .embedded-video {
        height: 700px; /* 大屏幕增加嵌入视频高度 */
        min-height: 600px;
    }
}
</style> 