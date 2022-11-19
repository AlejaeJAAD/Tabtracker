<template>
    <v-container>
        <v-row justify="center" no-gutters style="margin: 4rem 0 1rem 0">
            <v-col cols="6">
                <v-card ref="form" tile flat height="100%" class="rounded-lg" elevation="5">
                <v-card-text>
                    <v-row justify="center">
                        <v-col cols="11">
                            <v-card-title primary-title class="justify-left cardTitle01">
                            General Information
                            </v-card-title>
                        </v-col>
                        <!-- //IMAGE -->
                        <v-col cols="10" >
                            <v-file-input
                            dense
                            solo
                            show-size
                            color="black"
                            v-model="myFile"
                            outlined
                            accept="image/png, image/jpeg"
                            label="Image input"
                            prepend-icon="mdi-image"
                            :disabled="processing"
                            >
                            <!-- @change="fileInput" -->
                            <template v-slot:selection="{ text }">
                                <v-chip
                                color="black"
                                label
                                small
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
                            <v-row justify="center" align="center">
                            <v-col cols="10">
                                <v-img :src="user.fileURL" contain v-if="user.fileURL" max-height="185"></v-img>
                            </v-col>
                            </v-row>
                        </v-col>

                        <!-- //FIRSTNAME -->
                        <v-col cols="5" style="margin-bottom: -1.8rem">
                            <v-text-field
                            dense
                            solo
                            v-model="user.firstName"
                            :rules="[() => !!user.firstName || 'This field is required']"
                            :error-messages="errorMessages"
                            label="First Name"
                            placeholder="My First Name"
                            required
                            >
                            </v-text-field>
                        </v-col>

                        <!-- //LASTNAME -->
                        <v-col cols="5" style="margin-bottom: -0.5rem">
                            <v-text-field 
                            dense
                            solo
                            v-model="user.lastName"
                            :rules="[() => !!user.lastName || 'This field is required']"
                            :error-messages="errorMessages"
                            label="Last Name"
                            placeholder="My Last Name"
                            required
                            >
                            </v-text-field>
                        </v-col>

                        <v-col cols="10" style="margin-bottom: -1.5rem">
                        <!-- //PHONE -->
                            <v-text-field 
                            dense
                            solo
                            v-model="user.phone"
                            :rules="[() => !!user.phone || 'This field is required']"
                            :error-messages="errorMessages"
                            label="Phone Number"
                            placeholder="00 11 22 33 44"
                            required
                            >
                            </v-text-field>
                        </v-col>

                        <!-- //BIRTHDAY -->
                        <v-col cols="10" style="margin-bottom: -0.5rem">
                            <v-menu
                            dense
                            solo
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                            >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                v-model="user.birthDate"
                                :value="computedDateFormattedMomentjs"
                                clearable
                                label="Birthdate"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                @click:clear="date = null"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                elevation="4"
                                color="rgba(74,52,212,255)"
                                v-model="user.birthDate"
                                :active-picker.sync="activePicker"
                                :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                min="1950-01-01"
                                @change="save"
                            ></v-date-picker>
                            </v-menu>
                        </v-col>

                        <!-- //NICKNAME -->
                        <v-col cols="7" style="margin-bottom: -0.5rem">
                            <v-text-field 
                            dense
                            solo
                            v-model="user.nickName"
                            :rules="[() => !!user.nickName || 'This field is required']"
                            :error-messages="errorMessages"
                            label="Nickname"
                            placeholder="Nick001"
                            required
                            >
                            </v-text-field>
                        </v-col>

                        <!-- //ROLE -->
                        <v-col cols="3" style="margin-bottom: -0.5rem">
                            <v-text-field
                            dense
                            solo
                            v-model="user.role"
                            label="Role"
                            disabled
                            >
                            </v-text-field>
                        </v-col>

                    </v-row>
                </v-card-text>
                </v-card>
            </v-col>

            <v-col cols=6>
                <v-card class="rightFormCard rounded-lg white--text" tile flat height="100%">
                <v-card-text>
                    <v-row justify="center">
                        <v-col cols="11">
                            <v-card-title primary-title class="justify-left cardTitle02">
                            Personal Information
                            </v-card-title>
                        </v-col>

                        <v-col cols="5">
                            <!-- //CITY -->
                            <v-text-field
                            dense
                            dark
                            v-model="user.city"
                            :rules="[() => !!user.city || 'This field is required']"
                            :error-messages="errorMessages"
                            label="City"
                            placeholder="City001"
                            required
                            >
                            </v-text-field>
                        </v-col>

                        <v-col cols="5">
                            <!-- //STATE -->
                            <v-text-field
                            dense
                            dark
                            v-model="user.state"
                            :rules="[() => !!user.state || 'This field is required']"
                            :error-messages="errorMessages"
                            label="State"
                            placeholder="State001"
                            required
                            >
                            </v-text-field>
                        </v-col>

                        <v-col cols="7">
                            <!-- //COUNTRY -->
                            <v-autocomplete
                            dense
                            dark
                            v-model="user.country"
                            :rules="[() => !!user.country || 'This field is required']"
                            :items="countries"
                            label="Country"
                            placeholder="Select..."
                            required
                            ></v-autocomplete>
                        </v-col>

                        <v-col cols="3">
                            <v-text-field
                            dense
                            dark
                            v-model="user.postalCode"
                            :rules="[() => !!user.postalCode || 'This field is required']"
                            :error-messages="errorMessages"
                            label="Postal Code"
                            placeholder="Postal Code001"
                            required
                            >
                            </v-text-field>
                        </v-col>
                        
                        <!-- //EMAIL -->
                        <v-col cols="10" style="margin-bottom: -0.5rem">
                            <v-text-field 
                            dense
                            dark
                            v-model="user.email"
                            :rules="[() => !!user.email || 'This field is required']"
                            :error-messages="errorMessages"
                            label="Email"
                            placeholder="email@example.com"
                            required
                            >
                            </v-text-field>
                        </v-col>
                        
                        <!-- //PASSWORD -->
                        <v-col cols="10" style="margin-bottom: -0.5rem">
                            <v-text-field
                            dense
                            dark
                            v-model="user.password"
                            :error-messages="errorMessages"
                            placeholder="examplePassword"
                            :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, rules.min]"
                            :type="show3 ? 'text' : 'password'"
                            name="input-10-2"
                            label="Password"
                            hint="At least 6 characters"
                            class="input-group--focused"
                            @click:append="show3 = !show3"
                            >
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-spacer></v-spacer>
                <v-row class=justifyContent>
                    <v-col cols="2">
                    <v-card-actions>
                        <v-btn
                        dark
                        outlined
                        color="rgb(22, 33, 62)"
                        class="white--text"
                        @click="register"
                        >
                        Register
                        </v-btn>
                    </v-card-actions>
                    </v-col>

                    <v-col cols="12">
                    <v-alert v-if='error'
                        border="right"
                        icon="$mdiVuetify"
                        type="error"
                        v-html="error"
                    >
                    </v-alert>
                    </v-col>
                </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import AuthenticationService from '@/services/AuthenticationService'
    import {uploadFile} from '../services/firebase'
    export default {
        data() {
            return {
                color: 'rgb(233, 69, 96)',
                myFile: null,
                processing: false,
                fileUrl: null,
                containsImage: false,
                upload: false,
                error: '',
                message: '',
                songName: '',
                resultFromQuery: null,
                resultFromQueryError: false,
                user: {
                  fileURL: '',
                  firstName: '',
                  lastName: '',
                  nickName: '',
                  phone: '',
                  city: '',
                  state: '',
                  country: '',
                  postalCode: '',
                  birthDate: '',
                  email: '',
                  password: '',
                  role: 'Normal',
                },
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
                errorMessages: '',
                activePicker: null,
                date: null,
                menu: false,
                rules: {
                  required: value => !!value || 'This field is required',
                  min: v => v.length >= 6 || 'Min 6 characters',
                },
                show3: false,
            }
        },
        watch: {
            email(value) {
                console.log('Email has changed', value)
            },
            menu (val) {
            val && setTimeout(() => (this.activePicker = 'YEAR'))
          },
        },
        computed: {
            computedDateFormattedMomentjs () {
                return this.date ? moment(this.date).format('dddd, MMMM Do YYYY') : ''
          },
        },
        methods: {
            // fileInput(file) {
            //   if(file != null) {
            //         this.containsImage = true
            //         this.user.fileURL = URL.createObjectURL(file)
            //         console.log(this.user.fileURL)
            //   } else {
            //         this.user.fileURL = null
            //         this.containsImage = false
            //   }
            // },
            async uploadImage(file) {
              this.processing = true
              try {
                  const imageURL = await uploadFile(file)
                  if(imageURL) {
                      this.processing = false
                      this.user.fileURL = imageURL.fileURL
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
            async register () {
                await this.uploadImage(this.myFile)
                try {
                    const response = await AuthenticationService.register(this.user)

                    this.$router.push({
                    name: 'tabtrackerlogin'
                    })
                } catch (error) {
                    this.error = error.response.data.error
                }
            },
            save (date) {
                this.$refs.menu.save(date)
            },
        },
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
  margin: 1.7rem 0.3rem -0.7rem 0;
}
.centered-input.v-text-field .v-label {
  left: 50% !important;
  transform: translateX(-50%);
  transform-origin: top 50%;
  &.v-label--active {
    transform: translateY(-18px) scale(.75) translateX(-50%);
  }
}
.pre-formatted {
  white-space: pre;
}

.rightFormCard {
  background-color: rgba(74,52,212,255);
  margin: 0 0.3rem -0.7rem 0
}

.cardTitle01 {
  color: #6996d1;
}

.cardTitle02 {
  color: white;
}

.rounded-card{
    border-radius:50px;
}

.justifyContent {
  justify-content: right;
  margin-right: 6rem
}
</style>