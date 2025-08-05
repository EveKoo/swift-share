<!-- src/views/swift/SwiftCommunity.vue -->
<template>
    <div class="swift-community">
        <div class="community-header">
            <h1 class="page-title">💕 Swiftie社区</h1>
            <p class="page-subtitle">与其他Swiftie分享你的感受和讨论</p>
        </div>
        
        <div class="community-content">
            <div class="post-form">
                <el-card class="form-card">
                    <div class="form-header">
                        <el-avatar :src="userAvatar" :size="40"></el-avatar>
                        <div class="form-input">
                            <el-input
                                v-model="newPost"
                                placeholder="分享你的想法..."
                                type="textarea"
                                :rows="3"
                                maxlength="500"
                                show-word-limit
                            />
                        </div>
                    </div>
                    <div class="form-actions">
                        <el-button type="primary" @click="submitPost" :disabled="!newPost.trim()">
                            <el-icon><ChatDotRound /></el-icon>
                            发布动态
                        </el-button>
                    </div>
                </el-card>
            </div>
            
            <div class="posts-list">
                <div 
                    v-for="post in posts" 
                    :key="post.id"
                    class="post-card"
                >
                    <div class="post-header">
                        <el-avatar :src="post.avatar" :size="40"></el-avatar>
                        <div class="post-meta">
                            <span class="post-author">{{ post.author }}</span>
                            <span class="post-time">{{ post.time }}</span>
                        </div>
                    </div>
                    <div class="post-content">
                        <p class="post-text">{{ post.content }}</p>
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
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { Star, ChatDotRound, Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
    name: 'SwiftCommunity',
    components: {
        Star,
        ChatDotRound,
        Share
    },
    setup() {
        const store = useStore()
        const newPost = ref('')
        
        const userAvatar = computed(() => store.getters.userAvatar || 'https://via.placeholder.com/40x40/e91e63/ffffff?text=U')
        
        const posts = ref([
            {
                id: 1,
                author: 'Swiftie_Lover',
                avatar: 'https://via.placeholder.com/40x40/e91e63/ffffff?text=SL',
                content: '刚刚看了Eras Tour的直播，霉霉的表演太震撼了！每一首歌都让我感动到哭，这就是为什么我爱她！💕✨',
                time: '2小时前',
                likes: 234,
                comments: 45,
                shares: 12,
                isLiked: false,
                tags: ['Eras Tour', 'Live', '感动']
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

        const submitPost = () => {
            if (!newPost.value.trim()) return
            
            const post = {
                id: Date.now(),
                author: store.getters.userName || '匿名用户',
                avatar: userAvatar.value,
                content: newPost.value,
                time: '刚刚',
                likes: 0,
                comments: 0,
                shares: 0,
                isLiked: false,
                tags: []
            }
            
            posts.value.unshift(post)
            newPost.value = ''
            ElMessage.success('动态发布成功！')
        }

        const likePost = (post) => {
            post.isLiked = !post.isLiked
            post.likes += post.isLiked ? 1 : -1
            ElMessage.success(post.isLiked ? '已点赞' : '已取消点赞')
        }

        const commentPost = () => {
            ElMessage.info('评论功能开发中...')
        }

        const sharePost = () => {
            ElMessage.info('分享功能开发中...')
        }

        return {
            newPost,
            userAvatar,
            posts,
            submitPost,
            likePost,
            commentPost,
            sharePost
        }
    }
}
</script>

<style scoped>
.swift-community {
    padding: 40px 20px;
    min-height: calc(100vh - 64px);
}

.community-header {
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

.community-content {
    max-width: 800px;
    margin: 0 auto;
}

.post-form {
    margin-bottom: 40px;
}

.form-card {
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-header {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
}

.form-input {
    flex: 1;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
}

.posts-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.post-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
}

.post-card:hover {
    transform: translateY(-2px);
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

.post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
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

@media (max-width: 768px) {
    .swift-community {
        padding: 20px 15px;
    }
    
    .page-title {
        font-size: 2rem;
    }
    
    .form-header {
        flex-direction: column;
        gap: 12px;
    }
    
    .post-actions {
        gap: 16px;
    }
}
</style>