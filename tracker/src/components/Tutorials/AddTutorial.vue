<template>
    <v-row justify="center">
        <v-dialog
            style="padding: 1rem"
            v-model="confirmCreateDialog"
            persistent
            max-width="500"
        >
            <v-card flat v-if="!submitted" style="padding: 2rem">
                <v-card-title>
                    Add tutorial
                </v-card-title>
                <v-form ref="form" lazy-validation>
                    <v-text-field
                        v-model="tutorial.title"
                        :rules="[(v) => !!v || 'Title is required']"
                        label="Title"
                        required
                    ></v-text-field>

                    <v-text-field
                        v-model="tutorial.description"
                        :rules="[(v) => !!v || 'Description is required']"
                        label="Description"
                        required
                    ></v-text-field>

                    <v-text-field
                        v-model="tutorial.uid"
                        label="User ID"
                        disabled
                    ></v-text-field>
                </v-form>

                <v-btn color="success" class="mt-3" @click="saveTutorial">Add</v-btn>
                <v-btn color="primary" class="mt-3" @click="closeDialog">Close</v-btn>
            </v-card>

            <v-card flat v-else class="mx-auto">
                <v-card-title>
                    Submitted successfully!
                </v-card-title>

                <v-card-subtitle>
                    Click the button to add new Tutorial.
                </v-card-subtitle>

                <v-card-actions>
                    <v-btn color="success" @click="newTutorial">Add another tutorial</v-btn>
                    <v-btn color="primary" @click="closeDialog">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
    import TutorialService from "@/services/TutorialService";
    export default {
        props: ['confirmCreateDialog'],
        data () {
            return {
                tutorial: {
                    id: null,
                    title: "",
                    description: "",
                    published: false,
                    uid: ''
                },
                submitted: false,
                token: ''
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.$store.dispatch('getRefreshToken')
                this.tutorial.uid = this.getUserInfo.user._id
                this.token = this.getToken
            })
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
            }
        },
        methods: {
            closeDialog (event) {
                this.$emit('closeDialog', false);
            },
            async saveTutorial() {
                var data = {
                    title: this.tutorial.title,
                    description: this.tutorial.description,
                    uid: this.tutorial.uid
                };

                const resToken = await fetch('http://localhost:3001/refresh-token', {
                        method: 'GET',
                        credentials: "include"
                        })

                        const {token} = await resToken.json()

                const res = await fetch('http://localhost:3001/tutorials', {
                            method: 'POST',
                            headers: {
                                'Content-Type': "application/json",
                                Authorization: "Bearer " + token,
                            },
                            credentials: 'include',
                            body: JSON.stringify(data)
                })

                const result = await res.json()
                this.tutorial.id = result.newTutorial.id;
                this.submitted = true;

            // TutorialService.postTutorial(data)
            //     .then((response) => {
            //     })
            //     .catch((e) => {
            //     console.log(e);
            //     });
            },
            newTutorial() {
                this.submitted = false;
                this.tutorial = {
                    uid: this.tutorial.uid
                };
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>