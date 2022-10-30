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
        <div class="white--text">
            Bienvenido {{user.fullName}}
            <v-btn @click="cerrarSesion">Cerrar sesion</v-btn>
        </div>
    </div>
</template>

<script>
    import DashboardService from '@/services/DashboardService'
    export default {
        data() {
            return {
                data: '',
                user: ''
            }
        },
        created() {
            this.ruta()
        },
        async mounted () {
        },
        methods: {
            async ruta() {
                try {
                    const resToken = await fetch('http://localhost:3001/refresh-token', {
                        method: 'GET',
                        credentials: "include"
                    })

                    const {token} = await resToken.json()

                    const res = await fetch('http://localhost:3001/dashboard', {
                        method: 'GET',
                        headers: {
                            'Content-Type': "application/json",
                            Authorization: "Bearer " + token,
                        },
                    })

                    const data = await res.json();
                    this.user = data.user

                } catch (err) {
                    console.log(err)
                }
            },
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