<template>
    <v-row >
        <v-dialog
            v-model="confirmCreateDialog"
            persistent
            width="750px"
        >
            <v-card flat v-if="!submitted" style="padding: 1rem" class="cardStyle">
                <v-form ref="form" lazy-validation>
                    <v-row class="pa-2">
                        <v-col cols="12" style="margin-bottom: -1rem; margin-top: -1rem">
                            <v-card-title>Customer register</v-card-title>
                        </v-col>
                    </v-row>
                    <v-row class="pa-5" style="margin-top: -2rem">
                        <v-col cols="12" style="margin-bottom: -1.5rem">
                            <v-text-field
                                :style="setColor()"
                                :color="textFieldColor"
                                class="textFieldColor"
                                outlined
                                dense
                                v-model="customer.company_name"
                                :rules="[(v) => !!v || 'Company name is required']"
                                label="Company name"
                                required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="6" style="margin-bottom: -1.5rem">
                            <v-text-field
                                :style="setColor()"
                                :color="textFieldColor"
                                class="textFieldColor"
                                outlined
                                dense
                                v-model="customer.contact_name"
                                :rules="[(v) => !!v || 'Contact name is required']"
                                label="Contact name"
                                required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="6" style="margin-bottom: -1.5rem">
                            <v-text-field
                                :style="setColor()"
                                :color="textFieldColor"
                                class="textFieldColor"
                                outlined
                                dense
                                v-model="customer.contact_role"
                                :rules="[(v) => !!v || 'Contact role is required']"
                                label="Contact role"
                                required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" style="margin-bottom: -1.5rem">
                            <v-text-field
                                :style="setColor()"
                                :color="textFieldColor"
                                class="textFieldColor"
                                outlined
                                dense
                                v-model="customer.address"
                                :rules="[(v) => !!v || 'Address is required']"
                                label="Address"
                                required
                            ></v-text-field>
                        </v-col>

                        <!-- //Country -->
                        <v-col cols="6" style="margin-bottom: -1.5rem">
                            <v-text-field
                                :style="setColor()"
                                :color="textFieldColor"
                                class="textFieldColor"
                                outlined
                                dense
                                v-model="customer.country"
                                :rules="[(v) => !!v || 'Country is required']"
                                label="Country"
                                required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="6" style="margin-bottom: -1.5rem">
                            <v-text-field
                                :style="setColor()"
                                :color="textFieldColor"
                                class="textFieldColor"
                                outlined
                                dense
                                v-model="customer.state"
                                :rules="[(v) => !!v || 'State is required']"
                                label="State"
                                required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="6" style="margin-bottom: -1.5rem">
                            <v-text-field
                                :style="setColor()"
                                :color="textFieldColor"
                                class="textFieldColor"
                                outlined
                                dense
                                v-model="customer.city"
                                :rules="[(v) => !!v || 'City is required']"
                                label="City"
                                required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="6" style="margin-bottom: -1.5rem">
                            <v-text-field
                                :style="setColor()"
                                :color="textFieldColor"
                                class="textFieldColor"
                                outlined
                                dense
                                v-model="customer.postalCode"
                                :rules="[(v) => !!v || 'Postal code is required']"
                                label="Postal code"
                                required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="6" style="margin-bottom: -1.5rem">
                            <v-text-field
                                :style="setColor()"
                                :color="textFieldColor"
                                class="textFieldColor"
                                outlined
                                dense
                                v-model="customer.email"
                                :rules="[(v) => !!v || 'Email is required']"
                                label="Email"
                                required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="6" style="margin-bottom: -1.5rem">
                            <v-text-field
                                :style="setColor()"
                                :color="textFieldColor"
                                class="textFieldColor"
                                outlined
                                dense
                                v-model="customer.phone"
                                :rules="[(v) => !!v || 'Phone is required']"
                                label="Phone"
                                required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="6" style="margin-bottom: -1.5rem">
                            <v-text-field
                                :style="setColor()"
                                :color="textFieldColor"
                                class="textFieldColor"
                                outlined
                                dense
                                v-model="customer.password"
                                :rules="[(v) => !!v || 'Password is required']"
                                label="Password"
                                required
                            ></v-text-field>
                        </v-col>
                        
                        <v-col cols="6" style="margin-bottom: -1.5rem">
                            <v-text-field
                                :style="setColor()"
                                :color="textFieldColor"
                                class="textFieldColor"
                                outlined
                                dense
                                v-model="confirmPassword"
                                :rules="[(v) => !!v || 'Confirm password is required']"
                                label="Confirm password"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="pr-5 pl-5">
                        <v-col cols="10">
                            <v-btn outlined block @click="newCustomer">Register customer</v-btn>
                        </v-col>
    
                        <v-col cols="2">
                            <v-btn outlined dark block color="error" @click="closeDialog">Cancel</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>

            <v-card flat v-else class="mx-auto">
                <v-card-title>
                    New customer added successfully!
                </v-card-title>

                <v-card-subtitle>
                    Click the button to add a new customer.
                </v-card-subtitle>

                <v-card-actions>
                    <v-btn color="success" @click="addOtherCustomer">Add other customer</v-btn>
                    <v-btn color="primary" @click="closeDialog">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
    export default {
        props: ['confirmCreateDialog'],
        data () {
            return {
                customer: {},
                submitted: false,
                confirmPassword: '',
                textFieldColor: ''
            }
        },
        computed: {
            setColor() {
                return () => {
                    if(this.$vuetify.theme.dark) {
                        this.textFieldColor = 'orange'
                    } else {
                        this.textFieldColor = 'red'
                    }
                    return {
                        '--textField-color': this.textFieldColor,
                    }
                }
            }
        },
        methods: {
            closeDialog (event) {
                this.$emit('closeDialog', false);
            },
            async newCustomer() {
                const res = await fetch('http://localhost:3001/customers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify(this.customer)
                })

                const result = await res.json()
                console.log(result)

                this.submitted = true;
            },
            addOtherCustomer() {
                this.submitted = false
            },
        },
    }
</script>

<style lang="scss" scoped>
.cardStyle {
    padding: 1rem;
    border-width: 3px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.289);
}
.textFieldColor {
    cursor: pointer;
    font-weight: bolder;
    color: var(----textField-color);
}
</style>