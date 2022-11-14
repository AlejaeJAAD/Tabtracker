<template>
    <v-row>
        <v-col class="submit-form mt-3 mx-auto">
            <p class="headline">
                Add Tutorial
            </p>

            <v-card v-if="!submitted">
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

                <v-btn color="primary" class="mt-3" @click="saveTutorial">Submit</v-btn>
            </v-card>

            <v-card v-else class="mx-auto">
                <v-card-title>
                    Submitted successfully!
                </v-card-title>

                <v-card-subtitle>
                    Click the button to add new Tutorial.
                </v-card-subtitle>

                <v-card-actions>
                    <v-btn color="success" @click="newTutorial">Add</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import TutorialService from "@/services/TutorialService";
    export default {
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
                console.log(result);
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