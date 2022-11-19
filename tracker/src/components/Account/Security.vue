<template>
    <v-row style="margin: 1rem">
        <v-card style="padding: 10px" elevation="3">
            <v-row>
                <v-col cols="12">
                    <v-text-field
                        label="Email"
                        solo
                        readonly
                        v-model="user.email"
                        append-icon="mdi-email"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-chip>
                        Your current password is not visible for security reasons
                    </v-chip>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        label="Old Password"
                        solo
                        v-model="oldPassword"
                        append-icon="mdi-password"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        label="New Password"
                        solo
                        v-model="newPassword"
                        append-icon="mdi-password"
                    >
                    </v-text-field>
                </v-col>
                <v-col v-if="showError">
                    <v-alert>
                        {{error}}
                    </v-alert>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" outlined small @click="actualizePassword">Change password</v-btn>
                    </v-card-actions>
                    <v-dialog v-model="dialog" max-width="290">
                        <v-card>
                        <v-card-title class="text-h5">
                            <v-icon>mdi-alert-circle</v-icon>
                        </v-card-title>
                        <v-card-text>
                            La contraseña ha sido actualizada.
                        </v-card-text>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-card>
    </v-row>
</template>

<script>
    export default {
        props: ["userData"],
        data() {
            return {
                error: '',
                showError: false,
                user: '',
                editable: false,
                oldPassword: '',
                newPassword: '',
                dialog: false,
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.user = this.userData.user
            })
        },
        methods: {
            async actualizePassword() {
                this.dialog = true
                try {
                    const data = {
                        email: this.user.email,
                        password: this.oldPassword,
                        newPassword: this.newPassword
                    }

                    const resToken = await fetch('http://localhost:3001/refresh-token', {
                    method: 'GET',
                    credentials: "include"
                    })

                    const {token} = await resToken.json()

                    await fetch('http://localhost:3001/new-password', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: "Bearer " + token,
                        },
                        credentials: 'include',
                        body: JSON.stringify(data)
                    })

                    setTimeout(() => {
                        this.$router.push({
                            name: 'dashboard'
                        })
                    }, 1500);
                } catch (error) {
                    this.error = error
                    this.showError = true
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>