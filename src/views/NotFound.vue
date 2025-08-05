<!-- src/views/NotFound.vue -->
<template>
    <div class="not-found">
        <div class="not-found-content">
            <div class="error-illustration">
                <div class="music-notes">
                    <span class="note note-1">🎵</span>
                    <span class="note note-2">🎤</span>
                    <span class="note note-3">💕</span>
                    <span class="note note-4">🎭</span>
                </div>
                <h1 class="error-code">404</h1>
                <div class="error-decoration">
                    <div class="decoration-line"></div>
                    <div class="decoration-dot"></div>
                    <div class="decoration-line"></div>
                </div>
            </div>
            
            <h2 class="error-title">页面未找到</h2>
            <p class="error-desc">抱歉，您访问的页面不存在或已被删除</p>
            <p class="error-subtitle">就像霉霉的歌一样，这个页面可能已经重新录制了</p>
            
            <div class="error-actions">
                <el-button type="primary" size="large" @click="goHome" class="home-btn">
                    <el-icon><House /></el-icon>
                    返回首页
                </el-button>
                <el-button size="large" @click="goBack" class="back-btn">
                    <el-icon><ArrowLeft /></el-icon>
                    返回上页
                </el-button>
            </div>
            
            <div class="quick-links">
                <p class="links-title">快速导航：</p>
                <div class="links-grid">
                    <el-button 
                        v-for="link in quickLinks" 
                        :key="link.path"
                        text 
                        @click="goToPage(link.path)"
                        class="quick-link"
                    >
                        <span class="link-icon">{{ link.icon }}</span>
                        <span class="link-text">{{ link.name }}</span>
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { House, ArrowLeft } from '@element-plus/icons-vue'

export default {
    name: 'NotFound',
    components: {
        House,
        ArrowLeft
    },
    setup() {
        const router = useRouter()
        
        const quickLinks = [
            { name: '音乐库', path: '/music', icon: '🎵' },
            { name: '视频库', path: '/videos', icon: '🎬' },
            { name: '社区', path: '/community', icon: '💕' },
            { name: '资讯', path: '/news', icon: '📰' }
        ]
        
        const goHome = () => {
            router.push('/')
        }
        
        const goBack = () => {
            router.go(-1)
        }
        
        const goToPage = (path) => {
            router.push(path)
        }
        
        return {
            quickLinks,
            goHome,
            goBack,
            goToPage
        }
    }
}
</script>

<style scoped>
.not-found {
    min-height: calc(100vh - 64px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--swift-light-pink) 0%, #f8bbd9 100%);
    padding: 20px;
}

.not-found-content {
    text-align: center;
    padding: 60px 40px;
    background: white;
    border-radius: 24px;
    box-shadow: 0 12px 40px rgba(233, 30, 99, 0.15);
    max-width: 600px;
    width: 100%;
    position: relative;
    overflow: hidden;
}

.not-found-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--swift-pink), var(--swift-purple), var(--swift-gold));
}

.error-illustration {
    position: relative;
    margin-bottom: 30px;
}

.music-notes {
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    height: 0;
    z-index: 1;
}

.note {
    position: absolute;
    font-size: 2rem;
    animation: float 3s ease-in-out infinite;
    opacity: 0.6;
}

.note-1 {
    top: 0;
    left: 10%;
    animation-delay: 0s;
}

.note-2 {
    top: 20px;
    right: 15%;
    animation-delay: 0.5s;
}

.note-3 {
    top: 40px;
    left: 20%;
    animation-delay: 1s;
}

.note-4 {
    top: 10px;
    right: 25%;
    animation-delay: 1.5s;
}

.error-code {
    font-size: 8rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--swift-pink), var(--swift-purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    line-height: 1;
    position: relative;
    z-index: 2;
}

.error-decoration {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
}

.decoration-line {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--swift-pink), transparent);
}

.decoration-dot {
    width: 8px;
    height: 8px;
    background: var(--swift-pink);
    border-radius: 50%;
    margin: 0 20px;
}

.error-title {
    font-size: 2.5rem;
    color: var(--swift-dark-pink);
    margin: 30px 0 15px;
    font-weight: 600;
}

.error-desc {
    color: var(--swift-text-secondary);
    margin-bottom: 8px;
    line-height: 1.6;
    font-size: 1.1rem;
}

.error-subtitle {
    color: var(--swift-text-muted);
    font-style: italic;
    margin-bottom: 40px;
    font-size: 0.9rem;
}

.error-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.home-btn {
    background: linear-gradient(135deg, var(--swift-pink), var(--swift-purple));
    border: none;
    border-radius: 25px;
    padding: 12px 24px;
    font-weight: 600;
    transition: all 0.3s;
}

.home-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(233, 30, 99, 0.3);
}

.back-btn {
    border: 2px solid var(--swift-pink);
    color: var(--swift-pink);
    border-radius: 25px;
    padding: 12px 24px;
    font-weight: 600;
    transition: all 0.3s;
}

.back-btn:hover {
    background: var(--swift-pink);
    color: white;
    transform: translateY(-2px);
}

.quick-links {
    border-top: 1px solid var(--swift-border-light);
    padding-top: 30px;
}

.links-title {
    color: var(--swift-text-secondary);
    margin-bottom: 16px;
    font-weight: 500;
}

.links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    max-width: 400px;
    margin: 0 auto;
}

.quick-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 8px;
    border-radius: 12px;
    transition: all 0.3s;
    color: var(--swift-text-secondary);
}

.quick-link:hover {
    background: var(--swift-light-pink);
    color: var(--swift-pink);
    transform: translateY(-2px);
}

.link-icon {
    font-size: 1.5rem;
    margin-bottom: 8px;
    display: block;
}

.link-text {
    font-size: 0.9rem;
    font-weight: 500;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .not-found {
        padding: 10px;
    }
    
    .not-found-content {
        padding: 40px 20px;
    }
    
    .error-code {
        font-size: 5rem;
    }
    
    .error-title {
        font-size: 1.8rem;
    }
    
    .error-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .links-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .error-code {
        font-size: 4rem;
    }
    
    .error-title {
        font-size: 1.5rem;
    }
    
    .links-grid {
        grid-template-columns: 1fr;
    }
}
</style>