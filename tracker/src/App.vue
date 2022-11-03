<template>
  <v-app class="backGround">
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
    }
  },
  created() {
    console.log('App vue')
  }
}
</script>

<style lang="scss" scoped>
.backGround {
 background-color: rgba(19,19,19,255);
 padding: 2rem;
}
</style>