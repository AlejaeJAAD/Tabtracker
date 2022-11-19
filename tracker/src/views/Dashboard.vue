<template>
    <v-card 
        class="mx-auto overflow-hidden"
        height="100vh">
        <Nav />
        <v-row>
            <v-col cols="12">
                <v-container>
                    {{getUserInfo.user.firstName}}
                </v-container>
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
            }
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