import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/HelloWorld.vue'
import Test from '@/views/Test.vue'
import Tabtracker from '@/views/Tabtracker.vue'
import TabtrackerRegister from '@/views/TabtrackerRegister.vue'
import TabtrackerLogin from '@/views/TabtrackerLogin.vue'
import Songs from '@/views/Songs.vue'
import CreateSong from '@/components/Songs/CreateSong.vue'
import ViewSong from '@/components/Songs/ViewSong.vue'
import SongEdit from '@/components/Songs/EditSong.vue'
import Landing from '@/views/Landing.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/tabtracker',
    name: 'tabtracker',
    component: Tabtracker,
  },
  {
    path: '/tabtrackerregister',
    name: 'tabtrackerregister',
    component: TabtrackerRegister
  },
  {
    path: '/tabtrackerlogin',
    name: 'tabtrackerlogin',
    component: TabtrackerLogin
  },
  {
    path: '/songs',
    name: 'songs',
    component: Songs
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
    path: '/test',
    name: 'test',
    component: Test,
  },
  {
    path: '/landing',
    name: 'landing',
    component: Landing,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
