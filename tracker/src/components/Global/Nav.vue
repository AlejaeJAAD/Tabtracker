<template>
    <div class="bg">
      <v-app-bar :color="color" tile app clipped-left elevation="3" dense>
        <v-btn v-if="tabtrackertab" text color="white" @click="$router.push('/tabtracker')">Tabtracker</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="!$store.state.isUserLoggedIn" text color="white" @click="$router.push('/tabtrackerregister')">Register</v-btn>
        <v-btn v-if="!$store.state.isUserLoggedIn" text color="white" @click="$router.push('/tabtrackerlogin')">Login</v-btn>
        <v-btn v-if="$store.state.isUserLoggedIn && songstab" text color="white" @click="$router.push('/songs')">Songs</v-btn>
        <v-btn v-if="$store.state.isUserLoggedIn" text color="white" @click="logout">Logout</v-btn>
      </v-app-bar>
    </div>
  </template>
  
  <script>
    export default {
      props: ['color'],
      name: 'Nav',
      data() {
        return {
          tabtrackertab: '',
          songstab: true,
          drawer: false,
          searchQuery: '',
          cancelQueryBtn: false,
          searchBox: false,
          userLoggedIn: this.$store.state.isUserLoggedIn,
        };
      },
      computed: {
        items() {
          const items = [
            {
              title: 'Tabtracker',
              icon: 'mdi-vector-intersection',
              to: '/tabtracker',
              type: 'tabtracker',
              hovered: false,
            }
          ];
          return items;
        },
        currentRouteName() {
          return this.$route.name;
        }
      },
      mounted() {
        if (this.$route.query.s) {
          this.cancelQueryBtn = true;
        }
        this.$nextTick(() => {});

        if(this.currentRouteName == 'tabtracker') {
          this.tabtrackertab = false
        } else {
          this.tabtrackertab = true
        }

        if(this.currentRouteName == 'songs') {
          this.songstab = false
        } else {
          this.songstab = true
        }

        // if(this.currentRouteName == 'tabtracker') {
        //     this.registerTab = true;
        //     this.loginTab = true;
        // }

        // if(this.currentRouteName == 'tabtracker') {
        //   this.tabtrackertab = false;
        // }
      },
      methods: {
        logout() {
          this.$store.dispatch('setSecure', null)
          this.$router.push('/')
        }
      },
    };
  </script>
  
  <style scoped>
    .bg {
      margin-top: -0.5rem;
      font-family: Bahnschrift SemiBold;
    }
  </style>
  