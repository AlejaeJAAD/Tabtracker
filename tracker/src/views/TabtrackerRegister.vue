<template>
    <div>
        <Nav :color="color" style="margin-top: 2rem" />
        <div>
            <v-row align="center" justify="center" no-gutters>
                <v-col cols='10' lg='6' md='10' sm='10'>
                    <panel title="Register" color="rgb(22, 33, 62)">
                        <v-card style="padding: 2rem" flat>
                            <form
                                name="tab-tracker-form"
                                autocomplete="off"
                            >
                            <br>
                            <v-file-input
                                show-size
                                color="#e2640f"
                                v-model="myFile"
                                outlined
                                accept="image/png, image/jpeg"
                                label="Image input"
                                prepend-icon="mdi-image"
                                @change="fileInput"
                                :disabled="processing"
                            >
                            <template v-slot:selection="{ text }">
                                <v-chip
                                color="#e2640f"
                                label
                                small
                                >
                                {{ text }}
                                </v-chip>
                            </template>
                                <template v-slot:append-outer>
                                <v-progress-circular
                                    v-if="processing"
                                    color="grey"
                                    indeterminate
                                    small
                                />
                                </template>
                            </v-file-input>
                            <v-row justify="center" align="center">
                                <v-col cols="10">
                                <v-img :src="user.fileURL" contain v-if="user.fileURL" max-height="750"></v-img>
                                </v-col>
                            </v-row>
                            <v-text-field
                                label="First Name"
                                v-model="user.fullName"
                                required
                            ></v-text-field>
                            <br>
                            <v-text-field
                                label="Email"
                                v-model="user.email"
                                required
                            ></v-text-field>
                            <br>
                            <v-text-field
                                label="Password"
                                required
                                type="password"
                                v-model="user.password"
                                autocomplete="new-password"
                            ></v-text-field>
                            <br>
                            <v-text-field
                                label="Role"
                                v-model="user.role"
                                required
                            ></v-text-field>
                            </form>
                            <br>
                            <v-alert v-if='error'
                                border="right"
                                icon="$mdiVuetify"
                                type="error"
                                v-html="error"
                            >
                            </v-alert>
                            <br>
                            <v-btn
                            color="rgb(22, 33, 62)"
                            class="white--text"
                            @click="register">
                            Register
                            </v-btn>
                        </v-card>
                    </panel>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
    import Nav from '../components/Global/Nav.vue'
    import Panel from '@/components/Songs/Panel.vue'
    import AuthenticationService from '@/services/AuthenticationService'
    import {uploadFile} from '../services/firebase'
    export default {
        components: { Nav, Panel },
        data() {
            return {
                color: 'rgb(233, 69, 96)',
                user: {
                    fullName: '',
                    email: '',
                    password: '',
                    role: '',
                    fileURL: ''
                },
                myFile: null,
                processing: false,
                containsImage: false,
                upload: false,
                error: null
            }
        },
        watch: {
            email(value) {
                console.log('Email has changed', value)
            }
        },
        methods: {
            async register () {
                this.uploadImage(this.myFile)
                try {
                    console.log(this.user)
                    const response = await AuthenticationService.register(this.user)
                    console.log(response)

                    this.$router.push({
                    name: 'tabtrackerlogin'
                    })
                } catch (error) {
                    this.error = error.response.data.error
                }
            },
            fileInput(file) {
                if(file != null) {
                    this.containsImage = true
                    this.user.fileURL = URL.createObjectURL(file)
                } else {
                    this.user.fileURL = null
                    this.containsImage = false
                }
            },
            async uploadImage(file) {
                this.processing = true
                try {
                    const imageURL = await uploadFile(file)
                    if(imageURL) {
                        this.processing = false
                        this.user.fileURL = imageURL.fileURL
                        this.message = imageURL.message
                        this.myFile = null
                        setTimeout(() => {
                        this.message = ''
                        }, 1000);
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    this.processing = false;
                }
            },
        },
        // mounted () {
        //     setTimeout(() => {
        //         this.email = 'exampleEmail@email.com'
        //     }, 2000);
        // },
    }
</script>

<style lang="scss" scoped>
.backgroundColorTest {
    color: rgb(22, 33, 62);
    color: rgb(233, 69, 96);
}
</style>