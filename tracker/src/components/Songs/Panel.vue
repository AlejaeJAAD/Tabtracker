<template>
    <div class="white elevation-2">
        <v-toolbar flat dense :color="color" dark>
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <slot name="action" />
        </v-toolbar>

        <slot>
            No slot content defined.
        </slot>
    </div>
</template>

<script>
    export default {
        props: [
            'title', 'color'
        ],
        data () {
            return {
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>