<template>
    <v-row>
        <v-col>
            <v-card v-if="currentTutorial">
                <h3>Edit tutorial</h3>

                <v-form ref="form" lazy-validation>
                    <v-text-field
                        v-model="currentTutorial.title"
                        :rules="[(v) => !!v || 'Title is required']"
                        label="Title"
                        required
                    ></v-text-field>

                    <v-text-field
                        v-model="currentTutorial.description"
                        :rules="[(v) => !!v || 'Description is required']"
                        label="Description"
                        required
                    ></v-text-field>

                    <label><strong>Status:</strong></label>
                    {{ currentTutorial.published ? "Published" : "Pending" }}

                    <v-divider class="my-5"></v-divider>

                    <v-btn v-if="currentTutorial.published"
                        @click="updatePublished(false)"
                        color="primary" small class="mr-2"
                    >
                        UnPublish
                    </v-btn>

                    <v-btn v-else
                        @click="updatePublished(true)"
                        color="primary" small class="mr-2"
                    >
                        Publish
                    </v-btn>

                    <v-btn color="error" small class="mr-2" @click="deleteTutorial">
                        Delete
                    </v-btn>

                    <v-btn color="success" small @click="updateTutorial">
                        Update
                    </v-btn>
                </v-form>

                <p class="mt-3">{{ message }}</p>
            </v-card>

            <v-card v-else>
                <p>Please click on a Tutorial...</p>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import TutorialService from "@/services/TutorialService";
    export default {
        data () {
            return {
                currentTutorial: null,
                message: "",
            };
        },
        methods: {
            getTutorial(id) {
                TutorialService.getTutorial(id)
                .then((response) => {
                this.currentTutorial = response.data;
                console.log(response.data);
                })
                .catch((e) => {
                console.log(e);
                });
            },
            updatePublished(status) {
                var data = {
                    id: this.currentTutorial.id,
                    title: this.currentTutorial.title,
                    description: this.currentTutorial.description,
                    published: status,
                };

                TutorialService.updateTutorial(this.currentTutorial.id, data)
                    .then((response) => {
                    this.currentTutorial.published = status;
                    console.log(response.data);
                    })
                    .catch((e) => {
                    console.log(e);
                    });
            },

            updateTutorial() {
                TutorialService.updateTutorial(this.currentTutorial.id, this.currentTutorial)
                .then((response) => {
                console.log(response.data);
                this.message = "The tutorial was updated successfully!";
                })
                .catch((e) => {
                console.log(e);
                });
            },

            deleteTutorial() {
                TutorialService.deleteTutorial(this.currentTutorial.id)
                .then((response) => {
                console.log(response.data);
                this.$router.push({ name: "TutorialList" });
                })
                .catch((e) => {
                console.log(e);
                });
            },
        },
        mounted() {
            this.message = "";
            this.getTutorial(this.$route.params.id);
        },
    }
</script>

<style lang="scss" scoped>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>