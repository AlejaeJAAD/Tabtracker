<template>
    <v-row style="margin: 1rem">
        <v-card style="padding: 10px" elevation="3">
            <v-form>
                <v-row>
                    <v-col cols="12">
                        <v-row>
                            <v-col cols="4">
                                <v-row class="bgImg">
                                    <v-col cols="10">
                                        <v-img
                                            class="mx-auto"
                                            :src="imagen"
                                            height="100%"
                                            width="100%"
                                            style="border-radius: 15px;">
                                        </v-img>
                                    </v-col>
                                    <v-col cols="10">
                                        <image-handler single :disabled="!editable" v-model="image"></image-handler>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-divider vertical></v-divider>
                            <v-col cols="8">
                                <v-card>
                                    <v-row no-gutters>
                                        <v-col cols="12">
                                            <v-card-title>Personal Information</v-card-title>
                                        </v-col>
                                        <v-row>
                                            <v-col cols="12" md="6">
                                                <v-text-field label="Nombre(s)" solo :readonly="!editable" v-model="user.firstName" append-icon="mdi-rename-box"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-text-field label="Apellido(s)" solo :readonly="!editable" v-model="user.lastName" append-icon="mdi-rename-box"></v-text-field>
                                            </v-col>
                                                <v-col cols="12" md="4">
                                            <v-text-field label="Email" solo :readonly="!editable" v-model="user.email" append-icon="mdi-email"> </v-text-field>
                                                </v-col>
                                            <v-col cols="12" md="2" offset-md="2">
                                                <v-text-field label="Phone number" solo type="number" :readonly="!editable" v-model.number="user.phone" append-icon="mdi-cellphone"></v-text-field>
                                            </v-col> 
                                            <v-col cols="12" md="5">
                                            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="user.birthDate" transition="scale-transition" offset-y disabled min-width="290px">
                                                <template v-slot:activator="{ on }">
                                                <v-text-field v-model="user.birthDate" label="Fecha De Nacimiento" readonly solo-inverted v-on="on"> </v-text-field>
                                                </template>
                                                <v-date-picker v-model="user.birthDate" no-title scrollable locale="es" append-icon="mdi-calendar">
                                                <v-spacer></v-spacer>
                                                <v-btn text color="red" @click="menu = false">Cancelar</v-btn>
                                                <v-btn text color="green" @click="$refs.menu.save(user.birthDate)">Ok </v-btn>
                                                </v-date-picker>
                                            </v-menu>
                                            </v-col>
                                        </v-row>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                    <v-col cols="12">
                        <v-row>
                            <v-col cols="12">
                                <v-card>
                                    <v-row no-gutters>
                                        <v-col cols="12">
                                            <v-card-title>General Information</v-card-title>
                                        </v-col>
                                        <v-row>
                                            <v-col cols="12" md="4">
                                                <v-autocomplete
                                                    solo
                                                    :readonly="!editable"
                                                    v-model="user.country"
                                                    :items="countries"
                                                    label="Country"
                                                ></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-text-field
                                                    label="State"
                                                    solo
                                                    :readonly="sinCP"
                                                    v-model="user.state"
                                                    append-icon="mdi-sign-real-estate">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-text-field
                                                    label="City"
                                                    solo
                                                    :readonly="sinCP"
                                                    v-model="user.city" 
                                                    append-icon="mdi-city">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="3" md="3">
                                                <v-select
                                                    solo 
                                                    :readonly="sinCP" 
                                                    :items="suburbs" 
                                                    :value="suburb" 
                                                    label="Suburb" 
                                                    v-model="suburb"
                                                    item-text="Colonia"
                                                    item-value="cp"
                                                    append-icon="mdi-home-group">
                                                </v-select>
                                            </v-col>
                                            <v-col cols="3" md="3" offset="6">
                                                <v-text-field
                                                    @click:append="verificarCP" 
                                                    type="number" 
                                                    solo 
                                                    :readonly="!editable"
                                                    label="Codigo Postal"
                                                    :append-icon="icono"
                                                    v-model.number="user.postalCode"
                                                    hint="You can edit you General Info when you verified the Postal Code"
                                                    persistent-hint
                                                    :color="color">
                                                </v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="orange" v-if="!editable" class="white--text" @click="editable = !editable">Editar </v-btn>
                            <v-btn color="red" class="white--text" v-if="editable" @click="cancelar">Cancelar </v-btn>
                            <v-btn color="green" class="white--text" v-if="editable" @click="actualizar">Actualizar </v-btn>
                        </v-card-actions>
                        <v-dialog v-model="dialog" max-width="290">
                            <v-card>
                            <v-card-title class="text-h5">
                                <v-icon>mdi-alert-circle</v-icon>
                            </v-card-title>
                            <v-card-text>
                                La informacion del usuario ha sido actualizada.
                            </v-card-text>
                            </v-card>
                        </v-dialog>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
    </v-row>
