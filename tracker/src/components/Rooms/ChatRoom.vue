<template>
    <v-card
        class="mx-auto overflow-hidden"
        height="100vh">
        <Nav />
        <v-row no-gutters align="center" justify="center">
            <v-col cols="12" style="margin-bottom: 2px">
                <v-card elevation="5">
                    <v-card-title>JAAD</v-card-title>
                </v-card>
            </v-col>
            <v-col cols="10" class="pt-15" v-if="showChats">
                <v-card tile elevation="5"  class="mx-auto">
                    <v-list class="container" v-chat-scroll="{always: false, smooth: true}">
                        <v-subheader>Chat</v-subheader>
                        <v-row>
                            <v-col cols="6">
                                <v-list-item
                                    v-for="(item, i) in chats"
                                    :key="i"
                                    :class="{ activa: item[0].nickName === nickName, activo: item[0].nickName !== nickName }"
                                    :style="chatDesign()"
                                >
                                    <v-list-item-avatar>
                                        <v-img :src="item[1].fileURL"></v-img>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <strong>{{ item[0].nickName }}</strong>
                                            <small>
                                                {{ item[0].created_date }}
                                            </small>
                                        <v-list-item-subtitle class="text-wrap pb-2 pt-2 pl-2 pr-2" v-text="item[0].message"></v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <!-- :color="item[0].nickName === nickName ? 'deep-purple accent-4' : 'grey'" -->
                                <!-- <v-list-item-group>
                                    <v-row>
                                        <v-col cols="12">
                                        </v-col>
                                    </v-row>
                                </v-list-item-group> -->
                                <ul v-if="errors && errors.length">
                                    <li v-for="error of errors" :key="error">
                                    {{error.message}}
                                    </li>
                                </ul>
                            </v-col>
                        </v-row>
                        <v-form @submit="onSubmit" class="chat-form">
                            <v-container>
                                <v-row>
                                    <v-col cols="8">
                                        <v-text-field v-model="message"></v-text-field>
                                    </v-col>
                                    <v-col cols="1" v-if="notEmpty">
                                        <v-btn class="mx-2 btnActivo" fab type="submit" :style="messageDesign()">
                                            <v-icon>
                                                mdi-arrow-right
                                            </v-icon>
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="1" v-else>
                                        <v-btn class="mx-2 btnActivo" fab :style="messageDesign()">
                                            <v-icon>
                                                mdi-microphone
                                            </v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-list>
                </v-card>
            </v-col>
            <!-- <v-col cols="2">
                <v-btn color="error" outlined @click="logout">Logout</v-btn>
            </v-col> -->
            <v-col cols="12" style="margin-bottom: 2px" v-else>
                <v-card elevation="5">
                    Loading the chat
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import Axios from 'axios'
    import Nav from '@/components/Global/Nav.vue'
    import Vue from 'vue'
    import VueChatScroll from 'vue-chat-scroll'
    Vue.use(VueChatScroll)
    import { io } from 'socket.io-client';
    export default {
        components: {
            Nav
        },
        data () {
            return {
                chats: [],
                users: [],
                errors: [],
                chat: {},
                socket: io('http://localhost:3001'),
                user: '',
                nickName: this.$route.params.nickName,
                activo: '',
                activa: '',
                message: '',
                notEmpty: false,
                showChats: false,
                btnColor: ''
            }
        },
        async created () {
            Axios.get(`http://localhost:3001/chats/` + this.$route.params.id)
            .then(res => {
                this.chats = res.data
                if(this.chats) {
                    this.showChats = true
                }
            })
            .catch(e => {
                this.errors.push(e)
            })

            let newChat = {}
            this.socket.on('new-message', async function (data) {
                if(data.message.room === this.$route.params.id) {
                    newChat = {
                        created_date: data.message.created_date.toDateString(),
                        message: data.message.message,
                        nickName: data.message.nickName,
                        uid: data.message.uid,
                        _id: data.message._id,
                    }
                }
                const userData = await fetch('http://localhost:3001/getUserData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify(newChat)
                })
                const sender = await userData.json()
                this.chats.push([newChat, sender.user])
            }.bind(this))
                

        },
        methods: {
            logout () {
                this.chat.room = this.$route.params.id
                this.chat.message = this.$route.params.nickName + ' left this room'
                Axios.post(`http://localhost:3001/chats`, this.chat)
                .then(response => {
                    this.message = ''
                    this.socket.emit('save-message', 
                        { 
                            room: this.$route.params.id,
                            nickName: this.$route.params.nickName,
                            message: this.$route.params.nickName + ' left this room', 
                            created_date: new Date() 
                        });
                    this.$router.push({
                        name: 'RoomList',
                        params: { id: this.$route.params.id }
                    })
                })
                .catch(e => {
                    this.errors.push(e)
                })
            },
            onSubmit (evt) {
                evt.preventDefault()
                this.chat.room = this.$route.params.id
                this.chat.nickName = this.$route.params.nickName
                this.chat.uid = this.user._id
                this.chat.message = this.message

                Axios.post(`http://localhost:3001/chats`, this.chat)
                .then(response => {
                    this.socket.emit('save-message', response.data.newChat)
                    this.message = ''
                })
                .catch(e => {
                    this.errors.push(e)
                })
            }
        },
        async mounted () {
            const resToken = await fetch('http://localhost:3001/refresh-token', {
                    method: 'GET',
                    credentials: "include"
                })

            const {token} = await resToken.json()

            const res = await fetch('http://localhost:3001/userInfo', {
                method: 'GET',
                headers: {
                    'Content-Type': "application/json",
                    Authorization: "Bearer " + token,
                },
            })

            const userData = await res.json()
            this.user = userData.user


        },
        watch: {
            message(message){
                if(message === '') {
                    this.notEmpty = false
                } else {
                    this.notEmpty = true
                }
            }
        },
        computed: {
            chatDesign() {
                return () => {
                    if(this.$vuetify.theme.dark) {
                        this.activa = 'orange'
                        this.activo = 'purple'
                    } else {
                        this.activa = 'grey'
                        this.activo = 'green'
                    }
                    return {
                        '--activa': this.activa,
                        '--activo': this.activo
                    }
                }
            },
            messageDesign() {
                return () => {
                    if(this.$vuetify.theme.dark) {
                        this.btnColor = 'orange'
                    } else {
                        this.btnColor = 'grey'
                    }
                    return {
                        '--btnolor': this.btnColor
                    }
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
  .v-list{
    height: 63vh;
    overflow-y: auto
  }
  .activa {
    background-color: var(--activa);
    font-weight: bolder;
    text-align: right;
    border-radius: 5px;
    margin: 10px;
  }
  .activo {
    background-color: var(--activo);
    font-weight: bolder;
    text-align: right;
    border-radius: 10px;
    margin: 10px;
  }
  .btnActivo {
    color: var(--btnolor)
  }
</style>