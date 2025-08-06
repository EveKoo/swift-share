<template>
    <div class="swift-header" :class="isFixed ? 'swift-header-fixed' : ''">
        <div class="swift-header-container">
            <!-- Logo区域 -->
            <div class="swift-logo" @click="goHome">
                <div class="logo-icon">🎵</div>
                <div class="logo-text">
                    <span class="logo-title">SwiftShare</span>
                    <span class="logo-subtitle">Taylor Swift Community</span>
                </div>
            </div>

            <!-- 导航菜单 -->
            <nav class="swift-nav" :class="{ 'nav-mobile': isMobile }">
                <router-link 
                    v-for="item in navItems" 
                    :key="item.path"
                    :to="item.path"
                    class="nav-item"
                    :class="{ active: $route.path === item.path }"
                    @click="handleNavClick"
                >
                    <span class="nav-icon">{{ item.icon }}</span>
                    <span class="nav-text">{{ item.name }}</span>
                </router-link>
            </nav>

            <!-- 搜索框 -->
            <div class="swift-search" :class="{ 'search-mobile': isMobile }">
                <el-input
                    v-model="searchKeyword"
                    placeholder="搜索霉霉相关内容..."
                    class="search-input"
                    @keyup.enter="handleSearch"
                    @focus="handleSearchFocus"
                    @blur="handleSearchBlur"
                >
                    <template #prefix>
                        <el-icon><Search /></el-icon>
                    </template>
                    <template #suffix v-if="searchKeyword">
                        <el-icon @click="clearSearch" class="clear-icon">
                            <CircleCloseFilled />
                        </el-icon>
                    </template>
                </el-input>
                
                <!-- 搜索建议 -->
                <div v-if="showSearchSuggestions" class="search-suggestions">
                    <div 
                        v-for="suggestion in searchSuggestions" 
                        :key="suggestion.id"
                        class="suggestion-item"
                        @click="selectSuggestion(suggestion)"
                    >
                        <el-icon><Search /></el-icon>
                        <span>{{ suggestion.text }}</span>
                    </div>
                </div>
            </div>

            <!-- 用户区域 -->
            <div class="swift-user">
                <!-- 主题切换按钮 -->
                <el-button 
                    @click="appStore.toggleTheme"
                    class="theme-toggle-btn"
                    :title="appStore.isDarkMode ? '切换到浅色模式' : '切换到深色模式'"
                >
                    <el-icon v-if="appStore.isDarkMode">☀️</el-icon>
                    <el-icon v-else>🌙</el-icon>
                </el-button>
                
                <!-- 角色显示 -->
                <div v-if="isLoggedIn" class="role-badge" :class="userRole">
                    <el-icon><UserFilled /></el-icon>
                    <span>{{ getRoleDisplayName(userRole) }}</span>
                </div>
                
                <template v-if="isLoggedIn">
                    <el-dropdown @command="handleUserCommand" trigger="click">
                        <div class="user-avatar">
                            <el-avatar :src="userAvatar" :size="32">
                                <el-icon><User /></el-icon>
                            </el-avatar>
                            <span class="user-name">{{ userName }}</span>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="profile">
                                    <el-icon><User /></el-icon>
                                    个人中心
                                </el-dropdown-item>
                                <el-dropdown-item command="upload">
                                    <el-icon><Upload /></el-icon>
                                    上传内容
                                </el-dropdown-item>
                                <el-dropdown-item command="favorites">
                                    <el-icon><Star /></el-icon>
                                    我的收藏
                                </el-dropdown-item>
                                <el-dropdown-item divided command="logout">
                                    <el-icon><SwitchButton /></el-icon>
                                    退出登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
                <template v-else>
                    <el-button type="primary" @click="showLogin" class="login-btn">
                        <el-icon><User /></el-icon>
                        登录
                    </el-button>
                    <el-button @click="showRegister" class="register-btn">
                        注册
                    </el-button>
                </template>
            </div>

            <!-- 移动端菜单按钮 -->
            <div class="mobile-menu-btn" @click="toggleMobileMenu" v-if="isMobile">
                <span :class="{ 'active': isMobileMenuOpen }"></span>
                <span :class="{ 'active': isMobileMenuOpen }"></span>
                <span :class="{ 'active': isMobileMenuOpen }"></span>
            </div>
        </div>

        <!-- 移动端菜单 -->
        <div v-if="isMobile && isMobileMenuOpen" class="mobile-menu">
            <div class="mobile-menu-content">
                <router-link 
                    v-for="item in navItems" 
                    :key="item.path"
                    :to="item.path"
                    class="mobile-nav-item"
                    @click="closeMobileMenu"
                >
                    <span class="nav-icon">{{ item.icon }}</span>
                    <span class="nav-text">{{ item.name }}</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { 
    Search, 
    User, 
    Upload, 
    Star, 
    SwitchButton,
    CircleCloseFilled,
    UserFilled
} from '@element-plus/icons-vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'

