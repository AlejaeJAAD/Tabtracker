<template>
    <v-row>
        <v-col cols="6" align="center">
            <h2>
                Join Room
            </h2>
            <v-btn outlined color="success" @click="$router.push({
                    name: 'RoomList'
                })">
                (Room List)
            </v-btn>
            <validation-observer ref="observer"
                v-slot="{ invalid }">
                <v-form @submit.prevent="submit">
                    <validation-provider
                        v-slot="{ errors }"
                        name="Nick Name"
                        rules="required|max:15"
                    >
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-text-field
                                        disabled
                                        :counter="15"
                                        :error-messages="errors"
                                        v-model.trim="nickName"
                                        label="Nickname"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" align="center">
                                    <v-btn
                                        outlined
                                        color="primary"
                                        :disabled="invalid"
                                        @click="joinRoom()"
                                    >
                                        Join
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </validation-provider>
                </v-form>
            </validation-observer>
        </v-col>
    </v-row>
</template>


<script>
    import Axios from 'axios'
    import { required, max } from 'vee-validate/dist/rules'
    import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
    import { io } from 'socket.io-client';

    setInteractionMode('eager')

    extend('required', {
        ...required,
        message: '{_field_} can not be empty',
    })
    extend('max', {
        ...max,
        message: '{_field_} may not be greater than {length} characters',
    })
    export default {
        components: {
            ValidationProvider,
            ValidationObserver,
        },
        data () {
            return {
                chat: {},
                socket: io('http://localhost:3001'),
                nickName: '',
            }
        },
        methods: {
            submit () {
                this.$refs.observer.validate()
            },
            async joinRoom() {
                const resToken = await fetch('http://localhost:3001/refresh-token', {
                method: 'GET',
                credentials: "include"
                })

                const {token} = await resToken.json()

                this.chat.room = this.$route.params.id
                this.chat.message = 
                    this.nickName
                        + 
                    ' Joined the room'
                this.chat.nickName = this.nickName
                // Axios.post(`http://localhost:3001/chats`, this.chat)
                // .then(response => {
                //     this.socket.emit('save-message', 
                //         { 
                //             room: this.chat.room, 
                //             nickname: this.chat.nickname, 
                //             message: this.chat.nickname + 'Join this room', 
                //             created_date: new Date()
                //         });
                //     this.$router.push({
                //         name: 'ChatRoom',
                //         params: {
                //             id: this.$route.params.id,
                //             nickname: response.data.nickname
                //         }
                //     })
                // })
                // .catch(e => {
                //     this.errors.push(e)
                // })
                try {
                    const newChat = await fetch('http://localhost:3001/chats', {
                        method: 'POST',
                        headers: {
                            'Content-Type': "application/json",
                            Authorization: "Bearer " + token,
                        },
                        body: JSON.stringify(this.chat)
                    })

                    this.socket.emit('save-message', 
                    { 
                        room: this.chat.room, 
                        nickName: this.chat.nickName,
                        message: this.nickName + ' Join this room', 
                        created_date: new Date()
                    });
                    console.log(this.$route.params.id, this.nickName)
                    this.$router.push({
                        name: 'ChatRoom',
                        params: {
                            id: this.$route.params.id,
                            nickName: this.nickName
                        }
                    })

                    console.log(newChat)
                } catch (err) {
                    console.log(err)
                }
            }
        },
        computed: {
            getUserInfo() {
                return this.$store.state.userInfo
            },
            getToken() {
                return this.$store.state.refToken
            },
        },
        mounted () {
            this.$nextTick(() => {
                this.$store.dispatch('getRefreshToken')
                this.nickName = this.getUserInfo.user.nickName 
                this.chat.user = this.getUserInfo.user
            })
        },
        watch: {
            getToken(token) {
                this.$store.dispatch('getUserInfo')
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>