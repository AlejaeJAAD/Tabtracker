import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'
const ls = new SecureLS({isCompression: false})
import Cookies from 'js-cookie';


Vue.use(Vuex)

//this.$cookies.get("refreshToken");

// const cookieName = 'TT-S';
// const storageKey = 'TT-S-STORAGE';
// const encryptionToken = Cookie.get(cookieName) || uuidv4();

export default new Vuex.Store({
  strict: true,
  state: {
    isUserLoggedIn: false,
  },
  getters: {

  },
  mutations: {
    setSecure (state, val) {
      if (val) {
        state.isUserLoggedIn = true
      } else {
        state.isUserLoggedIn = false
      }
    },
  },
  actions: {
    setSecure ({commit}, val) {
      commit('setSecure', val)
    },
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      paths: [
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
