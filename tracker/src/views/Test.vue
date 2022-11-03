<template>
  <v-container class="bg01" fill-height>
    <v-row justify="space-around">
      <v-col cols="6">
        <v-row class="">
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
      <v-col cols="6">
        <v-row>
          <v-col cols="12">
            <v-card color="#080606" height="vh">
              <h3>Other stuff</h3>
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
                message: ''
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
          }
        }
    }
</script>

<style lang="scss" scoped>
.bg01 {    
  background-color: #464646;
}
.bg02 {
 background-color: #080606; 
}
.bg03 {
  background-color: #131313
}

</style>