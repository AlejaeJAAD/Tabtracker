<template>
    <div>
        Landing
        <v-btn @click="$router.push('/tabtrackerlogin')">
            Log In
        </v-btn>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        created(){
            if(this.$store.state.isUserLoggedIn) {
              this.$router.replace('/dashboard')
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>