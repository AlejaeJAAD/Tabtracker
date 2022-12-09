<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-text-field
                    solo
                    label="Email"
                    v-model="credentials.email"
                >
                </v-text-field>
            </v-col>

            <v-col cols="12">
                <v-text-field
                    solo
                    label="New Password"
                    v-model="credentials.newPassword"
                >
                </v-text-field>
            </v-col>

            <v-col cols="12">
                <v-text-field
                    solo
                    label="Confirm Password"
                    v-model="credentials.confirmPassword"
                >
                </v-text-field>
            </v-col>

            <v-col>
                <v-btn color="success" @click="sendInfo">Reset password</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                token: '',
                credentials: {}
            }
        },
        created() {
            this.token = this.$route.params.token
        },
        methods: {
            async sendInfo() {
                console.log(this.token)
                const res = await fetch('http://localhost:3001/confirm-recover-password-email', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'forgot-password-token': this.token
                    },
                    body: JSON.stringify(this.credentials)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>