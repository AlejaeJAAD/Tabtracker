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
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card style="flex-wrap: wrap">
                            <v-card-title class="text-h5">Are you sure you want to delete the room 
                                <span style="color: red">{{itemToBeDeleted}}</span>&nbsp;?
                            </v-card-title>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click.stop="closeDelete">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click.stop="deleteItemConfirm(room_id)">OK</v-btn>
                            <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon
                        small
                        class="mr-2"
                        @click.stop="joinRoom(item._id)"
                    >
                        mdi-gesture-tap
                    </v-icon>
                    <v-icon
                        small
                        @click="deleteItem(item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
            </v-data-table>
            <v-sheet v-if="message">
                <v-alert type="success">
                    {{successMessage}}
                </v-alert>
            </v-sheet>
            <ul v-if="errors && errors.length">
                <li v-for="error of errors" :key="error">
                    {{error.message}}
                </li>
            </ul>
        </v-col>
        <v-col>
        </v-col>
    </v-row>
</template>

<script>
    import Axios from 'axios'
    import moment from 'moment'
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
                errors: [],
                successMessage: '',
                dialogDelete: false,
                editedIndex: -1,
                editedItem: {
                    created_date: '',
                    room_name: '',
                },
                itemToBeDeleted: '',
                message: false,
                room_id: ''
            }
        },
        watch: {
            dialogDelete (val) {
                val || this.closeDelete()
            },
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
            joinRoom (id) {
                this.$router.push({
                    name: 'JoinRoom',
                    params: { id: id }
                })
            },
            createRoom () {
                console.log('Create')
            },
            deleteItem (item) {
                this.editedIndex = this.rooms.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
                this.itemToBeDeleted = item.room_name
                this.room_id = item._id
            },
            deleteItemConfirm (room_id) {
                Axios.delete(`http://localhost:3001/rooms/${room_id}`)
                .then(() => {
                    this.successMessage = 'Room deleted successfully'
                })
                this.rooms.splice(this.editedIndex, 1)
                this.closeDelete()
                this.message = true
                setTimeout(() => {
                    this.message = false
                }, 1000);
            },
            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)

                this.editedIndex = -1
                })
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>