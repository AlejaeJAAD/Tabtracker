<template>
    <div>
        <h1>Ruta protegida</h1>
        <h3>Dashboard</h3>
        <hr>
        <br>
        <div v-for="(user, i) in this.users" :key="user._id">
            Usuario numero {{i+1}} - {{user.email}}
        </div>
    </div>
</template>

<script>
    import DashboardService from '@/services/DashboardService'
    export default {
        data() {
            return {
                token: '',
                users: '',
            }
        },
        created() {
            this.token = this.$store.state.token
            console.log(this.token)
            this.ruta()
        },
        async mounted () {
           //localStorage.getItem('TT-S-STORAGE');
            //localStorage.setItem('TT-S-STORAGE', 'Q')
        },
        methods: {
            async ruta() {
                try {
                    const res = await DashboardService.show({
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': this.token
                        }
                    })
                    this.users = await res.data
                    console.log(this.users)
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>