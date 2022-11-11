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

    <v-row justify="center">
      <v-col cols="12">
        <v-row no-gutters>
          <v-col cols="6">
            <v-card ref="form">
              <v-card-text>
                <v-row justify="center">
                  <v-col cols="11">
                    <v-card-title primary-title class="justify-left cardTitle01">
                      General Information
                    </v-card-title>
                  </v-col>
                  <v-col cols="5">
                    <!-- //FIRSTNAME -->
                    <v-text-field 
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
                      v-model="user.lastName"
                      :rules="[() => !!user.lastName || 'This field is required']"
                      :error-messages="errorMessages"
                      label="Last Name"
                      placeholder="My Last Name"
                      required
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="10">
                    <!-- //NICKNAME -->
                    <v-text-field 
                      v-model="user.nickname"
                      :rules="[() => !!user.nickname || 'This field is required']"
                      :error-messages="errorMessages"
                      label="Nickname"
                      placeholder="Nick001"
                      required
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="10">
                    <!-- //ROLE -->
                    <v-text-field
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

          <v-col>
            <v-card class="rightFormCard white--text">
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

                  <v-col cols="10">
                    <!-- //COUNTRY -->
                    <v-autocomplete
                      dark
                      v-model="user.country"
                      :rules="[() => !!user.country || 'This field is required']"
                      :items="countries"
                      label="Country"
                      placeholder="Select..."
                      required
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="10">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          dark
                          v-model="date"
                          label="Birthday date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        color="rgba(74,52,212,255)"
                        v-model="date"
                        :active-picker.sync="activePicker"
                        :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                        min="1950-01-01"
                        @change="save"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-card-text>
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
                containsImage: false,
                upload: false,
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
          }
        },
        methods: {
          fileInput(file) {
            if(file != null) {
              this.containsImage = true
              this.fileUrl = URL.createObjectURL(file)
            } else {
              this.fileUrl = null
              this.containsImage = false
            }
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
          save (date) {
            this.$refs.menu.save(date)
          },
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
</style>