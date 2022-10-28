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
        </div>
    </div>
</template>

<script>
    import DashboardService from '@/services/DashboardService'
    export default {
        data() {
            return {
                token: '',
                data: '',
                user: ''
            }
        },
        created() {
            this.token = this.$store.state.token
            this.ruta()
        },
        async mounted () {
           //localStorage.getItem('TT-S-STORAGE');
            //localStorage.setItem('TT-S-STORAGE', 'Q')
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