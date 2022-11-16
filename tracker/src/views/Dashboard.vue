<template>
    <v-card 
        class="mx-auto overflow-hidden"
        height="100vh">
        <v-app-bar
            color="dark">
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title>Dashboard</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip v-if="!$vuetify.theme.dark" bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" color="white" small fab @click="darkMode">
                        <v-icon class="mr-1">mdi-moon-waxing-crescent</v-icon>
                    </v-btn>
                </template>
                <span>Dark Mode Off</span>
            </v-tooltip>
            
            <v-tooltip v-else bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" color="white" outlined small fab @click="darkMode">
                        <v-icon class="mr-1">mdi-white-balance-sunny</v-icon>
                    </v-btn>
                </template>
                <span>Dark Mode On</span>
            </v-tooltip>
        </v-app-bar>

        <v-navigation-drawer
            v-model="drawer"
            absolute
            temporary
        >
            <template v-slot:prepend>
            <v-list-item two-line class="px-2">
                <v-list-item-avatar color="grey">
                <v-img :src="image" />
                </v-list-item-avatar>

                <v-list-item-content>
                <v-list-item-title v-text="name"></v-list-item-title>
                <v-list-item-subtitle>Logueado</v-list-item-subtitle>
                </v-list-item-content>
                <v-btn icon style="color: black" @click.stop="drawer = !drawer">
                <v-icon size="30" v-if="drawer">mdi-chevron-left</v-icon>
                </v-btn>
            </v-list-item>
            </template>
            <v-divider></v-divider>

            <v-list nav shaped dense>
            <v-list-item-group>
                <v-list-item @mouseenter="item.hovered = true" color="black" v-for="item in items" :key="item.title" :to="item.to" class="item">
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
            </v-list>
            <template v-slot:append>
            <div class="pa-2">
                <v-btn color="black" block outlined @click="cerrarSesion">Logout<v-icon>mdi-logout</v-icon> </v-btn>
            </div>
            </template>
        </v-navigation-drawer>

        <v-row>
            <v-col cols="12">
                <v-container>
                    {{getUserInfo.user.firstName}}
                </v-container>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    export default {
        data() {
            return {
                drawer: false,
                group: null,
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.$store.dispatch('getRefreshToken')
            })
        },
        watch: {
            getToken(token) {
                this.$store.dispatch('getUserInfo')
            }
        },
        computed: {
            getToken() {
                return this.$store.state.refToken
            },
            getUserInfo() {
                return this.$store.state.userInfo
            },
            items() {
                const items = [
                    {
                        title: "Dashboard",
                        icon: "mdi-rss",
                        to: "/dashboard",
                        hovered: false
                    },
                    {
                        title: "Account",
                        icon: "mdi-account",
                        to: "/account",
                        hovered: false
                    },
                    {
                        title: "Chat rooms",
                        icon: "mdi-chat",
                        to: "/room-list",
                        hovered: false
                    }
                ]
                return items;
            },
            name() {
                const usrInfo = this.getUserInfo
                const fName = usrInfo.user.firstName || "";
                const lName = usrInfo.user.lastName || "";
                return `${fName.split(" ")[0]} ${lName.split(" ")[0]}`;
            },
            image() {
                const usrInfo = this.getUserInfo
                const image = usrInfo.user.fileURL
                return image
            }
        },
        methods: {
            darkMode() {
                this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            },
            async cerrarSesion() {
                try {
                    const res = await fetch('http://localhost:3001/logout', {
                        method: 'GET',
                        credentials: "include",
                    });
                    this.$store.dispatch('setLogout')
                    this.$router.push('/')
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.bgColor{
    background-color: #0f0f0f
}
.bgUsers {
    margin: 2rem;
    background-color: #282828
}
.bgAnother {
    background-color: #212121
}
</style>