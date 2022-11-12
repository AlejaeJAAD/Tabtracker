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
                    <v-col cols="10">
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
              <v-row style="padding: 2rem" no-gutters>
                <v-col cols="12">
                  <v-row justify="center" style="margin-bottom: -3rem">
                    <v-col class="text-center" cols="5">
                      <v-text-field outlined color="white" dark v-model="songName" solo placeholder="Write the song name" label="Song name">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col cols="5" align="center">
                      <v-btn class="white--text" black outlined @click="searchSong(songName)">Search song</v-btn>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col cols="5" v-if="resultFromQuery != null">
                      <v-sheet outlined color="#464646" rounded>
                        <v-card v-for="query in getQuery" :key="query._id" style="padding: 1rem; margin: 0.1rem" color="black" class="white--text" outlined elevation="1">
                          {{query.artist}} - {{query.title}}
                        </v-card>
                      </v-sheet>
                    </v-col>
                    <v-col cols="7" v-if="resultFromQueryError" class="text-center">
                      <div>
                        <v-alert color="white" icon="mdi-alert" outlined border="left" class="pre-formatted">
                          {{errorMessage}}
                        </v-alert>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row justify="center" no-gutters>
      <v-col cols="6">
        <v-card ref="form" tile flat height="100%" class="rounded-lg">
          <v-card-text>
            <v-row justify="center">
              <v-col cols="11">
                <v-card-title primary-title class="justify-left cardTitle01">
                  General Information
                </v-card-title>
              </v-col>
              <!-- //IMAGE -->
              <v-col cols="10">
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
                  @change="fileInput"
                  :disabled="processing"
                >
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

              <v-col cols="5">
                <!-- //FIRSTNAME -->
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

              <v-col cols="5">
                <!-- //LASTNAME -->
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

              <!-- //BIRTHDAY -->
              <v-col cols="10">
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

              <v-col cols="7">
                <!-- //NICKNAME -->
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

              <v-col cols="3">
                <!-- //ROLE -->
                <v-text-field
                  dense
                  solo
                  v-model="user.role"
                  label="Role"
                  disabled
                >
                </v-text-field>
              </v-col>

              <!-- //EMAIL -->
              <v-col cols="10">
                <v-text-field 
                  dense
                  solo
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
              <v-col cols="10">
                <v-text-field
                  dense
                  solo
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
              <v-col cols="10">
                <!-- //PHONE -->
                <v-text-field 
                  dense
                  dark
                  v-model="user.phone"
                  :rules="[() => !!user.phone || 'This field is required']"
                  :error-messages="errorMessages"
                  label="Phone Number"
                  placeholder="00 11 22 33 44"
                  required
                >
                </v-text-field>
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
                myFile: null,
                processing: false,
                fileUrl: null,
                containsImage: false,
                upload: false,
                error: '',
                message: '',
                songName: '',
                errorMessage: "We couldn't find a song with that name registered\nWrite the song name again",
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
          menu (val) {
            val && setTimeout(() => (this.activePicker = 'YEAR'))
          },
        },
        mounted () {
          this.$nextTick(() => {
            this.$store.dispatch('getRefreshToken')
            this.$store.dispatch('getAllsongs')
            setInterval(() => {
              this.$store.dispatch('getRefreshToken')
              this.$store.dispatch('getAllsongs')
            }, 20 * 1000);
          })
        },
        computed: {
          getSongs() {
            return this.$store.state.allSongs || []
          },
          getQuery() {
            return this.$store.state.queryData
          },
          computedDateFormattedMomentjs () {
            return this.date ? moment(this.date).format('dddd, MMMM Do YYYY') : ''
          },
        },
        methods: {
          fileInput(file) {
              if(file != null) {
                    this.containsImage = true
                    this.user.fileURL = URL.createObjectURL(file)
              } else {
                    this.user.fileURL = null
                    this.containsImage = false
              }
          },
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
          async searchSong(query) {
            try {
              await this.$store.dispatch('getQueryData', query)
              setTimeout(() => {
                this.resultFromQuery = this.$store.state.queryData
                if(!this.resultFromQuery) {
                  this.resultFromQueryError = true
                } else {
                  this.resultFromQueryError = false
                }
              }, 500)
            } catch (err) {
              console.log(err)
            }
          },
          async register () {
              this.uploadImage(this.myFile)
              try {
                  console.log(this.user)
                  const response = await AuthenticationService.register(this.user)
                  console.log(response)

                  this.$router.push({
                  name: 'tabtrackerlogin'
                  })
              } catch (error) {
                  //this.error = error.response.data.error
                  console.log('error')
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