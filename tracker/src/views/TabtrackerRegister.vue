<template>
    <div>
        <Nav :color="color" style="margin-top: 2rem" />
        <div>
            <v-row align="center" justify="center" no-gutters>
                <v-col cols='10' lg='6' md='10' sm='10'>
                    <panel title="Register" color="rgb(22, 33, 62)">
                        <v-card style='padding: 2rem' flat>
                            <form
                                name="tab-tracker-form"
                                autocomplete="off"
                            >
                            <br>
                            <v-text-field
                                label="Email"
                                v-model="email"
                                required
                            ></v-text-field>
                            <br>
                            <v-text-field
                                label="Password"
                                required
                                type="password"
                                v-model="password"
                                autocomplete="new-password"
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
    export default {
        components: { Nav, Panel },
        data() {
            return {
                color: 'rgb(233, 69, 96)',
                email: '',
                password: '',
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
                try {
                    const response = await AuthenticationService.register({
                    email: this.email,
                    password: this.password
                    })
                    const token = response.data.data.token
                    const user = response.data.data.user
                    console.log(response.data.data)
                    this.$store.dispatch('setToken', token)
                    this.$store.dispatch('setUser', user)
                    this.$router.push({
                    name: 'songs'
                    })
                } catch (error) {
                    this.error = error.response.data.error
                }
            }
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