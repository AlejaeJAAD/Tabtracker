<template>
    <v-card
        class="mx-auto overflow-hidden"
        height="100vh">
        <Nav />
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>Customers</v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import Nav from '../components/Global/Nav.vue'
    export default {
        components: {
            Nav
        },
        data() {
            return {

            }
        }
    }
</script>

<style lang="scss" scoped>

</style>