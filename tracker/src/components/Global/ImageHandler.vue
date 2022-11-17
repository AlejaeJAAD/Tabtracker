<template>
    <v-row>
        <v-col cols="12" >
            <v-file-input
            small
            dense
            solo
            show-size
            color="black"
            v-model="myFile"
            outlined
            accept="image/png, image/jpeg"
            label="Image input"
            prepend-icon="mdi-image"
            @change="uploadImage"
            :disabled="processing"
            >
            <!-- @change="fileInput" -->
            <template v-slot:selection="{ text }">
                <v-chip
                color="black"
                label
                x-small
                outlined
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
    </v-row>
  </template>
  
  <script>
  export default {
    props: {
      single: Boolean,
      iStyles: Array,
      disabled: Boolean,
      uploading: Boolean
    },
    name: "ImageHandler",
    data() {
      return {
        errors: [],
        myFile: null,
        processing: false,
      };
    },
    methods: {
        async uploadImage(file) {
            // this.processing = true
            // try {
            //     const imageURL = await uploadFile(file)
            //     if(imageURL) {
            //         this.processing = false
            //         this.myFile = imageURL.fileURL
            //         this.message = imageURL.message
            //         setTimeout(() => {
            //         this.message = ''
            //         }, 1000);
            //     }
            // } catch (e) {
            //     console.error(e);
            // } finally {
            //     this.processing = false;
            // }
            this.filesChanged()
        },
        filesChanged() {
            this.$emit("input", this.myFile);
        }
    },
    created() {}
  };
  </script>
  
  <style scoped></style>