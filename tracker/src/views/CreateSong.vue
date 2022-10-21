<template>
    <div>
        <Nav :color="color" style="margin-top: 2rem" />
        <v-row justify="center">
            <v-col cols="4" >
                <panel title="Song Metadata" color="rgb(22, 33, 62)" class="fill-height">
                    <!-- Title -->
                    <v-text-field
                        label="Title"
                        required
                        :rules="[required]"
                        v-model="song.title">
                    </v-text-field>

                    <!-- Artist -->
                    <v-text-field
                        label="Artist"
                        v-model="song.artist">
                    </v-text-field>

                    <!-- Genre -->
                    <v-text-field
                        label="Genre"
                        v-model="song.genre">
                    </v-text-field>

                    <!-- Album -->
                    <v-text-field
                        label="Album"
                        v-model="song.album">
                    </v-text-field>

                    <!-- Album Image Url -->
                    <v-text-field
                        label="Album Image Url"
                        v-model="song.albumImageUrl">
                    </v-text-field>

                    <!-- Youtube ID -->
                    <v-text-field
                        label="Youtube ID"
                        v-model="song.youtubeId">
                    </v-text-field>
                </panel>
            </v-col>

            <v-col cols="7">
                <panel title="Song Structure" color="rgb(22, 33, 62)" class="marginPanel fill-height">
                    <!-- Tab -->
                    <v-textarea
                        label="Tab"
                        multi-line
                        v-model="song.tab">
                    </v-textarea>

                    <!-- Lyrics -->
                    <v-textarea
                        label="Lyrics"
                        multi-line
                        v-model="song.lyrics">
                    </v-textarea>
                </panel>

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
        </v-row>
    </div>
</template>

<script>
    import Nav from '../components/Global/Nav.vue';
    import Panel from '@/components/Songs/Panel.vue'
    import SongsService from '@/services/SongsService';
    export default {
        data () {
            return {
                color: 'rgb(233, 69, 96)',
                song: {
                    title: null,
                    artist: null,
                    genre: null,
                    album: null,
                    albumImageUrl: null,
                    youtubeId: null,
                    lyrics: null,
                    tab: null
                },
                required: (value) => !!value || 'Required'
            }
        },
        methods: {
            async createSong() {
                //Call api to create song.
                try {
                    await SongsService.post(this.song)
                    this.$router.push({
                        name: 'songs'
                    })
                } catch(err) {
                    console.log(err)
                }
            }
        },
        components: {
            Nav, Panel
        }
    }
</script>

<style lang="scss" scoped>
.marginPanel {
    margin-left: -15px;
}
</style>