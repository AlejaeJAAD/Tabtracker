<template>
    <div>
        <Nav :color="color" style="margin-top: 2rem" />
        <v-row justify="center">
            <v-col cols="8" align="center">
                <panel title="Songs" color="rgb(22, 33, 62)">
                    <router-link
                        slot="action"
                        :to="{name: 'songs-create'}"
                    >
                        <v-btn
                            large
                            absolute
                            right
                            middle
                            fab
                            color='rgb(233, 69, 96)'
                        >
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </router-link>

                    <div v-for="song in songs"
                        :key="song.id">
                        {{song.artist}} -
                        {{song.album}} -
                        {{song.title}} -
                        <v-btn small black outlined @click="downloadVideo(song.title)">Download video</v-btn>
                    </div>
                </panel>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import Nav from '../components/Global/Nav.vue';
    import Panel from '@/components/Songs/Panel.vue'
    import SongsService from '@/services/SongsService'
    export default {
        components: { Nav, Panel },
        data() {
            return {
                color: 'rgb(233, 69, 96)',
                songs: null,
                //link: 'https://www.youtube.com/watch?v=ma9I9VBKPiw',
                //YOUTUBE_API_KEY: 'AIzaSyDxgDt5XyVSTAwqZQYChOnHkNOebkPji3k',
                error: null,
                thumbnail: ''
            }
        },
        async mounted () {
            await SongsService.index().then(res => {
                this.songs = JSON.parse(JSON.stringify(res.data));
            }).catch(error => console.log(error));
        },
        methods: {
            async downloadVideo(name) {
                try {
                    const response = await SongsService.download({
                    songName: name
                    }).then(res => {
                        // console.log(res.data.items[0])
                        //<v-img :src="thumbnail"></v-img>
                        // this.thumbnail = res.data.items[0].snippet.thumbnails.high.url
                        // console.log(this.thumbnail)
                    })
                } catch (error) {
                    this.error = error.response
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>