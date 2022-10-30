import Vue from 'vue'
import VueRouter from 'vue-router'
import Test from '@/views/Test.vue'
import Tabtracker from '@/views/Tabtracker.vue'
import TabtrackerRegister from '@/views/TabtrackerRegister.vue'
import TabtrackerLogin from '@/views/TabtrackerLogin.vue'
import Songs from '@/views/Songs.vue'
import CreateSong from '@/components/Songs/CreateSong.vue'
import ViewSong from '@/components/Songs/ViewSong.vue'
import SongEdit from '@/components/Songs/EditSong.vue'
import Dashboard from '@/views/Dashboard.vue'
import Landing from '@/views/Landing.vue'
import store from '@/store/store.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'landing',
    component: Landing
  },
  {
    path: '/tabtracker',
    name: 'tabtracker',
    component: Tabtracker,
  },
  {
    path: '/tabtrackerregister',
    name: 'tabtrackerregister',
    component: TabtrackerRegister,
    meta: {requiresGuest: true}
  },
  {
    path: '/tabtrackerlogin',
    name: 'tabtrackerlogin',
    component: TabtrackerLogin,
    meta: {requiresGuest: true}
  },
  {
    path: '/songs',
    name: 'songs',
    component: Songs,
    meta: {requiresAuth: true}
  },
  {
    path: '/songs/create',
    name: 'songs-create',
    component: CreateSong
  },
  {
    path: '/songs/:songId',
    name: 'view-song',
    component: ViewSong
  },
  {
    path: '/songs/:songId/edit',
    name: 'song-edit',
    component: SongEdit,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {requiresAuth: true}
  },
  {
    path: '/test',
    name: 'test',
    component: Test,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedin = store.state.isUserLoggedIn
  
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if(!isLoggedin) {
      next('tabtrackerlogin')
    } else {
      next()
    }
  } else if (to.matched.some(route => route.meta.requiresGuest) && isLoggedin) {
    next('dashboard')
  } else {
    next()
  }
})

export default router
