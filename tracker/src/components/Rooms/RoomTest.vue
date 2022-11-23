<template>
    <v-main fill-height>
        <Nav />
        <v-row class="list mx-auto mt-10 pl-10 pr-10">
            <v-col cols="12">
                <!-- <h2>
                    Room List
                    <v-btn color="success" @click="$router.push({
                            name: 'AddRoom'
                        })">
                        Add room
                    </v-btn>
                </h2> -->
    
                <v-card elevation="5">
                    <v-data-table
                        sort-by="room_name"
                        :headers="headers"
                        :items="rooms"
                        class="elevation-1 transparent"
                    >
                        <template v-slot:top>
                            <v-toolbar class="transparent" color="transparent" flat>
                                <v-toolbar-title>Rooms</v-toolbar-title>
                                <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                                ></v-divider>
                                <v-spacer></v-spacer>
                                <v-btn
                                    outlined
                                    class="mb-2"
                                    @click.stop="createDialog = true"
                                    >
                                    Add Room
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
                            <v-btn color="success" small outlined
                                class="mr-2"
                                @click.stop="joinRoom(item._id)">Join</v-btn>
                            <v-btn color="error" small outlined
                                class="mr-2"
                                @click="deleteItem(item)">Delete</v-btn>
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
                </v-card>
            </v-col>
            <AddRoom v-if="createDialog" @closeDialog="getFromChild" :createDialog="createDialog"/>
        </v-row>
    </v-main>
</template>

<script>
    import Axios from 'axios'
    import Nav from '@/components/Global/Nav.vue'
    import AddRoom from "./AddRoom.vue";
    export default {
        components: { Nav, AddRoom },
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
                room_id: '',
                createDialog: false
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
            deleteItem (item) {
                this.room_id = '',
                this.editedIndex = -1,
                this.editedItem = {
                    created_date: '',
                    room_name: '',
                },
                this.itemToBeDeleted = ''

                this.editedIndex = this.rooms.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
                this.itemToBeDeleted = item.room_name
                this.room_id = item._id

                this.retrieveRooms()
            },
            async deleteItemConfirm() {
                console.log(this.room_id)
                await Axios.delete(`http://localhost:3001/rooms/${this.room_id}`)
                .then((res) => {
                    this.successMessage = res.data.message
                })
                this.room_id = ''
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
            getFromChild(value) {
                this.retrieveRooms()
                this.createDialog = value
            },
            async retrieveRooms() {
                console.log('sdksfll')
                this.rooms_id = ''
                await Axios.get(`http://localhost:3001/rooms`)
                .then(res => {
                    this.rooms = res.data.map(this.getDisplayRooms)
                })
                .catch(e => {
                    this.errors.push(e)
                })
            },
            getDisplayRooms(room) {
                return {
                    room_name: room.room_name.length > 30 ? room.room_name.substr(0, 30) + "..." : room.room_name,
                    created_date: room.created_date
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
</style>