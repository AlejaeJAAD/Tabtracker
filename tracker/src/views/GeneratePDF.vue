<template>
    <v-row>
        <v-col cols="12">
            <v-btn color="success" @click="generatePDF">Generate PDF</v-btn>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
            async generatePDF() {
                const pdfResult = await fetch('http://localhost:3001/generatePDF', {
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(reqSong)
                })
                this.pdfData = await pdfResult.json()
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>