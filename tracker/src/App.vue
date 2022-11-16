<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import SocketioService from './services/SocketioService.js';
export default {
  name: 'App',
  data() {
    return {
    }
  },
  created() {
    console.log('App vue')
    // SocketioService.setupSocketConnection();
  },
  beforeUnmount() {
    SocketioService.disconnect();
  }
}
</script>

<style lang="scss" scoped>
</style>