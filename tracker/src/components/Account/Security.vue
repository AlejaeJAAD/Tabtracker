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
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show1 ? 'text' : 'password'"
                        hint="At least 6 characters"
                        class="input-group--focused text-green"
                        @click:append="show1 = !show1"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        label="New Password"
                        solo
                        v-model="newPassword"
                        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show2 ? 'text' : 'password'"
                        hint="At least 6 characters"
                        class="input-group--focused"
                        @click:append="show2 = !show2"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="6" offset-sm="6" offset-md="6" offset-lg="6">
                    <v-text-field
                        label="Confirm Password"
                        solo
                        v-model="confirmPassword"
                        :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show3 ? 'text' : 'password'"
                        hint="At least 6 characters"
                        class="input-group--focused"
                        @click:append="show3 = !show3"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12" v-if="progress">
                    <v-progress-circular
                        :size="70"
                        :width="7"
                        color="white"
                        indeterminate
                    ></v-progress-circular>
                </v-col>
                <v-col v-if="showError">
                    <v-alert color="error" outlined>
                        {{error}}
                    </v-alert>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" outlined small @click="updatePassword">Update password</v-btn>
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
                confirmPassword: '',
                dialog: false,
                progress: false,
                rules: {
                  required: value => !!value || 'This field is required',
                  min: v => v.length >= 6 || 'Min 6 characters',
                },
                show1: false,
                show2: false,
                show3: false,
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.user = this.userData.user
            })
        },
        methods: {
            async updatePassword() {
                try {
                    if(this.newPassword == this.confirmPassword) {
                        this.progress = true

                        const data = {
                            email: this.user.email,
                            password: this.oldPassword,
                            newPassword: this.newPassword
                        }

                        // const resToken = await fetch('http://localhost:3001/refresh-token', {
                        // method: 'GET',
                        // credentials: "include"
                        // })
    
                        // const {token} = await resToken.json()
    
                        // await fetch('http://localhost:3001/new-password', {
                        //     method: 'PUT',
                        //     headers: {
                        //         'Content-Type': 'application/json',
                        //         Authorization: "Bearer " + token,
                        //     },
                        //     credentials: 'include',
                        //     body: JSON.stringify(data)
                        // })
    
                        // this.dialog = true
    
                        // setTimeout(() => {
                        //     this.progress = false
                        //     this.$router.push({
                        //         name: 'dashboard'
                        //     })
                        // }, 1500)
                        console.log('entro')
                    } else if ((this.oldPassword || this.newPassword || this.confirmPassword) == '') {
                        this.error = 'Old Password cannot be empty, New Password cannot be empty, Confirm Password cannot be empty'
                        this.showError = true
                    } else if (this.newPassword != this.confirmPassword) {
                        this.error = 'New password and Confirm password are not the same, please try again.'
                        this.showError = true
                    }

                } catch (error) {
                    this.error = error
                    this.showError = true
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>