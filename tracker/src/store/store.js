import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'
const ls = new SecureLS({isCompression: false})

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    isUserLoggedIn: false,
  },
  getters: {

  },
  mutations: {
    setSecure (state) {
      state.isUserLoggedIn = true
    },
    setLogout (state) {
      state.isUserLoggedIn = false
    }
  },
  actions: {
    setSecure ({commit}) {
      commit('setSecure')
    },
    setLogout ({commit}) {
      commit('setLogout')
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