export default {
    name: 'SwiftHeader',
    components: {
        Search,
        User,
        Upload,
        Star,
        SwitchButton,
        CircleCloseFilled,
        UserFilled
    },
    props: {
        isFixed: {
            type: Boolean,
            default: false
        }
    },
    emits: ['show-login', 'show-register'],
    setup(props, { emit }) {
        const router = useRouter()
        const userStore = useUserStore()
        const appStore = useAppStore()
        
        // 响应式数据
        const searchKeyword = ref('')
        const showSearchSuggestions = ref(false)
        const isMobileMenuOpen = ref(false)
        const isMobile = ref(false)
        
        // 从store获取用户状态
        const isLoggedIn = computed(() => userStore.isLoggedIn)
        const userAvatar = computed(() => userStore.userInfo?.avatar || '')
        const userName = computed(() => userStore.userInfo?.username || '')
        const userRole = computed(() => userStore.userInfo?.role || 'user')

        // 导航菜单配置
        const navItems = [
            { name: '首页', path: '/', icon: '🏠' },
            { name: '音乐库', path: '/music', icon: '🎵' },
            { name: '视频库', path: '/videos', icon: '🎬' },
            { name: '社区', path: '/community', icon: '💕' },
            { name: '资讯', path: '/news', icon: '📰' }
        ]

        // 搜索建议
        const searchSuggestions = computed(() => {
            if (!searchKeyword.value) return []
            
            const suggestions = [
                'Taylor Swift Eras Tour',
                'Midnights Album',
                'Folklore Live',
                'Swiftie Community',
                'Taylor Swift News',
                'Reputation Stadium Tour',
                'Lover Album',
                '1989 World Tour'
            ]
            
            return suggestions
                .filter(item => item.toLowerCase().includes(searchKeyword.value.toLowerCase()))
                .slice(0, 5)
                .map((text, index) => ({ id: index, text }))
        })

        // 方法
        const goHome = () => {
            router.push('/')
        }

        const handleNavClick = () => {
            if (isMobile.value) {
                closeMobileMenu()
            }
        }

        const handleSearch = () => {
            if (searchKeyword.value.trim()) {
                router.push({
                    path: '/search',
                    query: { keyword: searchKeyword.value }
                })
                showSearchSuggestions.value = false
            }
        }

        const handleSearchFocus = () => {
            if (searchKeyword.value) {
                showSearchSuggestions.value = true
            }
        }

        const handleSearchBlur = () => {
            setTimeout(() => {
                showSearchSuggestions.value = false
            }, 200)
        }

        const clearSearch = () => {
            searchKeyword.value = ''
            showSearchSuggestions.value = false
        }

        const selectSuggestion = (suggestion) => {
            searchKeyword.value = suggestion.text
            handleSearch()
        }

        const handleUserCommand = (command) => {
            switch (command) {
                case 'profile':
                    router.push('/profile')
                    break
                case 'upload':
                    router.push('/upload')
                    break
                case 'favorites':
                    router.push('/profile?tab=favorites')
                    break
                case 'logout':
                    logout()
                    break
            }
        }

        const showLogin = () => {
            emit('show-login')
        }

        const showRegister = () => {
            emit('show-register')
        }

        const logout = () => {
            userStore.logout()
            router.push('/')
            ElMessage.success('已退出登录')
        }

        const toggleMobileMenu = () => {
            isMobileMenuOpen.value = !isMobileMenuOpen.value
        }

        const closeMobileMenu = () => {
            isMobileMenuOpen.value = false
        }

        const getRoleDisplayName = (role) => {
            switch (role) {
                case 'admin':
                    return '管理员'
                case 'moderator':
                    return '版主'
                default:
                    return '用户'
            }
        }


        const checkMobile = () => {
            isMobile.value = window.innerWidth <= 768
        }

        // 生命周期
        onMounted(() => {
            checkMobile()
            window.addEventListener('resize', checkMobile)
        })

        onUnmounted(() => {
            window.removeEventListener('resize', checkMobile)
        })

        return {
            searchKeyword,
            showSearchSuggestions,
            isMobileMenuOpen,
            isMobile,
            isLoggedIn,
            userAvatar,
            userName,
            navItems,
            searchSuggestions,
            goHome,
            handleNavClick,
            handleSearch,
            handleSearchFocus,
            handleSearchBlur,
            clearSearch,
            selectSuggestion,
            handleUserCommand,
            showLogin,
            showRegister,
            logout,
            toggleMobileMenu,
            closeMobileMenu,
            userRole,
            getRoleDisplayName,
            appStore
        }
    }
}
</script>

