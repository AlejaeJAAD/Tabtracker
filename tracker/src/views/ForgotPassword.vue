<template>
    <div>
        <v-card>
            <v-card-title>This is the forgot password page</v-card-title>
            <v-btn color="success" @click="confirm">Restore password</v-btn>
        </v-card>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                token: ''
            }
        },
        created() {
            this.token = this.$route.params.token
        },
        methods: {
            async confirm() {
                try {
                    this.$router.push({ name: "ForgotPasswordConfirm", params: { token: this.token } });
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>