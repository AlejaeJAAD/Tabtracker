<template>
    <v-card 
        class="mx-auto overflow-hidden"
        height="100vh">
        <Nav />
        <v-row style="margin-top: 2.5rem">
            <v-col v-if="loadedData">
                <v-card>
                    <v-card-title>
                        Loading the data...
                    </v-card-title>
                </v-card>
            </v-col>
            <v-col v-if="privateInfo">
                <v-card>
                    <v-card-title>Protected content</v-card-title>
                    <v-container>
                        Welcome back {{userData.firstName}}
                    </v-container>
                </v-card>
            </v-col>
            <v-col v-if="publicInfo">
                <v-card>
                    <v-card-title>Public content</v-card-title>
                    <v-container>
                        Welcome back {{userData.firstName}}
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import Nav from '../components/Global/Nav.vue'
    export default {
        components: {
            Nav
        },
        data() {
            return {
                privateInfo: false,
                publicInfo: false,
                loadedData: true,
                userData: ''
            }
        },
        mounted () {
            this.$store.dispatch('getRefreshToken')
            setTimeout(() => {
                this.loadedData = false;
                this.userData = this.getUserInfo.user
                console.log(this.userData)
                if(this.userData.role == 'admin') {
                    this.privateInfo = true
                } else {
                    this.publicInfo = true
                }
            }, 1000);
        },
        watch: {
            getToken(token) {
                this.$store.dispatch('getUserInfo')
            }
        },
        computed: {
            getToken() {
                return this.$store.state.refToken
            },
            getUserInfo() {
                return this.$store.state.userInfo
            },
        },
        methods: {
            async cerrarSesion() {
                try {
                    const res = await fetch('http://localhost:3001/logout', {
                        method: 'GET',
                        credentials: "include",
                    });
                    this.$store.dispatch('setLogout')
                    this.$router.push('/')
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.bgColor{
    background-color: #0f0f0f
}
.bgUsers {
    margin: 2rem;
    background-color: #282828
}
.bgAnother {
    background-color: #212121
}
</style>