<style scoped>
.swift-header {
    background: linear-gradient(135deg, var(--swift-pink) 0%, var(--swift-purple) 100%);
    box-shadow: 0 2px 20px rgba(233, 30, 99, 0.3);
    position: relative;
    z-index: 1000;
    transition: all 0.3s ease;
}

.swift-header-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    animation: slideDown 0.3s ease-out;
}

.swift-header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
}

.swift-logo {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s;
    flex-shrink: 0;
}

.swift-logo:hover {
    transform: scale(1.05);
}

.logo-icon {
    font-size: 2rem;
    margin-right: 12px;
    animation: musicNote 2s infinite;
}

.logo-text {
    display: flex;
    flex-direction: column;
}

.logo-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    letter-spacing: 1px;
}

.logo-subtitle {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.8);
    margin-top: -2px;
}

.swift-nav {
    display: flex;
    gap: 8px;
    margin: 0 20px;
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 20px;
    color: white;
    text-decoration: none;
    transition: all 0.3s;
    position: relative;
    white-space: nowrap;
}

.nav-item:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.nav-item.active {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.nav-item.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 2px;
    background: white;
    border-radius: 1px;
}

.nav-icon {
    font-size: 1.2rem;
    margin-right: 6px;
}

.nav-text {
    font-weight: 500;
}

.swift-search {
    flex: 1;
    max-width: 400px;
    margin: 0 20px;
    position: relative;
}

.search-input {
    border-radius: 25px;
    overflow: hidden;
}

.search-input :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
}

.search-input :deep(.el-input__wrapper:hover) {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.clear-icon {
    cursor: pointer;
    color: #999;
    transition: color 0.2s;
}

.clear-icon:hover {
    color: #666;
}

.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    margin-top: 4px;
    z-index: 1001;
    max-height: 300px;
    overflow-y: auto;
}

.suggestion-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    color: #333;
}

.suggestion-item:hover {
    background-color: #f5f5f5;
}

.suggestion-item .el-icon {
    margin-right: 8px;
    color: #999;
}

.swift-user {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

.user-avatar {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s;
    padding: 4px 8px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
}

.user-avatar:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.2);
}

.user-name {
    color: white;
    margin-left: 8px;
    font-size: 0.9rem;
    font-weight: 500;
}

.login-btn, .register-btn {
    border-radius: 20px;
    font-weight: 500;
    transition: all 0.3s;
}

.login-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
}

.login-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}

.register-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: white;
}

.register-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.theme-toggle-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    border-radius: 20px;
    padding: 8px 12px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 6px;
}

.theme-toggle-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}

.role-badge {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    padding: 4px 10px;
    font-size: 0.8rem;
    font-weight: 600;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    gap: 6px;
}

.role-badge.admin {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
}

.role-badge.moderator {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
}

.mobile-menu-btn {
    display: none;
    flex-direction: column;
    cursor: pointer;
    padding: 8px;
}

.mobile-menu-btn span {
    width: 20px;
    height: 2px;
    background: white;
    margin: 2px 0;
    transition: all 0.3s;
    border-radius: 1px;
}

.mobile-menu-btn span.active:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn span.active:nth-child(2) {
    opacity: 0;
}

.mobile-menu-btn span.active:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
}

.mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1001;
    animation: slideDown 0.3s ease-out;
}

.mobile-menu-content {
    padding: 20px;
}

.mobile-nav-item {
    display: flex;
    align-items: center;
    padding: 16px 0;
    color: #333;
    text-decoration: none;
    border-bottom: 1px solid #f0f0f0;
    transition: color 0.2s;
}

.mobile-nav-item:last-child {
    border-bottom: none;
}

.mobile-nav-item:hover {
    color: var(--swift-pink);
}

.mobile-nav-item .nav-icon {
    margin-right: 12px;
    font-size: 1.2rem;
}

@keyframes slideDown {
    from {
        transform: translateY(-100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes musicNote {
    0%, 100% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(10deg);
    }
    75% {
        transform: rotate(-10deg);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .swift-header-container {
        padding: 0 15px;
        height: 56px;
    }
    
    .logo-title {
        font-size: 1.2rem;
    }
    
    .logo-subtitle {
        font-size: 0.7rem;
    }
    
    .nav-text {
        display: none;
    }
    
    .nav-item {
        padding: 8px 12px;
    }
    
    .swift-search {
        max-width: 200px;
        margin: 0 10px;
    }
    
    .user-name {
        display: none;
    }
    
    .mobile-menu-btn {
        display: flex;
    }
    
    .swift-nav {
        display: none;
    }
    
    .swift-search.search-mobile {
        display: none;
    }
}

@media (max-width: 480px) {
    .swift-search {
        display: none;
    }
    
    .register-btn {
        display: none;
    }
}
</style>