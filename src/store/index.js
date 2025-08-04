
import { createStore } from 'vuex';

export default createStore({
    state: {
        user: null,
        isLoggedIn: false,
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            state.isLoggedIn = !!user;
        }
    },
    actions: {
        login({ commit }, user) {
            commit('setUser', user)
        },
        logout({ commit }) {
            commit('setUser', null)
        }
    },
});
