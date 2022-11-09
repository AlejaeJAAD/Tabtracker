<template>
    <v-row>
        <v-col cols="6" align="center">
            <v-btn outlined color="success" @click="$router.push({
                name: 'RoomList'
            })">
                (Room List)
            </v-btn>
            <br>
            <br>
            <hr>
            <br>
            <h2>
                Add Room
            </h2>
            <validation-observer ref="observer"
                v-slot="{ invalid }">
                <v-form @submit.prevent="submit">
                    <validation-provider
                        v-slot="{ errors }"
                        name="Room Name"
                        rules="required|max:25"
                    >
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-text-field
                                        :counter="25"
                                        :error-messages="errors"
                                        v-model.trim="room.room_name"
                                        label="Enter Room Name"
                                        required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="10" align="center">
                                    <v-btn
                                        class="mr-4"
                                        :disabled="invalid"
                                        @click="createRoom()"
                                    >
                                        Submit
                                    </v-btn>
                                    <v-btn @click="clear">
                                        clear
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
                room: {}
            }
        },
        methods: {
            submit () {
                this.$refs.observer.validate()
            },
            clear () {
                this.room_name = ''
                this.$refs.observer.reset()
            },
            createRoom() {
                Axios.post(`http://localhost:3001/rooms`, this.room)
                .then(response => {
                    this.$router.push({
                        name: 'RoomList'
                    })
                })
                .catch(e => {
                    this.errors.push(e)
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>