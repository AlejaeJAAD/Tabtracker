import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'
const ls = new SecureLS({isCompression: false})

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    refToken: null,
    isUserLoggedIn: false,
    userInfo: []
  },
  getters: {

  },
  mutations: {
    setSecure (state) {
      state.isUserLoggedIn = true
    },
    setLogout (state) {
      state.isUserLoggedIn = false
    },
    setRefToken (state, payload) {
      state.refToken = payload.token
    },
    setUserInfo (state, payload) {
      state.userInfo = payload
    }
  },
  actions: {
    setSecure ({commit}) {
      commit('setSecure')
    },
    setLogout ({commit}) {
      commit('setLogout')
    },
    async getRefreshToken ({commit}) {
      const resToken = await fetch('http://localhost:3001/refresh-token', {
        method: 'GET',
        credentials: "include"
      })

      const destructuredData = await resToken.json()
      commit('setRefToken', destructuredData)
    },
    async getUserInfo ({commit}) {
      const res = await fetch('http://localhost:3001/dashboard', {
        method: 'GET',
        headers: {
            'Content-Type': "application/json",
            Authorization: "Bearer " + this.state.refToken,
        },
      })

      const destructuredData = await res.json();
      commit('setUserInfo', destructuredData)
      
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      paths: [
        'isUserLoggedIn',
      ],
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key)
      }
    })
  ]
})
