<template>
    <div class="cont" width="95%" elevation="3">
      <Nav style="margin-top: -0.5rem"/>
      <v-row style="margin: 0">
        <v-col cols="12" md="3">
          <v-card elevation="3" height="100%">
            <v-card-text class="option" :class="{ activa: opcion === 1 }" @click="opcion = 1" :style="setColor()"
              >Informacion Personal
              <v-icon small v-if="opcion === 1" color="dark" size="50">mdi-chevron-right</v-icon>
            </v-card-text>
  
            <v-divider></v-divider>
            <v-card-text class="option" :class="{ activa: opcion === 2 }" @click="opcion = 2" :style="setColor()"
              >Seguridad
              <v-icon small v-if="opcion === 2" color="dark" size="50">mdi-chevron-right</v-icon>
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
  import Nav from '../components/Global/Nav.vue'
  import Personal from "@/components/Account/Personal";
  import Security from "@/components/Account/Security";
  export default {
    name: "Cuenta",
    components: { Nav, Security, Personal },
    data() {
      return {
        opcion: 1,
        hoverColor: '',
        clickedColor: '',
        textColor: '',
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
      setColor() {
        return () => {
          if(this.$vuetify.theme.dark) {
            this.hoverColor = 'white',
            this.clickedColor = 'orange'
          } else {
            this.hoverColor = 'black',
            this.clickedColor = 'grey'
          }
          return {
            '--color-hover': this.hoverColor,
            '--clickedColor': this.clickedColor
          }
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .cont {
    margin: 10px auto;
  }
  .option:hover {
    cursor: pointer;
    font-weight: bolder;
    color: var(--color-hover);
  }
  .activa {
    background-color: var(--clickedColor);
    cursor: pointer;
    font-weight: bolder;
  }
</style>