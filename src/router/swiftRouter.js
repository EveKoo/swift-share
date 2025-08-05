
// SwiftShare主题页面组件 - 懒加载
const SwiftHome = () => import('@/views/swift/SwiftHome.vue')
const SwiftMusic = () => import('@/views/swift/SwiftMusic.vue')
const SwiftVideos = () => import('@/views/swift/SwiftVideos.vue')
const SwiftCommunity = () => import('@/views/swift/SwiftCommunity.vue')
const SwiftNews = () => import('@/views/swift/SwiftNews.vue')
const SwiftProfile = () => import('@/views/swift/SwiftProfile.vue')
const SwiftUpload = () => import('@/views/swift/SwiftUpload.vue')
const SwiftDetail = () => import('@/views/swift/SwiftDetail.vue')
const SwiftSearch = () => import('@/views/swift/SwiftSearch.vue')
const SwiftLogin = () => import('@/views/swift/SwiftLogin.vue')
const SwiftRegister = () => import('@/views/swift/SwiftRegister.vue')

// SwiftShare路由配置
const swiftRoutes = [
    {
        path: '/',
        name: 'swift-home',
        component: SwiftHome,
        meta: {
            title: 'SwiftShare - 霉霉粉丝社区',
            requestAuth: false,
            keepAlive: true
        }
    },
    {
        path: '/music',
        name: 'swift-music',
        component: SwiftMusic,
        meta: {
            title: '音乐库 - SwiftShare',
            requestAuth: false,
            keepAlive: true
        }
    },
    {
        path: '/videos',
        name: 'swift-videos',
        component: SwiftVideos,
        meta: {
            title: '视频库 - SwiftShare',
            requestAuth: false,
            keepAlive: true
        }
    },
    {
        path: '/community',
        name: 'swift-community',
        component: SwiftCommunity,
        meta: {
            title: 'Swiftie社区 - SwiftShare',
            requestAuth: false,
            keepAlive: true
        }
    },
    {
        path: '/news',
        name: 'swift-news',
        component: SwiftNews,
        meta: {
            title: '霉霉资讯 - SwiftShare',
            requestAuth: false,
            keepAlive: true
        }
    },
    {
        path: '/profile',
        name: 'swift-profile',
        component: SwiftProfile,
        meta: {
            title: '个人中心 - SwiftShare',
            requestAuth: true,
            keepAlive: false
        }
    },
    {
        path: '/upload',
        name: 'swift-upload',
        component: SwiftUpload,
        meta: {
            title: '上传内容 - SwiftShare',
            requestAuth: true,
            keepAlive: false
        }
    },
    {
        path: '/detail/:id',
        name: 'swift-detail',
        component: SwiftDetail,
        meta: {
            title: '内容详情 - SwiftShare',
            requestAuth: false,
            keepAlive: false
        },
        props: true
    },
    {
        path: '/search',
        name: 'swift-search',
        component: SwiftSearch,
        meta: {
            title: '搜索 - SwiftShare',
            requestAuth: false,
            keepAlive: false
        },
        props: route => ({
            keyword: route.query.keyword,
            type: route.query.type || 'all'
        })
    },
    {
        path: '/login',
        name: 'swift-login',
        component: SwiftLogin,
        meta: {
            title: '登录 - SwiftShare',
            requestAuth: false,
            keepAlive: false
        }
    },
    {
        path: '/register',
        name: 'swift-register',
        component: SwiftRegister,
        meta: {
            title: '注册 - SwiftShare',
            requestAuth: false,
            keepAlive: false
        }
    }
]

// 直接导出路由配置，不创建router实例
export default swiftRoutes