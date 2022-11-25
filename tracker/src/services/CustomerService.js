import Api from '@/services/Api'

export default {
    getAllCustomers (params) {
        return Api().get('customers', {params})
    },
}