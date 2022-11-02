<template>
    <v-container>
    <v-row>
      <v-col cols="12" class="mt-12 pt-md-6" align="center">
        <span class="title font-weight-black">Image Handler</span>
      </v-col>
      <v-col cols="12" class="mt-12" align="center">
        <v-file-input
          v-model="myFile"
          outlined
          accept="image/png, image/jpeg"
          placeholder="Click to upload file"
          @change="fileInput"
          :disabled="processing"
        >
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
      <v-col cols="12" align="center">
        <v-img :src="fileUrl" contain v-if="fileUrl" max-height="500"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import firebase from 'firebase/app'
    import 'firebase/storage';
    export default {
        data() {
            return {
                myFile: null,
                processing: false,
                fileUrl: null,
            }
        },
        methods: {
          previewImage(event, img) {
            this.uploadValue = 0
            this.picture = null
            this.imageData = event.target.files[0]
          },
          onUpload() {
              this.picture = null
              const storageRef = firebase.storage().ref(`${this.imageData.name}`).put(this.imageData)
              storageRef.on(`state_changed`, snapshot => {
                this.uploadValue = (snapshot.bytesTransferred/snapshot.totalByes)*100
              }, error => {console.log(error.message)},
              () => {this.uploadValue = 100;
              storageRef.snapshot.ref.getDownloadURL().then((url) => {
                this.picture = url
              })
            }
            )
          },
          async fileInput(file) {
            try {
              if (file && file.name) {
                this.processing = true;

                const fr = new FileReader();
                fr.readAsDataURL(file);
                fr.addEventListener("load", () => {
                  // this is to load image on the UI
                  // .. not related to file upload :)
                  this.fileURL = fr.result;
                });
                const imgData = new FormData();
                imgData.append("image", this.myFile);
                const filePath = `mypath/${Date.now()}-${file.name}`;
                const metadata = { contentType: this.myFile.type };

                await storage.ref()
                  .child(filePath)
                  .put(this.myFile, metadata);
                console.log("filePath: ", filePath);
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

</style>