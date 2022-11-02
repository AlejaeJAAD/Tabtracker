<template>
    <div class="bgColor">
        <h1>Ruta protegida</h1>
        <h3>Dashboard</h3>
        <hr>
        <br>
        <div class="bgUsers white--text">
            <h3>Hola</h3>
            <div class="bgAnother white--text">
                <h3>Another color</h3>
            </div>
        </div>
        <div class="white--text" v-for="user in getUserInfo" :key=user._id>
            Bienvenido {{user.fullName}}
            <v-btn @click="cerrarSesion">Cerrar sesion</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        mounted () {
            this.$store.dispatch('getRefreshToken')
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
            }
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