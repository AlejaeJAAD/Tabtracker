<template>
    <v-row>
        <v-col cols="12">
            <!-- <h2>
                Room List
                <v-btn color="success" @click="$router.push({
                        name: 'AddRoom'
                    })">
                    Add room
                </v-btn>
            </h2> -->


            <v-data-table
                sort-by="room_name"
                :headers="headers"
                :items="rooms"
                class="elevation-1"
            >
                <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Rooms</v-toolbar-title>
                    <v-divider
                        class="mx-4"
                        inset
                        vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        @click.stop="createRoom()"
                        >
                        New Item
                    </v-btn>
                </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click.stop="join(item._id)"
                >
                    mdi-pencil
                </v-icon>
                </template>
            </v-data-table>
            <ul v-if="errors && errors.length">
                <li v-for="error of errors" :key="error">
                    {{error.message}}
                </li>
            </ul>
        </v-col>
    </v-row>
</template>

<script>
    import Axios from 'axios'
    export default {
        data () {
            return {
                headers: [
                    {
                        text: 'Room Name',
                        align: 'start',
                        sortable: false,
                        value: 'room_name',
                    },
                    {
                        text: 'Created Date',
                        align: 'start',
                        sortable: false,
                        value: 'created_date',
                    },
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
                rooms: [],
                errors: []
            }
        },
        created() {
            Axios.get(`http://localhost:3001/rooms`)
            .then(res => {
                this.rooms = res.data
                console.log(this.rooms)
            })
            .catch(e => {
                this.errors.push(e)
            })
        },
        methods: {
            join (id) {
                this.$router.push({
                    name: 'JoinRoom',
                    params: { id: id }
                })
            },
            createRoom () {
                console.log('Create')
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>