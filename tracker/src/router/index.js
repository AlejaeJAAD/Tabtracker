import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/store.js'

import Test from '@/views/Test.vue'

import Tabtracker from '@/views/Tabtracker.vue'
import TabtrackerRegister from '@/views/TabtrackerRegister.vue'
import TabtrackerLogin from '@/views/TabtrackerLogin.vue'

import Songs from '@/views/Songs.vue'
import CreateSong from '@/components/Songs/CreateSong.vue'
import ViewSong from '@/components/Songs/ViewSong.vue'
import SongEdit from '@/components/Songs/EditSong.vue'

import Account from '@/views/Account.vue'
import Dashboard from '@/views/Dashboard.vue'
import Landing from '@/views/Landing.vue'

import RoomList from '@/components/Rooms/RoomList'
import AddRoom from '@/components/Rooms/AddRoom'
import JoinRoom from '@/components/Rooms/JoinRoom'
import ChatRoom from '@/components/Rooms/ChatRoom'

import TutorialList from '@/components/Tutorials/TutorialsList'
import EditTutorial from '@/components/Tutorials/EditTutorial'
import AddTutorial from '@/components/Tutorials/AddTutorial'

import CustomerList from '@/components/Customers/CustomerList'
import EditCustomer from '@/components/Customers/EditCustomer'

import ForgotPasswordConfirm from '@/views/ForgotPasswordConfirm'
import ForgotPassword from '@/views/ForgotPassword'

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
    meta: 
      { 
        title: 'JAAD - Dashboard',
        requiresAuth: true
      }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta:
      {
        title: 'JAAD - Account',
        requiresAuth: true
      }
  },
  {
    path: '/room-list',
    name: 'RoomList',
    component: RoomList
  },
  {
    path: '/add-room',
    name: 'AddRoom',
    component: AddRoom
  },
  {
    path: '/join-room/:id',
    name: 'JoinRoom',
    component: JoinRoom
  },
  {
    path: '/chat-room/:id/:nickName',
    name: 'ChatRoom',
    component: ChatRoom
  },
  {
    path: '/test',
    name: 'test',
    component: Test,
  },
  {
    path: "/add-tutorial",
    name: "AddTutorial",
    component: AddTutorial
  },
  {
    path: '/tutorialList',
    name: 'TutorialList',
    component: TutorialList,
  },
  {
    path: "/tutorials/:id",
    name: "TutorialDetails",
    component: EditTutorial
  },
  {
    path: '/customerList',
    name: 'CustomerList',
    component: CustomerList,
  },
  {
    path: '/customers/:id',
    name: 'CustomerDetails',
    component: EditCustomer,
  },
  {
    path: '/forgot-password/confirm/:token',
    name: 'ForgotPasswordConfirm',
    component: ForgotPasswordConfirm
  },
  {
    path: '/forgot-password/:token',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedin = store.state.isUserLoggedIn
  const DEFAULT_TITLE = 'JAAD';

  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  })
  
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
