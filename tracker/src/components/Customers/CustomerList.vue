<template>
    <v-card class="mx-auto overflow-hidden" height="100%">
        <Nav />
        <v-row style="margin-top: 2.5rem">
            <v-col cols="12" v-if="loadedData">
                <v-card>
                    <v-card-title>
                        Loading the data
                    </v-card-title>
                </v-card>
            </v-col>
            <v-col cols="12" v-else>
                <v-row class="pr-15 pl-15">
                    <v-col cols="12">
                        <v-card class="cardStyle">
                            <v-row>
                                <v-col cols="6" sm="6">
                                    <v-text-field v-model="company_name" label="Search by company name"></v-text-field>
                                </v-col>
                                
                                <v-col cols="3" class="pt-9">
                                    <v-btn block outlined color="primary" small @click="searchCompanyName">
                                        Search
                                    </v-btn>
                                </v-col>
                                <v-col cols="3" class="pt-9">
                                    <v-btn block outlined color="error" small @click="resetCustomers">
                                        Reset search
                                    </v-btn>
                                </v-col>
                                <v-col cols="2" style="margin-top: -1rem">
                                    <v-btn block outlined color="success" small @click="confirmCreateDialog = true">
                                        Add Customer
                                    </v-btn>
                                </v-col>
                                
                                <v-col cols="12" sm="12">
                                    <v-row>
                                        <v-col cols="4" sm="3">
                                            <v-select
                                                v-model="pageSize"
                                                :items="pageSizes"
                                                label="Customers per page"
                                                @change="handlePageSizeChange"
                                            >
                                            </v-select>
                                        </v-col>
                        
                                        <v-col cols="12" sm="9">
                                            <v-pagination
                                                v-model="page"
                                                :length="totalPages"
                                                total-visible="7"
                                                next-icon="mdi-menu-right"
                                                prev-icon="mdi-menu-left"
                                                @input="handlePageChange"
                                            >
                                            </v-pagination>
                                        </v-col>
                        
                                        <v-col cols="12" class="text-right" style="margin-top: -2rem">
                                            <v-spacer></v-spacer>
                                            <v-btn outlined color="error" small @click="confirmDeleteDialog = true">
                                                Remove All
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                    
                    <v-col cols="12" sm="12" style="padding-bottom: 3rem">
                        <v-card class="mx-auto pa-5 cardStyle" tile>
                            <v-card-title>Customers</v-card-title>
                            
                            <v-data-table
                                class="transparent"
                                :headers="headers"
                                :items="customers"
                                disable-pagination
                                :hide-default-footer="true"
                            >
                                <template v-slot:[`item.edit`]="{ item }">
                                    <v-btn 
                                        small color="orange" outlined
                                        @click="editCustomer(item.id)">
                                        <v-icon>
                                            mdi-account-edit
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <template v-slot:[`item.delete`]="{ item }">
                                    <v-btn 
                                        small color="red" outlined
                                        @click="idOfItemToBeDeleted = item.id;
                                                titleOfItemToBeDeleted = item.company_name;
                                                confirmItemToBeDeletedDialog = true">
                                        <v-icon>
                                            mdi-account-remove
                                        </v-icon>
                                    </v-btn>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>
            
                    <v-dialog width="auto" v-model="confirmDeleteDialog">
                        <v-card class="pa-4">
                            <v-card-title>Are you sure you want to delet all the customers?</v-card-title>
                            <v-card-actions class="justify-center">
                                <v-btn color="success" @click="removeAllCustomers">Yes</v-btn>
                                <v-btn color="error" @click="confirmDeleteDialog = false">No</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
            
                    <v-dialog width="auto" v-model="confirmItemToBeDeletedDialog">
                        <v-card class="text-center" style="padding-bottom: 1.5rem">
                            <v-card-title>Are you sure you want to delete the customer&nbsp;<strong>{{titleOfItemToBeDeleted}}</strong> ?</v-card-title>
                            <v-card-actions>
                                <v-btn color="success" @click="deleteCustomer">Yes</v-btn>
                                <v-btn color="error" @click="confirmItemToBeDeletedDialog = false">No</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
            
                    <AddCustomer v-if="confirmCreateDialog" @closeDialog="getFromChild" :confirmCreateDialog="confirmCreateDialog"/>
                </v-row>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import Nav from '@/components/Global/Nav.vue'
    import AddCustomer from "./AddCustomer.vue";
    import CustomerService from "@/services/CustomerService";
    export default {
        components: { Nav, AddCustomer },
        data () {
            return {
                customers: [],
                company_name: "",
                headers: [
                    { text: "Enrollment", sortable: false, value: "enrollment"},
                    { text: "Company Name", sortable: true, value: "company_name" },
                    { text: "Contact Name", sortable: true, value: "contact_name" },
                    { text: "Phone", sortable: false, value: "phone" },
                    { text: "Email", sortable: true, value: "email" },
                    { text: "Edit", value: "edit", sortable: false },
                    { text: "Delete", value: "delete", sortable: false },
                ],
                page: 1,
                totalPages: 0,
                pageSize: 5,
                pageSizes: [5,10,15],
                idOfItemToBeDeleted: '',
                titleOfItemToBeDeleted: '',
                confirmDeleteDialog: false,
                confirmCreateDialog: false,
                confirmItemToBeDeletedDialog: false,
                watcherActive: false,
                loadedData: true,
            }
        },
        methods: {
            getRequestParams(company_name, page, pageSize) {
                let params = {};

                if (company_name) {
                    params["company_name"] = company_name;
                }

                if (page) {
                    params["page"] = page - 1;
                }

                if (pageSize) {
                    params["size"] = pageSize;
                }

                return params;
            },
            resetCustomers() {
                const params = this.getRequestParams(
                    this.title = '',
                    this.page = 1,
                    this.pageSize = 3
                )

                CustomerService.getAllCustomers(params)
                .then((response) => {
                    const { customers, totalPages } = response.data
                    this.customers = customers.map(this.getDisplayCustomer)
                    this.totalPages = totalPages
                })
                .catch((e) => {
                    console.log(e);
                });
            },
            retrieveCustomers() {
                const params = this.getRequestParams(
                    this.company_name,
                    this.page,
                    this.pageSize
                )

                CustomerService.getAllCustomers(params)
                .then((response) => {
                    const { customers, totalPages } = response.data
                    this.customers = customers.map(this.getDisplayCustomer)
                    this.totalPages = totalPages
                })
                .catch((e) => {
                    console.log(e);
                });
            },
            refreshList() {
                this.retrieveCustomers();
            },
            removeAllCustomers() {
                this.confirmDeleteDialog = false
                CustomerService.deleteAll()
                    .then((response) => {
                        this.refreshList();
                    })
                    .catch((e) => {
                    console.log(e);
                    });
            },
            searchCompanyName() {
                const params = this.getRequestParams(
                    this.company_name,
                    this.page,
                    this.pageSize
                )

                CustomerService.getByTitle(this.company_name, params)
                    .then((response) => {
                        const { customers, totalPages } = response.data;
                        this.customers = customers.map(this.getDisplayCustomer);
                        this.totalPages = totalPages;
                })
                .catch((e) => {
                console.log(e);
                });
            },
            editCustomer(id) {
                console.log(id)
                this.$router.push({ name: "CustomerDetails", params: { id: id } });
            },
            deleteCustomer() {
                this.confirmItemToBeDeletedDialog = false
                this.customers.pop()

                if (this.customers.length == 0) {
                    this.page = this.page-1
                    this.totalPages = this.totalPages-1
                } 

                const params = this.getRequestParams(
                    this.company_name,
                    this.page,
                    this.pageSize
                )
                
                CustomerService.deleteCustomer(this.idOfItemToBeDeleted)
                .then(() => {
                        CustomerService.getAllCustomers(params)
                        .then((response) => {
                            const { customers, totalPages } = response.data;
                            this.customers = customers.map(this.getDisplayCustomer);
                            this.totalPages = totalPages;
                        })
                        .catch((e) => {
                            console.log(e);
                        });

                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },
            getDisplayCustomer(customer) {
                return {
                    id: customer.id,
                    enrollment: customer.enrollment,
                    contact_name: customer.contact_name,
                    phone: customer.phone,
                    email: customer.email,
                    company_name:
                        customer.company_name.length > 40 ? customer.company_name.substr(0, 30) + "..." : customer.company_name,
                };
            },
            handlePageChange(value) {
                this.page = value;
                this.retrieveCustomers();
            },
            handlePageSizeChange(size) {
                this.pageSize = size;
                this.page = 1;
                this.retrieveCustomers();
            },
            getFromChild(value) {
                this.confirmCreateDialog = value
                this.refreshList();
            }
        },
        mounted() {
            this.retrieveCustomers();
            this.loadedData = false
        },
    }
</script>

<style lang="scss" scoped>
.v-card__actions {
    display: inline; 
}
.cardStyle {
    padding: 1rem;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.289);
}
</style>