import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import Vuetify from 'vuetify'
import { sync } from 'vuex-router-sync'
import vuetify from './plugins/vuetify'
import VueYouTubeEmbed from 'vue-youtube-embed'
import VueCookies from 'vue-cookies'
import Axios from "axios";

Vue.config.productionTip = false

Axios.defaults.baseURL = "http://localhost:3001";

Vue.use(Vuetify)
Vue.use(VueYouTubeEmbed)
Vue.use(VueCookies);

sync(store, router)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
