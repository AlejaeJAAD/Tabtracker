<template>
    <div>
        <Nav :color="color" style="margin-top: 2rem" />
        <v-row justify="center">
            <v-col cols="4" >
                <panel title="Song Metadata" color="rgb(22, 33, 62)" class="fill-height">
                    <!-- Title -->
                    <v-text-field
                        label="Song title"
                        v-model="song.title">
                    </v-text-field>

                    <!-- Artist -->
                    <v-text-field
                        label="Artist"
                        v-model="song.artist">
                    </v-text-field>

                    <!-- Genre -->
                    <!-- <v-text-field
                        label="Genre"
                        v-model="song.genre">
                    </v-text-field> -->

                    <v-card>
                        <v-list>
                            <v-list-group prepend-icon="mdi-music-clef-treble">
                                <template v-slot:activator>
                                    <v-list-item-title>Genre</v-list-item-title>
                                </template>
                                
                                <v-list-group sub-group no-action v-for="item in genres"
                                        :key="item.title"
                                        v-model="item.subactive"
                                        @click="closeOther(item, genres)"
                                >
                                    <template v-slot:activator>
                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    {{item.title}}
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>
                                    <v-list-item>
                                        <v-select
                                        class="ma-1"
                                        :items="item.subgenres"
                                        :label=item.title
                                        outlined
                                        v-model="song.genre"
                                        >
                                    </v-select>
                                    </v-list-item>
                                </v-list-group>
                            </v-list-group>
                        </v-list>
                    </v-card>

                    <!-- Album -->
                    <v-text-field
                        label="Album"
                        v-model="song.album">
                    </v-text-field>

                    <!-- Album Image Url -->
                    <v-text-field
                        label="Album Image Url"
                        disabled
                        v-model="song.albumImageUrl">
                    </v-text-field>

                    <!-- Youtube Channel ID -->
                    <v-text-field
                        label="Youtube ID"
                        disabled
                        v-model="song.youtubeId">
                    </v-text-field>
                </panel>
            </v-col>

            <v-col cols="7">
                <panel title="Song Structure" color="rgb(22, 33, 62)" class="marginPanel fill-height">
                    <!-- Lyrics -->
                    <v-textarea
                        label="Lyrics"
                        multi-line
                        v-model="song.lyrics">
                    </v-textarea>
                </panel>
            </v-col>
            <v-col cols="11" style="margin: -10px">
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        style="margin-right: -10px"
                        outlined
                        @click="createSong">
                            Create Song
                    </v-btn>
                </v-card-actions>
            </v-col>

            <v-col cols="12">
                <v-dialog
                    v-model="dialog"
                    width="auto"
                    persistent
                >
                    <v-card style="padding: 1.1rem">
                        {{error}}
                        <v-card-actions>
                            <v-btn @click="dialog = false" color="red" outlined style="margin-top: 10px; margin-bottom: -15px">
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import Nav from '../Global/Nav.vue';
    import Panel from '@/components/Songs/Panel.vue'
    export default {
        components: {
            Nav, Panel
        },
        data () {
            return {
                color: 'rgb(233, 69, 96)',
                song: {
                    title: null,
                    artist: null,
                    genre: null,
                    album: null,
                    albumImageUrl: null,
                    youtubeChannelId: null,
                    youtubeVideoId: null,
                    lyrics: null,
                    subscriberCount: null,
                    videoCount: null,
                    viewCount: null,
                },
                error: null,
                required: (value) => !!value || 'Required',
                dialog: false,
                dataSong: null,
                genres: [
                    {
                        title: 'Art (classical)',
                        subactive: false,
                        subgenres: [
                            "Andalusian classical",
                            "Indian classical",
                            "Korean court",
                            "Persian classical",
                        ]
                    },
                    {
                        title: 'Avant-garde and experimental',
                        subactive: false,
                        subgenres: [
                            "Danger music",
                            "Electroacoustic",
                            "Lo-fi",
                            "Musique concr??te",
                            "Noise",
                            "Outsider music",
                            "Industrial music",
                            "Progressive music",
                        ]
                    }
                ],
                opened: false,
            }
            
        },
        created() {
        },
        methods: {
            async createSong() {
                console.log('al')
                const resToken = await fetch('http://localhost:3001/refresh-token', {
                method: 'GET',
                credentials: "include"
                })

                const {token} = await resToken.json()
                this.error = null

                const reqSong = {
                    artistName: this.song.artist,
                    songName: this.song.title
                }
                console.log(reqSong)

                //SONG DATA YT API
                try {
                    const songResult = await fetch('http://localhost:3001/createdSongInfo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': "application/json",
                            Authorization: "Bearer " + token,
                        },
                        body: JSON.stringify(reqSong)
                    })
                    this.dataSong = await songResult.json()
                } catch (err) {
                    console.log(console.error())
                }

                if(this.dataSong != null) {
                    // const areAllFieldsFilledIn = Object
                    // .keys(this.song)
                    // .every(key => !!this.song[key])

                    // if (!areAllFieldsFilledIn) {
                    //     this.error = 'Please fill in all the required fields.'
                    //     this.dialog = true
                    //     return
                    // } else {

                    //     //Autofill some fields with the info retrieved from API
                    //     this.song.title = this.songData.firstVideoSelectedData.snippet.title
                    //     this.song.artist = this.songData.channelData.snippet.title
                    //     this.song.youtubeId = this.songData.channelData.id
                    //     this.song.albumImageUrl = this.songData.firstVideoSelectedData.snippet.thumbnails.high.url
                    //     this.song.subscriberCount = this.songData.channelData.statistics.subscriberCount
                    //     this.song.videoCount = this.songData.channelData.statistics.videoCount
                    //     this.song.viewCount = this.songData.channelData.statistics.viewCount

                    //     //Call api to create song.
                    //     try {
                    //         await SongsService.post(this.song)
                    //         this.$router.push({
                    //             name: 'songs'
                    //         })
                    //     } catch(err) {
                    //         console.log(err)
                    //     }
                    // }


                    //Autofill some fields with the info retrieved from API
                    this.song.youtubeChannelId = this.dataSong.channelData.id
                    this.song.albumImageUrl = this.dataSong.firstVideoSelectedData.snippet.thumbnails.high.url
                    this.song.subscriberCount = this.dataSong.channelData.statistics.subscriberCount
                    this.song.videoCount = this.dataSong.channelData.statistics.videoCount
                    this.song.viewCount = this.dataSong.channelData.statistics.viewCount
                    this.song.youtubeVideoId = this.dataSong.firstVideoSelectedData.id.videoId

                    try {
                        const res = await fetch('http://localhost:3001/songs', {
                            method: 'POST',
                            headers: {
                                'Content-Type': "application/json",
                                Authorization: "Bearer " + token,
                            },
                            body: JSON.stringify(this.song)
                        })

                        const data = await res.json()
                        console.log(data)

                        this.$router.push({
                            name: 'songs'
                        })
                    } catch(err) {
                        console.log(err)
                    }
                    //Call api to create song.
                } else {
                    console.log('ERROR')
                }
            },
            closeOther(val, items) {
                items.forEach((x, i) => {
                    if(val.subgenres != i) x.subactive = false
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
.marginPanel {
    margin-left: -15px;
}
</style>