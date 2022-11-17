<template>
    <div class="cont" width="95%" elevation="3">
      <v-row style="margin: 0">
        <v-col cols="12" md="3">
          <v-card elevation="3" height="100%">
            <v-card-text style="font-weight: bold" class="option" :class="{ activa: opcion === 1 }" @click="opcion = 1"
              >Informacion Personal
              <v-spacer></v-spacer>
              <v-icon v-if="opcion === 1" color="primary" size="50">mdi-chevron-right</v-icon>
            </v-card-text>
  
            <v-divider></v-divider>
            <v-card-text style="font-weight: bold" class="option" :class="{ activa: opcion === 2 }" @click="opcion = 2"
              >Seguridad
              <v-spacer></v-spacer>
              <v-icon v-if="opcion === 2" color="primary" size="50">mdi-chevron-right</v-icon>
            </v-card-text>
            <v-divider></v-divider>
          </v-card>
        </v-col>
        <v-col cols="12" md="9">
          <Personal v-if="opcion === 1" :userData="user" />
          <Security v-if="opcion === 2" />
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script>
  import Personal from "@/components/Account/Personal";
  import Security from "@/components/Account/Security";
  export default {
    name: "Cuenta",
    components: { Security, Personal },
    data() {
      return {
        opcion: 1
      };
    },
    mounted () {
        this.$nextTick(() => {
            this.$store.dispatch('getRefreshToken')
        })
    },
    watch: {
        getToken(token) {
            this.$store.dispatch('getUserInfo')
        }
    },
    computed: {
      user() {
        const user = this.$store.state.userInfo;
        return user || {};
      },
      getToken() {
        return this.$store.state.refToken
      },
    }
  };
  </script>
  
  <style scoped>
  .cont {
    margin: 10px auto;
  }
  .option:hover {
    background-color: lightgrey;
    cursor: pointer;
    font-weight: bolder;
  }
  .activa {
    background-color: lightgrey;
    cursor: pointer;
    font-weight: bolder;
  }
  </style>