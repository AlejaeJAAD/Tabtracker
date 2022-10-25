import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'
import Cookies from "js-cookie";
const ls = new SecureLS({isCompression: false})

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    sessionToken: localStorage.x_jwt_string,
    user: null,
    isUserLoggedIn: false,
    cookiesAccepted: false
  },
  getters: {
    getToken(state) {
      return state.sessionToken
    },
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      if (token) {
        state.isUserLoggedIn = true
      } else {
        state.isUserLoggedIn = false
      }
    },
    setUser (state, user) {
      state.user = user
    },
    clearAuthData(state) {
      state.token = null
      state.sessionToken = null
      state.isUserLoggedIn = null
      state.user = null
      state.cookiesAccepted = false
    },
  },
  actions: {
    setToken ({commit}, token) {
      commit('setToken', token)
    },
    setUser ({commit}, user) {
      commit('setUser', user)
    },
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      key: 'TT-S',
      paths: [
        'token',
        'sessionToken',
        'user', 
        'isUserLoggedIn',
        'cookiesAccepted',
      ],
      // key: 'ALEJAE-19081997',
      // storage: {
      //   getItem: key => Cookies.get(key),
      //   setItem: (key, value) => Cookies.set(key, value, {expires: 1}),
      //   removeItem: key => Cookies.remove(key)
      // }
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key)
      }
    })
  ]
})
