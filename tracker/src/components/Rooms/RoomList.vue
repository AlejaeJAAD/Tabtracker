<template>
    <v-card class="mx-auto overflow-hidden"
        height="100vh">
        <Nav />
        <v-row>
            <v-col cols="12" v-if="loadedData">
                <v-card>
                    <v-card-title>
                        Loading the rooms
                    </v-card-title>
                </v-card>
            </v-col>
            <v-col cols="12" v-else class="pa-10">
                <v-row>
                    <v-col cols="2" style="margin-top: 1rem">
                        <v-btn block color="success" outlined small @click="createDialog = true">
                            Add Room
                        </v-btn>
                    </v-col>

                    <v-col cols="5" class="text-right" style="margin-top: 1rem">
                        <v-spacer></v-spacer>
                        <v-btn color="success" @click="generatePDF">Generate PDF</v-btn>
                    </v-col>
                    
                    <v-col cols="5" class="text-right" style="margin-top: 1rem">
                        <v-spacer></v-spacer>
                        <v-btn color="error" small @click="confirmDeleteDialog = true">
                            Remove All
                        </v-btn>
                    </v-col>
                    
                    <v-col cols="12" sm="12" style="padding-bottom: 3rem">
                        <v-card class="mx-auto" tile elevation="5">
                            <v-card-title>Tutorials</v-card-title>
                            
                            <v-data-table
                                :headers="headers"
                                :items="rooms"
                            >
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-icon small class="mr-2" @click="joinRoom(item.id)">
                                    mdi-chat
                                    </v-icon>
                                    <v-icon small class="mr-2" @click="editRoom(item.id)">
                                    mdi-pencil
                                    </v-icon>
                                    <v-icon small   @click="idOfItemToBeDeleted = item.id; 
                                                            roomNameOfItemToBeDeleted = item.room_name; 
                                                            confirmItemToBeDeletedDialog = true">
                                    mdi-delete
                                    </v-icon>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>
            
                    <v-dialog width="auto" v-model="confirmDeleteDialog">
                        <v-card>
                            <v-card-title>Are you sure you want to delet all the rooms?</v-card-title>
                            <v-card-actions class="justify-center">
                                <v-btn color="success" @click="removeAllRooms">Yes</v-btn>
                                <v-btn color="error" @click="confirmDeleteDialog = false">No</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
            
                    <v-dialog width="auto" v-model="confirmItemToBeDeletedDialog">
                        <v-card class="text-center" style="padding-bottom: 1.5rem">
                            <v-card-title>Are you sure you want to delete the room&nbsp;<strong>{{roomNameOfItemToBeDeleted}}</strong> ?</v-card-title>
                            <v-card-actions>
                                <v-btn color="success" @click="deleteRoom">Yes</v-btn>
                                <v-btn color="error" @click="confirmItemToBeDeletedDialog = false">No</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
            
                    <AddRoom v-if="createDialog" @closeDialog="getFromChild" :createDialog="createDialog"/>
                </v-row>
            </v-col>
            <v-col cols="12">
                {{pdfData}}
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import Nav from '@/components/Global/Nav.vue'
    import AddRoom from "./AddRoom.vue";
    import RoomService from "@/services/RoomService";
    export default {
        components: { Nav, AddRoom },
        data () {
            return {
                rooms: [],
                headers: [
                    { text: "Room Name", align: "start", sortable: true, value: "room_name" },
                    { text: "Created Date", value: "created_date", sortable: false },
                    { text: "Actions", value: "actions", sortable: false },
                ],
                idOfItemToBeDeleted: '',
                roomNameOfItemToBeDeleted: '',
                confirmDeleteDialog: false,
                createDialog: false,
                confirmItemToBeDeletedDialog: false,
                watcherActive: false,
                loadedData: true,
                pdfData: ''
            }
        },
        methods: {
            retrieveRooms() {
                RoomService.getAllRooms()
                .then((res) => {
                    this.rooms = res.data.map(this.getDisplayRoom)
                })
                .catch((e) => {
                    console.log(e);
                });
            },
            refreshList() {
                this.retrieveRooms();
            },
            removeAllRooms() {
                this.confirmDeleteDialog = false
                RoomService.deleteAllRooms()
                    .then((response) => {
                        this.refreshList();
                    })
                    .catch((e) => {
                    console.log(e);
                    });
            },
            joinRoom(id) {
                this.$router.push({
                    name: 'JoinRoom',
                    params: { id: id }
                })
            },
            editRoom(id) {
                this.$router.push({ name: "RoomDetails", params: { id: id } });
            },
            deleteRoom() {
                this.confirmItemToBeDeletedDialog = false
                this.rooms.pop()
                
                RoomService.deleteRoom(this.idOfItemToBeDeleted)
                .then(() => {
                    RoomService.getAllRooms()
                        .then((res) => {
                            this.rooms = res.data.map(this.getDisplayRoom);
                        })
                        .catch((e) => {
                            console.log(e);
                        });

                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },
            getDisplayRoom(room) {
                return {
                    id: room._id,
                    room_name: room.room_name.length > 30 ? room.room_name.substr(0, 30) + "..." : room.room_name,
                    created_date: room.created_date,
                };
            },
            getFromChild(value) {
                this.createDialog = value
                this.refreshList();
            },
            async generatePDF() {
                const rooms = this.rooms
                const pdfResult = await fetch('http://localhost:3001/generatePDF', {
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(rooms)
                })
                this.pdfData = await pdfResult.json()
            }
        },
        mounted() {
            this.retrieveRooms();
            this.loadedData = false
        },
    }
</script>

<style lang="scss" scoped>
.v-card__actions {
    display: inline; 
}
</style>