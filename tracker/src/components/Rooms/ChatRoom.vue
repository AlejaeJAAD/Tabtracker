<template>
    <v-row>
        <v-col>
            <v-card class="mx-auto" max-width="400" tile>
                <v-list :three-line="threeLine">
                    <v-subheader>Chat</v-subheader>
                    <v-list-item-group color="primary">
                        <v-list-item
                            class="chat"
                            v-for="(item, i) in chats"
                            :key="i"
                            :inactive="inactive"
                        >
                            <v-list-item-avatar class="left clearfix" v-if="item.nickname === nickname">
                                <v-img :src="item.avatar"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content class="chat-body clearfix">
                                <strong class="primary-font">{{ item.nickname }}</strong> <small class="pull-right text-muted">
                                <span class="glyphicon glyphicon-time"></span>{{ item.created_date }}</small>
                                <v-list-item-subtitle v-if="threeLine" v-html="item.message"></v-list-item-subtitle>
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
    </v-row>
</template>

<script>
    import Axios from 'axios'
    export default {
        data () {
            return {
                inactive: false,
                threeLine: true,
                // subGroup: false,
                // nav: false,
                // avatar: false,
                chats: [],
                errors: [],
                nickname: this.$route.params.nickname,
                chat: {}
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
        },
        methods: {
            logout (id) {
                this.$router.push({
                    name: 'JoinRoom',
                    params: { id: id }
                })
            },
            onSubmit (evt) {
                evt.preventDefault()
                this.chat.room = this.$route.params.id
                this.chat.nickname = this.$route.params.nickname
                Axios.post(`http://localhost:3001/chats`, this.chat)
                .then(response => {
                    // this.$router.push({
                    //   name: 'ChatRoom',
                    //   params: { id: this.$route.params.id, nickname: response.data.nickname }
                    // })
                })
                .catch(e => {
                    this.errors.push(e)
                })
            }
        }
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