<template>
    <div>
        <Nav :color="color" style="margin-top: 2rem" />
        <div>
            <v-row align="center" justify="center" no-gutters>
                <v-col cols='10' lg='6' md='10' sm='10'>
                    <panel title="Login" color="rgb(22, 33, 62)">
                        <v-card style='padding: 2rem' flat>
                            <form>
                            <br>
                            <v-text-field
                                label="Email"
                                v-model="email"
                                required
                                outlined
                                append-icon="mdi-email"
                            ></v-text-field>
                            <br>
                            <v-text-field
                                label="Password"
                                required
                                type="password"
                                v-model="password"
                                outlined
                                append-icon="mdi-form-textbox-password"
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
                            @click="login">
                            Login
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
        methods: {
            async login () {
                try {
                    const data = {
                        email: this.email,
                        password: this.password
                    }

                    // const loginData = 
                    await fetch('http://localhost:3001/login', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify(data)
                    })
                    this.$store.dispatch('setSecure', true)

                    this.$router.push({
                    name: 'songs'
                    })
                } catch (error) {
                    this.error = error
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
.backgroundColorTest {
    color: rgb(22, 33, 62);
    color: rgb(233, 69, 96);
}
</style>