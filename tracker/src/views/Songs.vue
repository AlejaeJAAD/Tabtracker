<template>
    <div>
        <Nav :color="color" style="margin-top: 2rem" />
        <v-row justify="center">
            <v-col cols="11" align="center">
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

                    <v-container class="song" v-for="song in songs"
                        :key="song._id" fill-height style="padding:0px">
                        <v-row no-gutters>
                            <v-col cols="4">
                                <v-card class="crop" flat>
                                    <div class="song-title">
                                        {{song.title}}
                                    </div>
                                    <div class="song-artist">
                                        {{song.artist}}
                                    </div>
                                    <div class="song-genre">
                                        {{song.genre}}
                                    </div>
                                    <v-btn
                                        dark
                                        color='rgb(233, 69, 96)'
                                        :to="{name: 'view-song', params: {songId: song._id}}"    
                                    >
                                        Detail
                                    </v-btn>
                                </v-card>
                            </v-col>

                            <v-col cols="7" style="padding-bottom: 1.5rem" mx-auto>
                                <v-card 
                                    class="crop"
                                    style="position: relative"
                                    elevation="5"
                                    height="180px">
                                    <v-img :src="song.albumImageUrl"
                                        class="white--text align-end"
                                        width="100%"
                                        max-height="100%"
                                        style="object-fit: cover">
                                        <v-btn
                                            elevation="5"
                                            medium
                                            absolute
                                            top
                                            left
                                            color="white"
                                            @click="downloadVideo(song.youtubeVideoId)"
                                        >
                                            <v-icon>mdi-download</v-icon>
                                        </v-btn>
                                    </v-img>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-card style="position: relative" color="transparent">
                                                <v-card-actions>
                                                    <v-btn left small class="white--text" color="#c4302b" @click="ytvideo(song.youtubeVideoId)">
                                                        Watch Youtube Video <v-icon>mdi-youtube</v-icon>
                                                    </v-btn>
                                                    <v-dialog v-if="dialog" v-model="dialog" width="auto" align="center" persistent>
                                                        <v-card height="100%">
                                                            <youtube :video-id="youtubeID"></youtube>
                                                            <v-card-actions>
                                                                <v-spacer></v-spacer>
                                                                <v-btn outlined color="black" style="margin: 1px" @click="stopVideo()">Close <v-icon>mdi-close</v-icon></v-btn>
                                                            </v-card-actions>
                                                        </v-card>
                                                    </v-dialog>
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                        outlined right small class="white--text" color="red"
                                                    >
                                                        Delete song <v-icon>mdi-delete</v-icon>
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                    </v-container>
                </panel>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import Nav from '../components/Global/Nav.vue';
    import Panel from '@/components/Songs/Panel.vue'
    export default {
        components: { Nav, Panel },
        data() {
            return {
                color: 'rgb(233, 69, 96)',
                songs: null,
                link: 'https://www.youtube.com/watch?v=',
                error: null,
                thumbnail: '',
                youtubeID: null,
                dialog: false,
            }
        },
        created() {
            this.song()
        },
        async mounted () {
        },
        methods: {
            async song() {
                try {
                    const resToken = await fetch('http://localhost:3001/refresh-token', {
                    method: 'GET',
                    credentials: "include"
                    })

                    const {token} = await resToken.json()

                    const res = await fetch('http://localhost:3001/songs', {
                        method: 'GET',
                        headers: {
                            'Content-Type': "application/json",
                            Authorization: "Bearer " + token,
                        },
                    })

                    const data = await res.json()
                    this.songs = data.songs
                    console.log(data)
                } catch (err) {
                    console.log(err)
                }
            },
            async downloadVideo(youtubeVideoId) {
                const videoURL = this.link+youtubeVideoId
                try {
                    await SongsService.download({
                        songName: videoURL
                    })
                } catch (error) {
                    this.error = error.response
                }
            },
            ytvideo(youtubeVideoID) {
                this.dialog = true
                this.youtubeID = youtubeVideoID
            },
            stopVideo() {
                this.dialog = false
                this.player.stopVideo()
            }
        },
    }
</script>

<style lang="scss" scoped>
.crop {
    margin: 1.5rem;
}
.song {
  padding: 20px;
  height: 330px;
  overflow: hidden;
}
.song-title {
  font-size: 30px;
}
.song-artist {
  font-size: 24px;
}
.song-genre {
  font-size: 18px;
}
.imagen:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
 }
</style>