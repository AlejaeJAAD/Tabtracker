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
    meta: {
      requiresGuest: true
    },
  },
  {
    path: '/tabtrackerlogin',
    name: 'tabtrackerlogin',
    component: TabtrackerLogin,
    meta: {
      requiresGuest: true
    },
  },
  {
    path: '/songs',
    name: 'songs',
    component: Songs,
    meta: {requireAuth: true}
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
    meta: {requireAuth: true}
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
  const token = store.state.token
  const isLoggedin = store.state.isUserLoggedIn
  
  const rutaProtegida = to.matched.some(record => record.meta.requireAuth);
  const requiresGuest = to.matched.some((x) => x.meta.requiresGuest);

  if(rutaProtegida && token === null){
    // ruta protegida es true
    // token es nulo true, por ende redirigimos al inicio
    next({name: 'landing'})
  } else if (requiresGuest && isLoggedin) {
    next({name: 'songs'});
  } else{
    // En caso contrario sigue...
    next()
  }
})

export default router
