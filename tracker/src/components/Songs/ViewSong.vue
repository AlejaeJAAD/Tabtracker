<template>
    <div>
        <panel title="Song Metadata">
            <div>
                {{song.title}}
                <hr>
                {{song.tab}}
            </div>
        </panel>
    </div>
</template>

<script>
    import SongsService from '@/services/SongsService'
    import Panel from '@/components/Songs/Panel.vue'
    export default {
        components: { Panel },
        data() {
            return {
                songId: null,
                song: {}
            }
        },
        async mounted () {
            this.songId = this.$store.state.route.params.songId
            await SongsService.show(this.songId).then(res => {
                this.song = JSON.parse(JSON.stringify(res.data));
            }).catch(error => console.log(error));
        }
    }
</script>

<style lang="scss" scoped>

</style>