<template>
    <div class="swift-home">
        <!-- 头部横幅 -->
        <div class="swift-banner">
            <div class="banner-content">
                <h1 class="banner-title">Welcome to SwiftShare</h1>
                <p class="banner-subtitle">Taylor Swift Fan Community</p>
                <div class="banner-actions">
                    <el-button type="primary" size="large" @click="exploreMusic">
                        🎵 探索音乐
                    </el-button>
                    <el-button size="large" @click="joinCommunity">
                        💕 加入社区
                    </el-button>
                </div>
            </div>
            <div class="banner-decoration">
                <div class="floating-note" v-for="(note, index) in floatingNotes" :key="index"
                     :style="{ animationDelay: `${index * 2}s` }">
                    {{ note }}
                </div>
            </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="swift-main">
            <div class="main-container">
                <!-- 快速导航 -->
                <section class="quick-nav">
                    <div class="nav-grid">
                        <div 
                            v-for="nav in quickNavs" 
                            :key="nav.path"
                            class="nav-card"
                            @click="goToPage(nav.path)"
                        >
                            <div class="nav-icon">{{ nav.icon }}</div>
                            <h3 class="nav-title">{{ nav.title }}</h3>
                            <p class="nav-desc">{{ nav.description }}</p>
                        </div>
                    </div>
                </section>

                <!-- 热门内容 -->
                <section class="content-section">
                    <div class="section-header">
                        <h2 class="section-title">🔥 热门推荐</h2>
                        <el-button text @click="viewMore('trending')">查看更多</el-button>
                    </div>
                    <div class="content-grid">
                        <div 
                            v-for="item in trendingContent" 
                            :key="item.id"
                            class="content-card"
                            @click="viewDetail(item.id)"
                        >
                            <div class="card-image">
                                <img :src="item.cover" :alt="item.title">
                                <div class="card-overlay">
                                    <el-icon size="24"><VideoPlay /></el-icon>
                                </div>
                                <div class="card-badge" v-if="item.badge">{{ item.badge }}</div>
                            </div>
                            <div class="card-content">
                                <h3 class="card-title">{{ item.title }}</h3>
                                <p class="card-desc">{{ item.description }}</p>
                                <div class="card-meta">
                                    <span class="meta-item">👁️ {{ item.views }}</span>
                                    <span class="meta-item">❤️ {{ item.likes }}</span>
                                    <span class="meta-item">💬 {{ item.comments }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 最新音乐 -->
                <section class="content-section">
                    <div class="section-header">
                        <h2 class="section-title">🎵 最新音乐</h2>
                        <el-button text @click="viewMore('music')">查看更多</el-button>
                    </div>
                    <div class="music-list">
                        <div 
                            v-for="song in latestMusic" 
                            :key="song.id"
                            class="music-item"
                            @click="playMusic(song)"
                        >
                            <div class="music-cover">
                                <img :src="song.cover" :alt="song.title">
                                <div class="play-overlay">
                                    <el-icon size="20"><VideoPlay /></el-icon>
                                </div>
                            </div>
                            <div class="music-info">
                                <h4 class="music-title">{{ song.title }}</h4>
                                <p class="music-artist">{{ song.artist }}</p>
                                <p class="music-album">{{ song.album }}</p>
                            </div>
                            <div class="music-duration">{{ song.duration }}</div>
                            <div class="music-actions">
                                <el-button circle size="small" @click.stop="addToPlaylist(song)">
                                    <el-icon><Plus /></el-icon>
                                </el-button>
                                <el-button circle size="small" @click.stop="likeSong(song)">
                                    <el-icon><Star /></el-icon>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Swiftie社区 -->
                <section class="content-section">
                    <div class="section-header">
                        <h2 class="section-title">💕 Swiftie社区</h2>
                        <el-button text @click="viewMore('community')">查看更多</el-button>
                    </div>
                    <div class="community-grid">
                        <div 
                            v-for="post in communityPosts" 
                            :key="post.id"
                            class="community-card"
                        >
                            <div class="post-header">
                                <el-avatar :src="post.avatar" :size="40"></el-avatar>
                                <div class="post-meta">
                                    <span class="post-author">{{ post.author }}</span>
                                    <span class="post-time">{{ post.time }}</span>
                                </div>
                                <el-dropdown @command="handlePostAction">
                                    <el-button circle size="small">
                                        <el-icon><MoreFilled /></el-icon>
                                    </el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item command="share">分享</el-dropdown-item>
                                            <el-dropdown-item command="report">举报</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                            <div class="post-content">
                                <p class="post-text">{{ post.content }}</p>
                                <div v-if="post.image" class="post-image">
                                    <img :src="post.image" :alt="post.content">
                                </div>
                                <div v-if="post.tags && post.tags.length" class="post-tags">
                                    <el-tag 
                                        v-for="tag in post.tags" 
                                        :key="tag"
                                        size="small"
                                        class="post-tag"
                                    >
                                        {{ tag }}
                                    </el-tag>
                                </div>
                            </div>
                            <div class="post-actions">
                                <span class="action-item" @click="likePost(post)">
                                    <el-icon :class="{ 'liked': post.isLiked }">
                                        <Star />
                                    </el-icon>
                                    {{ post.likes }}
                                </span>
                                <span class="action-item" @click="commentPost(post)">
                                    <el-icon><ChatDotRound /></el-icon>
                                    {{ post.comments }}
                                </span>
                                <span class="action-item" @click="sharePost(post)">
                                    <el-icon><Share /></el-icon>
                                    {{ post.shares }}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 最新资讯 -->
                <section class="content-section">
                    <div class="section-header">
                        <h2 class="section-title">📰 最新资讯</h2>
                        <el-button text @click="viewMore('news')">查看更多</el-button>
                    </div>
                    <div class="news-list">
                        <div 
                            v-for="news in latestNews" 
                            :key="news.id"
                            class="news-item"
                            @click="readNews(news)"
                        >
                            <div class="news-image">
                                <img :src="news.image" :alt="news.title">
                            </div>
                            <div class="news-content">
                                <h3 class="news-title">{{ news.title }}</h3>
                                <p class="news-summary">{{ news.summary }}</p>
                                <div class="news-meta">
                                    <span class="news-time">{{ news.time }}</span>
                                    <span class="news-category">{{ news.category }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

        <!-- 音乐播放器 -->
        <MusicPlayer 
            v-model="showMusicPlayer"
            :album="currentAlbum"
            :song="currentSong"
            @track-end="onTrackEnd"
        />

        <!-- 视频播放器 -->
        <VideoPlayer 
            v-model="showVideoPlayer"
            :video="currentVideo"
            @video-end="onVideoEnd"
        />
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
    VideoPlay, 
    Plus, 
    Star, 
    MoreFilled, 
    ChatDotRound,
    Share
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MusicPlayer from '@/components/MusicPlayer.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'

export default {
    name: 'SwiftHome',
    components: {
        VideoPlay,
        Plus,
        Star,
        MoreFilled,
        ChatDotRound,
        Share,
        MusicPlayer,
        VideoPlayer
    },
    setup() {
        const router = useRouter()
        const showMusicPlayer = ref(false)
        const showVideoPlayer = ref(false)
        const currentAlbum = ref(null)
        const currentSong = ref(null)
        const currentVideo = ref(null)
        
        // 响应式数据
        const floatingNotes = ref(['🎵', '🎤', '💕', '🎸', '🎭'])
        
        const quickNavs = ref([
            {
                title: '音乐库',
                description: '探索霉霉的所有音乐作品',
                icon: '🎵',
                path: '/music'
            },
            {
                title: '视频库',
                description: '观看MV、演唱会、采访等',
                icon: '🎬',
                path: '/videos'
            },
            {
                title: '社区',
                description: '与其他Swiftie交流分享',
                icon: '💕',
                path: '/community'
            },
            {
                title: '资讯',
                description: '获取霉霉最新动态',
                icon: '📰',
                path: '/news'
            }
        ])

        const trendingContent = ref([
            {
                id: 1,
                title: 'Taylor Swift - Cruel Summer (Live)',
                description: 'Eras Tour 现场版精彩表演，感受现场的热烈氛围。霉霉的精彩演出让所有观众都为之疯狂！',
                cover: '/images/videos/cruel-summer-live.jpg',
                thumbnail: 'https://via.placeholder.com/300x200/e91e63/ffffff?text=Cruel+Summer+Live',
                views: 1200000,
                likes: 89000,
                comments: 2300,
                badge: 'HOT',
                url: 'https://player.bilibili.com/player.html?isOutside=true&aid=749723677&bvid=BV1MC4y1c7Kv&cid=1366886152&p=1',
                tags: ['Live', 'Eras Tour', 'Cruel Summer']
            },
            {
                id: 2,
                title: 'Midnights Album Review',
                description: '深度解析霉霉最新专辑，探索每首歌背后的故事。从创作灵感到音乐制作，全面了解 Midnights 的魅力。',
                cover: 'https://via.placeholder.com/300x200/9c27b0/ffffff?text=Midnights+Review',
                thumbnail: 'https://via.placeholder.com/300x200/9c27b0/ffffff?text=Midnights+Review',
                views: 856000,
                likes: 67000,
                comments: 1800,
                badge: 'NEW',
                url: '/videos/midnights-review.mp4',
                tags: ['Review', 'Midnights', 'Analysis']
            },
            {
                id: 3,
                title: 'Eras Tour Behind the Scenes',
                description: '演唱会幕后花絮，了解舞台背后的精彩瞬间。从排练到演出，见证霉霉的敬业精神。',
                cover: 'https://via.placeholder.com/300x200/ff9800/ffffff?text=Eras+Tour+BTS',
                thumbnail: 'https://via.placeholder.com/300x200/ff9800/ffffff?text=Eras+Tour+BTS',
                views: 2100000,
                likes: 156000,
                comments: 4200,
                url: '/videos/eras-tour-bts.mp4',
                tags: ['Behind the Scenes', 'Eras Tour', 'Backstage']
            }
        ])

        const latestMusic = ref([
            {
                id: 1,
                title: 'Cruel Summer',
                artist: 'Taylor Swift',
                album: 'Lover',
                cover: 'https://via.placeholder.com/80x80/e91e63/ffffff?text=CS',
                duration: '3:28',
                durationSeconds: 208,
                url: '/audio/cruel-summer.mp3'
            },
            {
                id: 2,
                title: 'Anti-Hero',
                artist: 'Taylor Swift',
                album: 'Midnights',
                cover: '/images/music/anti-hero.jpeg',
                duration: '3:21',
                durationSeconds: 201,
                url: '/audio/anti-hero.mp3'
            },
            {
                id: 3,
                title: 'Cardigan',
                artist: 'Taylor Swift',
                album: 'Folklore',
                cover: 'https://via.placeholder.com/80x80/ff9800/ffffff?text=CG',
                duration: '3:59',
                durationSeconds: 239,
                url: '/audio/cardigan.mp3'
            },
            {
                id: 4,
                title: 'Shake It Off',
                artist: 'Taylor Swift',
                album: '1989',
                cover: 'https://via.placeholder.com/80x80/2196f3/ffffff?text=SIO',
                duration: '3:39',
                durationSeconds: 219,
                url: '/audio/shake-it-off.mp3'
            }
        ])

        const communityPosts = ref([
            {
                id: 1,
                author: 'Swiftie_Lover',
                avatar: 'https://via.placeholder.com/40x40/e91e63/ffffff?text=SL',
                content: '刚刚看了Eras Tour的直播，霉霉的表演太震撼了！每一首歌都让我感动到哭，这就是为什么我爱她！💖✨',
                time: '2小时前',
                likes: 234,
                comments: 45,
                shares: 12,
                isLiked: false,
                tags: ['Eras Tour', 'Live', '感动'],
                image: 'https://via.placeholder.com/400x200/ff9800/ffffff?text=Eras+Tour+Live'
            },
            {
                id: 2,
                author: 'Taylor_Fan_2024',
                avatar: 'https://via.placeholder.com/40x40/9c27b0/ffffff?text=TF',
                content: 'Midnights专辑循环播放中，每一首都太好听了！特别是Anti-Hero，歌词太戳心了！',
                time: '4小时前',
                likes: 156,
                comments: 23,
                shares: 8,
                isLiked: true,
                tags: ['Midnights', 'Anti-Hero', '循环播放']
            }
        ])

        const latestNews = ref([
            {
                id: 1,
                title: 'Taylor Swift宣布新专辑发行计划',
                summary: '霉霉在社交媒体上宣布了新的音乐计划，粉丝们期待不已...',
                image: 'https://via.placeholder.com/120x80/e91e63/ffffff?text=News+1',
                time: '1天前',
                category: '音乐新闻'
            },
            {
                id: 2,
                title: 'Eras Tour票房突破10亿美元',
                summary: 'Taylor Swift的Eras Tour成为史上最成功的巡演之一...',
                image: 'https://via.placeholder.com/120x80/9c27b0/ffffff?text=News+2',
                time: '2天前',
                category: '巡演新闻'
            }
        ])

        // 方法
        const exploreMusic = () => {
            router.push('/music')
        }

        const joinCommunity = () => {
            router.push('/community')
        }

        const goToPage = (path) => {
            router.push(path)
        }

        const viewMore = (type) => {
            switch (type) {
                case 'trending':
                    router.push('/videos')
                    break
                case 'music':
                    router.push('/music')
                    break
                case 'community':
                    router.push('/community')
                    break
                case 'news':
                    router.push('/news')
                    break
            }
        }

        const viewDetail = (id) => {
            // 假设 trendingContent 中的 item 是视频
            const item = trendingContent.value.find(item => item.id === id);
            if (item) {
                currentVideo.value = {
                    id: item.id,
                    title: item.title,
                    cover: item.cover,
                    url: item.url // 假设视频URL在 trendingContent 中
                };
                showVideoPlayer.value = true;
                ElMessage.success(`正在播放: ${item.title}`);
            } else {
                // 如果 item 不是视频，则跳转到详情页
                router.push(`/detail/${id}`);
            }
        }

        const playMusic = (song) => {
            // 创建专辑对象用于播放器
            currentAlbum.value = {
                id: song.albumId || 1,
                name: song.album,
                year: song.year || '2024',
                songs: 1,
                cover: song.cover
            }
            
            // 设置当前歌曲
            currentSong.value = {
                id: song.id,
                title: song.title,
                artist: song.artist,
                album: song.album,
                cover: song.cover,
                duration: song.durationSeconds || 200,
                url: song.url
            }
            
            // 显示音乐播放器
            showMusicPlayer.value = true
            
            ElMessage.success(`正在播放: ${song.title}`)
        }

        const onTrackEnd = (track) => {
            ElMessage.info(`歌曲播放完成: ${track.title}`)
        }

        const onVideoEnd = () => {
            ElMessage.info('视频播放完成');
            // 关闭视频播放器时暂停音乐播放
            if (showMusicPlayer.value) {
                showMusicPlayer.value = false;
                ElMessage.info('已暂停音乐播放');
            }
        }

        const addToPlaylist = (song) => {
            ElMessage.success(`已添加到播放列表: ${song.title}`)
        }

        const likeSong = (song) => {
            ElMessage.success(`已收藏: ${song.title}`)
        }

        const handlePostAction = (command) => {
            switch (command) {
                case 'share':
                    ElMessage.success('分享功能开发中...')
                    break
                case 'report':
                    ElMessage.success('举报功能开发中...')
                    break
            }
        }

        const likePost = (post) => {
            post.isLiked = !post.isLiked
            post.likes += post.isLiked ? 1 : -1
            ElMessage.success(post.isLiked ? '已点赞' : '已取消点赞')
        }

        // const commentPost = (post) => {
        //     ElMessage.success('评论功能开发中...')
        // }

        // const sharePost = (post) => {
        //     ElMessage.success('分享功能开发中...')
        // }
        const commentPost = (post) => {
            // 使用post参数
            console.log('评论帖子:', post.id)
            ElMessage.success(`评论功能开发中... (帖子ID: ${post.id})`)
        }

        const sharePost = (post) => {
            // 使用post参数
            console.log('分享帖子:', post.id)
            ElMessage.success(`分享功能开发中... (帖子ID: ${post.id})`)
        }



        const readNews = (news) => {
            router.push(`/news/${news.id}`)
        }

        return {
            floatingNotes,
            quickNavs,
            trendingContent,
            latestMusic,
            communityPosts,
            latestNews,
            exploreMusic,
            joinCommunity,
            showMusicPlayer,
            showVideoPlayer,
            currentAlbum,
            currentSong,
            currentVideo,
            goToPage,
            viewMore,
            viewDetail,
            playMusic,
            addToPlaylist,
            likeSong,
            handlePostAction,
            likePost,
            commentPost,
            sharePost,
            readNews,
            onTrackEnd,
            onVideoEnd
        }
    }
}
</script>

<style scoped>
.swift-home {
    min-height: calc(100vh - 64px);
    padding-top: 0;
}

.swift-banner {
    background: linear-gradient(135deg, var(--swift-pink) 0%, var(--swift-purple) 100%);
    height: 500px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.banner-content {
    text-align: center;
    color: white;
    z-index: 2;
    position: relative;
}

.banner-title {
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    animation: fadeInUp 1s ease-out;
}

.banner-subtitle {
    font-size: 1.3rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    animation: fadeInUp 1s ease-out 0.2s both;
}

.banner-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    animation: fadeInUp 1s ease-out 0.4s both;
}

.banner-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.floating-note {
    position: absolute;
    font-size: 2.5rem;
    animation: float 6s ease-in-out infinite;
}

.floating-note:nth-child(1) {
    top: 15%;
    left: 10%;
}

.floating-note:nth-child(2) {
    top: 25%;
    right: 15%;
}

.floating-note:nth-child(3) {
    bottom: 30%;
    left: 20%;
}

.floating-note:nth-child(4) {
    top: 60%;
    right: 25%;
}

.floating-note:nth-child(5) {
    bottom: 20%;
    right: 10%;
}

.swift-main {
    padding: 40px 0;
}

.main-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.quick-nav {
    margin-bottom: 60px;
}

.nav-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
}

.nav-card {
    background: white;
    border-radius: 16px;
    padding: 30px 20px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
    cursor: pointer;
    border: 2px solid transparent;
}

.nav-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(233, 30, 99, 0.15);
    border-color: var(--swift-pink);
}