</template>

<script>
    import Axios from 'axios'
    import ImageHandler from "@/components/Global/ImageHandler"
    import {uploadFile} from '@/services/firebase'
    export default {
        components: { ImageHandler },
        props: ["userData"],
        data() {
            return {
                suburb: '',
                suburbs: [],
                color: "primary",
                editable: false,
                user: '',
                color: "primmary",
                icono: "mdi-check",
                menu: false,
                dialog: false,
                image: [],
                imagen: '',
                countries: ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua &amp; Barbuda', 'Argentina',
                'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus',
                'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia &amp; Herzegovina', 'Botswana', 'Brazil',
                'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde',
                'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia',
                'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
                'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland',
                'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece',
                'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras',
                'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy',
                'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon',
                'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi',
                'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
                'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia',
                'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea',
                'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda',
                'Saint Pierre &amp; Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
                'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka',
                'St Kitts &amp; Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland',
                'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', `Timor L'Este`, 'Togo', 'Tonga', 'Trinidad &amp; Tobago',
                'Tunisia', 'Turkey', 'Turkmenistan', 'Turks &amp; Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
                'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'],
                sinCP: true,
            }
        },
        mounted() {
            console.log(this.userData)
            this.user = this.userData.user
            this.castUser()
            this.validateCurp()
        },
        watch: {
            image() {
                console.log(this.image)
                if (this.image) {
                    try {
                    const image = this.image
                    const lector = new FileReader();
                    lector.readAsDataURL(image);
                    lector.onload = event => {
                        this.imagen = event.target.result;
                    };
                    } catch (e) {
                    Error(e);
                    }
                }
            }
        },
        methods: {
            castUser() {
                if (this.user.fileURL != null) {
                    this.imagen = this.user.fileURL
                } else {
                    this.imagen = ''
                    this.image = []
                }
            },
            actualizar() {
                console.log('Actualizar...')
            },
            cancelar() {
                this.castUser();
                this.editable = false;
            },
            verificarCP() {
                return Axios.post(
                    "https://api.copomex.com/query/info_cp/"+this.user.postalCode+"?token=3f0e1a57-7c0d-43c3-98ba-63b0b86a5706")
                    .then(res => {
                        console.log(res.data);
                        this.suburbs = [];
                        for (let i = 0; i < res.data.length; i++) {
                             const info = res.data[i].response;
                             this.city = info.ciudad;
                             this.state = info.estado;
                             this.suburb = res.data[0].response.asentamiento
                             this.suburbs.push(info.asentamiento)
                        }
                             this.sinCP = false
                    })
            },
            validateCurp() {
                const key = '3eee6686-9be1-469f-9d71-35b9a95547d8'
                const curp = 'AADJ970819HSLNMS06'
                fetch(`https://api.valida-curp.com.mx/curp/obtener_datos/?token=${key}&curp=${curp}`)
                    .then(function (res) {
                        return res.json()
                    })
                    .then(function(data) {
                        console.log(data)
                    });
            }
        }
    }
</script>

<style lang="scss" scoped>
.bgImg {
  justify-content: space-around;
  margin-bottom: 0.1rem
}
</style>