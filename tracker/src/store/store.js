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
    userInfo: null,
    allSongs: null,
    queryData: ''
  },
  getters: {

  },
  mutations: {
    setSecure (state) {
      state.isUserLoggedIn = true
    },
    setLogout (state) {
      state.isUserLoggedIn = false
      state.refToken = null
      state.userInfo = null
    },
    setRefToken (state, payload) {
      state.refToken = payload.token
    },
    setUserInfo (state, payload) {
      state.userInfo = payload
    },
    setAllSongs (state, payload) {
      state.allSongs = payload
    },
    setQueryData (state, payload) {
      state.queryData = payload
    }
  },
  actions: {
    setSecure ({commit}) {
      commit('setSecure')
    },
    setLogout ({commit}) {
      commit('setLogout')
    },
    async getAllsongs ({commit}) {
      const resToken = await fetch('http://localhost:3001/getAllSongs', {
        method: 'GET',
        credentials: "include"
      })

      const destructuredData = await resToken.json()
      commit('setAllSongs', destructuredData)
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
      const res = await fetch('http://localhost:3001/userInfo', {
        method: 'GET',
        headers: {
            'Content-Type': "application/json",
            Authorization: "Bearer " + this.state.refToken,
        },
      })

      const destructuredData = await res.json();
      commit('setUserInfo', destructuredData)
    },
    async getQueryData ({commit}, query) {
      const res = await fetch(`http://localhost:3001/searchSong/${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': "application/json",
          Authorization: "Bearer " + this.state.refToken,
        }
      })

      const destructuredData = await res.json();
      if(destructuredData.length === 0) {
        commit('setQueryData', null)
      } else {
        commit('setQueryData', destructuredData)
      }
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      paths: [
        "refToken",
        "isUserLoggedIn",
        "userInfo",
      ],
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key)
      }
    })
  ]
})