.nav-icon {
    font-size: 3rem;
    margin-bottom: 16px;
    display: block;
}

.nav-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.nav-desc {
    color: #666;
    line-height: 1.5;
}

.content-section {
    margin-bottom: 60px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.section-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--swift-dark-pink);
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
}

.content-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    cursor: pointer;
    position: relative;
}

.content-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(233, 30, 99, 0.2);
}

.card-image {
    position: relative;
    height: 200px;
    overflow: hidden;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.content-card:hover .card-image img {
    transform: scale(1.05);
}

.card-overlay {
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

.content-card:hover .card-overlay {
    opacity: 1;
}

.card-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--swift-pink);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
}

.card-content {
    padding: 20px;
}

.card-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
    line-height: 1.4;
}

.card-desc {
    color: #666;
    margin-bottom: 12px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-meta {
    display: flex;
    gap: 16px;
    color: #999;
    font-size: 0.9rem;
}

.music-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.music-item {
    display: flex;
    align-items: center;
    padding: 16px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
    cursor: pointer;
}

.music-item:hover {
    transform: translateX(8px);
    box-shadow: 0 4px 20px rgba(233, 30, 99, 0.15);
}

.music-cover {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 16px;
    flex-shrink: 0;
}

.music-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

.music-item:hover .play-overlay {
    opacity: 1;
}

.music-info {
    flex: 1;
    min-width: 0;
}

.music-title {
    font-weight: 600;
    margin-bottom: 4px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.music-artist {
    color: var(--swift-pink);
    font-size: 0.9rem;
    margin-bottom: 2px;
}

.music-album {
    color: #999;
    font-size: 0.8rem;
}

.music-duration {
    color: #999;
    font-size: 0.9rem;
    margin: 0 16px;
    flex-shrink: 0;
}

.music-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
}

.community-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
}

