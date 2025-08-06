
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
            keepAlive: true,
            analytics: true,
            description: '欢迎来到霉霉粉丝社区'
        }
    },
    {
        path: '/music',
        name: 'swift-music',
        component: SwiftMusic,
        meta: {
            title: '音乐库 - SwiftShare',
            requestAuth: false,
            keepAlive: true,
            analytics: true,
            description: '探索霉霉的所有音乐作品'
        }
    },
    {
        path: '/videos',
        name: 'swift-videos',
        component: SwiftVideos,
        meta: {
            title: '视频库 - SwiftShare',
            requestAuth: false,
            keepAlive: true,
            analytics: true,
            description: '观看MV、演唱会、采访等精彩视频'
        }
    },
    {
        path: '/community',
        name: 'swift-community',
        component: SwiftCommunity,
        meta: {
            title: 'Swiftie社区 - SwiftShare',
            requestAuth: false,
            keepAlive: true,
            analytics: true,
            description: '与其他Swiftie交流分享'
        }
    },
    {
        path: '/news',
        name: 'swift-news',
        component: SwiftNews,
        meta: {
            title: '霉霉资讯 - SwiftShare',
            requestAuth: false,
            keepAlive: true,
            analytics: true,
            description: '获取霉霉最新动态和资讯'
        }
    },
    {
        path: '/profile',
        name: 'swift-profile',
        component: SwiftProfile,
        meta: {
            title: '个人中心 - SwiftShare',
            requestAuth: true,
            keepAlive: false,
            analytics: true,
            description: '管理个人信息和设置',
            roles: ['user', 'admin']
        }
    },
    {
        path: '/upload',
        name: 'swift-upload',
        component: SwiftUpload,
        meta: {
            title: '上传内容 - SwiftShare',
            requestAuth: true,
            keepAlive: false,
            analytics: true,
            description: '上传音乐、视频等内容',
            roles: ['user', 'admin']
        }
    },
    {
        path: '/detail/:id',
        name: 'swift-detail',
        component: SwiftDetail,
        meta: {
            title: '内容详情 - SwiftShare',
            requestAuth: false,
            keepAlive: false,
            analytics: true,
            description: '查看内容详细信息'
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
            keepAlive: false,
            analytics: true,
            description: '搜索霉霉相关内容'
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
            keepAlive: false,
            analytics: false,
            description: '登录到SwiftShare'
        }
    },
    {
        path: '/register',
        name: 'swift-register',
        component: SwiftRegister,
        meta: {
            title: '注册 - SwiftShare',
            requestAuth: false,
            keepAlive: false,
            analytics: false,
            description: '注册SwiftShare账号'
        }
    },

]

// 直接导出路由配置，不创建router实例
export default swiftRoutes