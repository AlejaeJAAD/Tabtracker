<template>
    <div>
        <Nav :color="color" style="margin-top: 2rem" />
        <h1>Tab tracker</h1>
    </div>
</template>

<script>
    import Nav from '../components/Global/Nav.vue';
    export default {
        components: { Nav },
        data() {
            return {
                color: 'rgb(233, 69, 96)',
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>