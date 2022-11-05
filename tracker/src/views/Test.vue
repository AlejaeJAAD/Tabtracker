<template>
  <v-container class="bg01" style="padding: 1rem 0 1rem 0.3rem">
    <v-row justify="space-around" no-gutters>
      <v-col cols="5">
        <v-row>
          <v-col cols="12">
            <v-card class="bg03">
              <v-row style="padding: 2rem">
                <v-col cols="12" class="mt-12 pt-md-6" align="center">
                  <h2 class="title" style="color: #e2640f">Image Handler</h2>
                </v-col>
                <v-col cols="12" align="center" class="title white--text">
                  <v-file-input
                    show-size
                    color="#e2640f"
                    v-model="myFile"
                    outlined
                    accept="image/png, image/jpeg"
                    label="Image input"
                    prepend-icon="mdi-image"
                    @change="fileInput"
                    :disabled="processing"
                  >
                  <template v-slot:selection="{ text }">
                    <v-chip
                      color="#e2640f"
                      label
                      small
                    >
                      {{ text }}
                    </v-chip>
                  </template>
                    <template v-slot:append-outer>
                      <v-progress-circular
                        v-if="processing"
                        color="grey"
                        indeterminate
                        small
                      />
                    </template>
                  </v-file-input>
                </v-col>
                <v-col cols="12">
                  <v-row justify="center" align="center">
                    <v-col cols="8">
                      <v-img :src="fileUrl" contain v-if="fileUrl" max-height="750"></v-img>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" justify="center" align="center">
                  <v-btn block color="#e2640f" outlined @click="uploadImage(myFile)">Upload image</v-btn>
                </v-col>
                <v-col v-if="message">
                  <h2>{{message}}</h2>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="7">
        <v-row>
          <v-col cols="12">
            <v-card color="#080606" height="90vh" style="margin: 0 0.3rem -0.7rem 1rem">
              <v-row justify="center">
                <v-col cols="10">
                  <template v-for="songs in getSongs">
                    <v-card v-for="song in songs" :key="song._id" style="padding: 1rem" color="transparent" class="white--text">
                      <h3>
                        Song name: {{song.title}} <br>
                        Artist name: {{song.artist}}
                      </h3>
                    </v-card>
                  </template>
                  <v-divider></v-divider>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="space-around" no-gutters>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <v-card class="bg04">
              <v-row style="padding: 2rem">
                  <v-col cols="12" class="mt-12 pt-md-6" align="center">
                    <h3>Search song</h3>
                    <v-text-field dark v-model="songName" solo placeholder="Enter song name" label="Song Name">
                    </v-text-field>
                    <v-btn black outlined @click="searchSong(songName)">Search song</v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-card v-for="query in getQuery" :key="query._id">
                      {{query}}
                    </v-card>
                  </v-col>
                </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import {uploadFile} from '../services/firebase'
    export default {
        data() {
            return {
                myFile: null,
                processing: false,
                fileUrl: null,
                upload: false,
                message: '',
                songName: ''
            }
        },
        mounted () {
          this.$nextTick(() => {
            this.$store.dispatch('getRefreshToken')
            this.$store.dispatch('getAllsongs')
            setInterval(() => {
              this.$store.dispatch('getRefreshToken')
              this.$store.dispatch('getAllsongs')
              console.log('Test')
            }, 20 * 1000);
          })
        },
        computed: {
          getSongs() {
            return this.$store.state.allSongs || []
          },
          getQuery() {
            return this.$store.state.queryData
          }
        },
        methods: {
          fileInput(file) {
            this.fileUrl = URL.createObjectURL(file)
          },
          async uploadImage(file) {
            this.processing = true
            try {
              const imageURL = await uploadFile(file)
              if(imageURL) {
                this.processing = false
                this.fileURL = imageURL.fileURL
                this.message = imageURL.message
                this.myFile = null
                setTimeout(() => {
                  this.message = ''
                }, 1000);
              }
            } catch (e) {
              console.error(e);
            } finally {
              this.processing = false;
            }
          },
          async searchSong(query) {
            try {
              await this.$store.dispatch('getQueryData', query)
            } catch (err) {
              console.log(err)
            }
          }
        }
    }
</script>

<style lang="scss" scoped>
.bg01 {    
  background-color: #464646;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.bg02 {
 background-color: #080606; 
}
.bg03 {
  background-color: #131313;
  margin: 1.7rem 0 0 0
}
.bg04 {
  background-color: #131313;
  margin: 1.7rem 0.3rem 0 0
}

</style>