.community-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
}

.community-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.post-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.post-meta {
    margin-left: 12px;
    flex: 1;
}

.post-author {
    display: block;
    font-weight: 600;
    color: #333;
}

.post-time {
    font-size: 0.8rem;
    color: #999;
}

.post-content {
    margin-bottom: 16px;
}

.post-text {
    line-height: 1.6;
    color: #333;
    margin-bottom: 12px;
}

.post-image {
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
}

.post-image img {
    width: 100%;
    height: auto;
}

.post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
}

.post-tag {
    background: var(--swift-light-pink);
    color: var(--swift-pink);
    border: none;
}

.post-actions {
    display: flex;
    gap: 20px;
    color: #666;
    font-size: 0.9rem;
}

.action-item {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: color 0.2s;
    padding: 4px 8px;
    border-radius: 4px;
}

.action-item:hover {
    color: var(--swift-pink);
    background: rgba(233, 30, 99, 0.1);
}

.action-item .el-icon.liked {
    color: var(--swift-pink);
}

.news-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.news-item {
    display: flex;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
    cursor: pointer;
}

.news-item:hover {
    transform: translateX(8px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.news-image {
    width: 120px;
    height: 80px;
    flex-shrink: 0;
}

.news-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.news-content {
    flex: 1;
    padding: 16px;
}

.news-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    line-height: 1.4;
}

.news-summary {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.news-meta {
    display: flex;
    gap: 16px;
    font-size: 0.8rem;
    color: #999;
}

.news-category {
    color: var(--swift-pink);
    font-weight: 500;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .banner-title {
        font-size: 2.5rem;
    }
    
    .banner-subtitle {
        font-size: 1rem;
    }
    
    .banner-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .nav-grid {
        grid-template-columns: 1fr;
    }
    
    .content-grid {
        grid-template-columns: 1fr;
    }
    
    .community-grid {
        grid-template-columns: 1fr;
    }
    
    .music-item {
        flex-wrap: wrap;
    }
    
    .music-actions {
        margin-top: 12px;
        width: 100%;
        justify-content: flex-end;
    }
    
    .news-item {
        flex-direction: column;
    }
    
    .news-image {
        width: 100%;
        height: 200px;
    }
    
    .main-container {
        padding: 0 15px;
    }
}
</style>