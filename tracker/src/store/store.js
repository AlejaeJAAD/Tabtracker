import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'
const ls = new SecureLS({isCompression: false})

import Crypto from 'crypto-js';
import Cookie from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

Vue.use(Vuex)

// const cookieName = 'TT-S';
// const storageKey = 'TT-S-STORAGE';
// const encryptionToken = Cookie.get(cookieName) || uuidv4();

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    authenticated: null,
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
        state.authenticated = localStorage.getItem('ALEJAE-1908-TT')
        state.isUserLoggedIn = true
      } else {
        state.isUserLoggedIn = false
        state.authenticated = null
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
      key: 'ALEJAE-1908-TT',
      paths: [
        'token',
        'sessionToken',
        'user', 
        'isUserLoggedIn',
        'authenticated'
      ],
      // storage: {
      //   getItem: key => Cookies.get(key),
      //   setItem: (key, value) => Cookies.set(key, value, {expires: 1, secure: false}),
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
