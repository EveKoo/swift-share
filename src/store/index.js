
import { createStore } from 'vuex';

export default createStore({
    state: {
        user: null,
        isLoggedIn: false,
        theme: 'light',
        isLoading: false,
        notifications: [],
        favorites: [],
        playlists: []
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn,
        currentUser: state => state.user,
        userAvatar: state => state.user?.avatar || '',
        userName: state => state.user?.nickname || state.user?.username || '',
        theme: state => state.theme,
        isLoading: state => state.isLoading,
        notifications: state => state.notifications,
        favorites: state => state.favorites,
        playlists: state => state.playlists
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            state.isLoggedIn = !!user;
        },
        setTheme(state, theme) {
            state.theme = theme;
            localStorage.setItem('swift_theme', theme);
        },
        setLoading(state, loading) {
            state.isLoading = loading;
        },
        addNotification(state, notification) {
            state.notifications.push({
                id: Date.now(),
                ...notification,
                timestamp: new Date()
            });
        },
        removeNotification(state, id) {
            state.notifications = state.notifications.filter(n => n.id !== id);
        },
        addToFavorites(state, item) {
            if (!state.favorites.find(f => f.id === item.id)) {
                state.favorites.push(item);
                localStorage.setItem('swift_favorites', JSON.stringify(state.favorites));
            }
        },
        removeFromFavorites(state, id) {
            state.favorites = state.favorites.filter(f => f.id !== id);
            localStorage.setItem('swift_favorites', JSON.stringify(state.favorites));
        },
        setPlaylists(state, playlists) {
            state.playlists = playlists;
        },
        addPlaylist(state, playlist) {
            state.playlists.push(playlist);
        }
    },
    actions: {
        // 登录
        async login({ commit }, userData) {
            commit('setLoading', true);
            try {
                // 模拟API调用
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const user = {
                    id: userData.id || Date.now(),
                    username: userData.username,
                    nickname: userData.nickname || userData.username,
                    avatar: userData.avatar || 'https://via.placeholder.com/40x40/e91e63/ffffff?text=TS',
                    email: userData.email,
                    joinDate: new Date().toISOString()
                };
                
                commit('setUser', user);
                localStorage.setItem('swift_token', userData.token || 'mock_token_' + Date.now());
                localStorage.setItem('swift_user', JSON.stringify(user));
                
                return user;
            } finally {
                commit('setLoading', false);
            }
        },
        
        // 登出
        logout({ commit }) {
            commit('setUser', null);
            localStorage.removeItem('swift_token');
            localStorage.removeItem('swift_user');
        },
        
        // 初始化应用状态
        initApp({ commit }) {
            // 恢复主题设置
            const savedTheme = localStorage.getItem('swift_theme') || 'light';
            commit('setTheme', savedTheme);
            
            // 恢复用户状态
            const token = localStorage.getItem('swift_token');
            const userData = localStorage.getItem('swift_user');
            
            if (token && userData) {
                try {
                    const user = JSON.parse(userData);
                    commit('setUser', user);
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                    localStorage.removeItem('swift_token');
                    localStorage.removeItem('swift_user');
                }
            }
            
            // 恢复收藏列表
            const favorites = localStorage.getItem('swift_favorites');
            if (favorites) {
                try {
                    const parsedFavorites = JSON.parse(favorites);
                    parsedFavorites.forEach(item => commit('addToFavorites', item));
                } catch (error) {
                    console.error('Failed to parse favorites:', error);
                }
            }
        },
        
        // 切换主题
        toggleTheme({ commit, state }) {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            commit('setTheme', newTheme);
        },
        
        // 添加通知
        showNotification({ commit }, { type = 'info', message, duration = 3000 }) {
            commit('addNotification', { type, message, duration });
            
            // 自动移除通知
            setTimeout(() => {
                commit('removeNotification', Date.now());
            }, duration);
        },
        
        // 收藏/取消收藏
        toggleFavorite({ commit, state }, item) {
            const isFavorited = state.favorites.find(f => f.id === item.id);
            if (isFavorited) {
                commit('removeFromFavorites', item.id);
            } else {
                commit('addToFavorites', item);
            }
        }
    },
    modules: {
        // 可以在这里添加模块化的store
    }
});
