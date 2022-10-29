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
    isUserLoggedIn: false,
  },
  getters: {
  },
  mutations: {
    setSecure (state, token) {
      state.token = token
      if (token) {
        state.isUserLoggedIn = true
      } else {
        state.token = null
        state.isUserLoggedIn = false
      }
    },
    clearAuthData(state) {
      state.token = null
      state.isUserLoggedIn = null
    },
  },
  actions: {
    setSecure ({commit}, token) {
      commit('setSecure', token)
    },
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      key: 'TT-S-1908',
      paths: [
        'token',
        'isUserLoggedIn',
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
  //plugins: [createPersistedState()],
})
