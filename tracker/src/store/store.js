import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    //isLoggedIn: !!localStorage.getItem(x_jwt_string)
  },
  getters: {
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
    }
  },
  actions: {
    setToken ({commit}, token) {
      console.log(token)
      //console.log(state.isLoggedIn)
      commit('setToken', token)
    },
    setUser ({commit}, user) {
      console.log(user)
      commit('setUser', user)
    }
  },
  modules: {
  },
  plugins: [createPersistedState({
    paths: [
      "home", 
      "tabtracker", 
      "tabtrackerregister", 
      "tabtrackerregister", 
      "songs",
      "songs-create",
      "view-song",
      "song-edit",
      "test",
      "landing",
    ]
  })],
})
