<template>
    <v-row>
        <v-col cols="10">
            <v-card class="mx-auto" max-width="400" tile>
                <v-list :three-line="threeLine">
                    <v-subheader>Chat</v-subheader>
                    <v-list-item-group color="primary" v-chat-scroll>
                        <v-list-item
                            class="chat"
                            v-for="(item, i) in chats"
                            :key="i"
                            :inactive="inactive"
                        >
                            <v-list-item-avatar class="left clearfix" v-if="item[0].nickName === nickName">
                                <v-img :src="item[1].fileURL"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content class="chat-body clearfix">
                                <strong class="primary-font">{{ item[0].nickName }}</strong> <small class="pull-right text-muted">
                                <span class="glyphicon glyphicon-time"></span>{{ item[0].created_date }}</small>
                                <v-list-item-subtitle v-if="threeLine" v-html="item[0].message"></v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                    <ul v-if="errors && errors.length">
                        <li v-for="error of errors" :key="error">
                        {{error.message}}
                        </li>
                    </ul>
                    <v-form @submit="onSubmit" class="chat-form">
                        <v-container>
                            <v-row>
                                <v-col>
                                    <v-text-field v-model.trim="chat.message"></v-text-field>
                                    <v-btn color="primary" outlined type="submit">
                                        Send message
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-list>
            </v-card>
        </v-col>
        <v-col cols="2">
            <v-btn color="error" outlined @click="logout">Logout</v-btn>
        </v-col>
    </v-row>
</template>

<script>
    import Axios from 'axios'
    import Vue from 'vue'
    import VueChatScroll from 'vue-chat-scroll'
    Vue.use(VueChatScroll)
    import { io } from 'socket.io-client';
    export default {
        data () {
            return {
                inactive: false,
                threeLine: true,
                chats: [],
                errors: [],
                chat: {},
                socket: io('http://localhost:3001'),
                userData: '',
                nickName: this.$route.params.nickName
            }
        },
        created () {
            Axios.get(`http://localhost:3001/chats/` + this.$route.params.id)
            .then(res => {
                this.chats = res.data
            })
            .catch(e => {
                this.errors.push(e)
            })

            this.socket.on('new-message', function (data) {
                console.log(data)
                if(data.message.room === this.$route.params.id) {
                    console.log(this.chats, data.message)
                    const newChat = [
                        {
                            created_date: data.message.created_date,
                            message: data.message.message,
                            nickName: data.message.nickName,
                            user: data.message.user,
                            _id: data.message._id,
                        },
                        this.userData
                    ]
                    console.log(newChat)
                this.chats.push(newChat)
                }
            }.bind(this))
        },
        methods: {
            logout () {
                this.chat.room = this.$route.params.id
                this.chat.message = this.userData.nickName + ' left this room'
                Axios.post(`http://localhost:3001/chats`, this.chat)
                .then(response => {
                    this.chat.message = ''
                    this.socket.emit('save-message', 
                        { 
                            room: this.$route.params.id,
                            nickName: this.userData.nickName,
                            message: this.userData.nickName + ' left this room', 
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
                this.chat.nickName = this.userData.nickName
                this.chat.user = this.userData._id

                Axios.post(`http://localhost:3001/chats`, this.chat)
                .then(response => {
                    this.socket.emit('save-message', response.data.newChat)
                    this.chat.message = ''
                })
                .catch(e => {
                    this.errors.push(e)
                })
            }
        },
        mounted () {
            this.$store.dispatch('getRefreshToken')
            setTimeout(() => {
                this.userData = this.getUserInfo.user
            }, 1000);
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
        },
    }
</script>

<style lang="scss" scoped>
  .chat .left .chat-body {
    text-align: left;
    margin-left: 100px;
  }

  .chat .right .chat-body {
    text-align: right;
    margin-right: 100px;
  }

  .chat .chat-body p {
    margin: 0;
    color: #777777;
  }

  .panel-body {
    overflow-y: scroll;
    height: 350px;
  }

  .chat-form {
    margin: 20px auto;
    width: 80%;
  }
</style>