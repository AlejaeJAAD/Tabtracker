<template>
    <v-row align="center" class="list px-3 mx-auto">
        <v-col cols="12" sm="8">
            <v-text-field v-model="title" label="Search by tutorial name"></v-text-field>
        </v-col>
        
        <!-- @click="page = 1; retrieveTutorials()" -->
        <v-col cols="12" sm="4">
            <v-btn outlined color="success" small @click="searchTitle">
                Search
            </v-btn>
        </v-col>
        
        <v-col cols="12" sm="12">
            <v-row>
                <v-col cols="4" sm="3">
                    <v-select
                        v-model="pageSize"
                        :items="pageSizes"
                        label="Tutorials per page"
                        @change="handlePageSizeChange"
                    >
                    </v-select>
                </v-col>

                <v-col cols="12" sm="9">
                    <v-pagination
                        v-model="page"
                        :length="totalPages"
                        total-visible="7"
                        next-icon="mdi-menu-right"
                        prev-icon="mdi-menu-left"
                        @input="handlePageChange"
                    >
                    </v-pagination>
                </v-col>
            </v-row>
        </v-col>
        
        <v-col cols="12" sm="12">
            <v-card class="mx-auto" tile>
                <v-card-title>Tutorials</v-card-title>
                
                <v-data-table
                    :headers="headers"
                    :items="tutorials"
                    disable-pagination
                    :hide-default-footer="true"
                >
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small class="mr-2" @click="editTutorial(item.id)">
                        mdi-pencil
                        </v-icon>
                        <v-icon small @click="idOfItemToBeDeleted = item.id; titleOfItemToBeDeleted = item.title; confirmItemToBeDeletedDialog = true">
                        mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
            </v-card>
        </v-col>

        <v-col>
            <v-spacer></v-spacer>
            <v-card-actions>
                <v-btn color="error" outlined small @click="confirmDeleteDialog = true">
                    Remove All
                </v-btn>
            </v-card-actions>
        </v-col>

        <v-dialog width="auto" v-model="confirmDeleteDialog">
            <v-card class="text-xs-center">
                <v-card-title>Are you sure you want to delet all the tutorials?</v-card-title>
                <v-card-actions>
                    <v-btn color="success" @click="removeAllTutorials">Yes</v-btn>
                    <v-btn color="error" @click="confirmDeleteDialog = false">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog width="auto" v-model="confirmItemToBeDeletedDialog">
            <v-card class="text-xs-center">
                <v-card-title>Are you sure you want to delete the tutorial {{titleOfItemToBeDeleted}}?</v-card-title>
                <v-card-actions>
                    <v-btn color="success" @click="deleteTutorial">Yes</v-btn>
                    <v-btn color="error" @click="confirmItemToBeDeletedDialog = false">No</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
    import TutorialService from "@/services/TutorialService";
    export default {
        data () {
            return {
                tutorials: [],
                title: "",
                headers: [
                    { text: "Title", align: "start", sortable: true, value: "title" },
                    { text: "Description", value: "description", sortable: false },
                    { text: "Status", value: "status", sortable: false },
                    { text: "Actions", value: "actions", sortable: false },
                ],
                page: 1,
                totalPages: 0,
                pageSize: 3,
                pageSizes: [3, 5],
                idOfItemToBeDeleted: '',
                titleOfItemToBeDeleted: '',
                confirmDeleteDialog: false,
                confirmItemToBeDeletedDialog: false,
                watcherActive: false,
            }
        },
        methods: {
            getRequestParams(title, page, pageSize) {
                let params = {};

                if (title) {
                    params["title"] = title;
                }

                if (page) {
                    params["page"] = page - 1;
                }

                if (pageSize) {
                    params["size"] = pageSize;
                }

                return params;
            },
            retrieveTutorials() {
                const params = this.getRequestParams(
                    this.title,
                    this.page,
                    this.pageSize
                )

                TutorialService.getAllTutorials(params)
                .then((response) => {
                    const { tutorials, totalPages } = response.data;
                    this.tutorials = tutorials.map(this.getDisplayTutorial);
                    this.totalPages = totalPages;
                })
                .catch((e) => {
                    console.log(e);
                });
            },
            refreshList() {
                this.retrieveTutorials();
            },
            removeAllTutorials() {
                this.confirmDeleteDialog = false
                TutorialService.deleteAll()
                    .then((response) => {
                        this.refreshList();
                    })
                    .catch((e) => {
                    console.log(e);
                    });
            },
            searchTitle() {
                const params = this.getRequestParams(
                    this.title,
                    this.page,
                    this.pageSize
                )

                TutorialService.getByTitle(this.title, params)
                    .then((response) => {
                        const { tutorials, totalPages } = response.data;
                        this.tutorials = tutorials.map(this.getDisplayTutorial);
                        this.totalPages = totalPages;
                })
                .catch((e) => {
                console.log(e);
                });
            },
            // searchTitle() {
            //     TutorialService.getByTitle(this.searchTutorial)
            //         .then(response => {
            //         this.tutorials = response.data;
            //         console.log(response.data);
            //         })
            //         .catch(e => {
            //         console.log(e);
            //         });
            //     }
            editTutorial(id) {
                this.$router.push({ name: "TutorialDetails", params: { id: id } });
            },
            deleteTutorial() {
                this.confirmItemToBeDeletedDialog = false
                TutorialService.deleteTutorial(this.idOfItemToBeDeleted)
                    .then(() => {
                        this.watcherActive = true
                        //this.refreshList();
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },
            getDisplayTutorial(tutorial) {
                return {
                    id: tutorial.id,
                    title: tutorial.title.length > 30 ? tutorial.title.substr(0, 30) + "..." : tutorial.title,
                    description: tutorial.description.length > 30 ? tutorial.description.substr(0, 30) + "..." : tutorial.description,
                    status: tutorial.published ? "Published" : "Pending",
                };
            },
            handlePageChange(value) {
                this.page = value;
                this.retrieveTutorials();
            },
            handlePageSizeChange(size) {
                this.pageSize = size;
                this.page = 1;
                this.retrieveTutorials();
            },
        },
        mounted() {
            this.retrieveTutorials();
        },
        watch: {
            watcherActive() {
                this.page = 1;
                this.totalPages = 0;
                this.tutorials = [];
                this.retrieveTutorials();
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>