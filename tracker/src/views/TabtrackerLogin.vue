<template>
    <v-container>
        <v-row justify="center" no-gutters style="margin: 4rem 0 1rem 0">
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
    </v-container>
</template>

<script>
    import Panel from '@/components/Songs/Panel.vue'
    export default {
        components: { Panel },
        data() {
            return {
                color: 'rgb(233, 69, 96)',
                email: '',
                password: '',
                error: null,
            }
        },
        methods: {
            async login () {
                try {
                    const data = {
                        email: this.email,
                        password: this.password
                    }

                    const loginData = await fetch('http://localhost:3001/login', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify(data)
                    })
                    
                    const isLogged = await loginData.json()
                    if(isLogged.error) {
                        this.error = 'The credentials are wrong, try again MF.'
                        this.email = ''
                        this.password = ''
                    } else {
                        this.$store.dispatch('setSecure')
                        this.$router.push({
                            name: 'dashboard'
                        })
                    }
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