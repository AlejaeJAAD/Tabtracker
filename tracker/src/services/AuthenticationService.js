import Api from '@/services/Api'

export default {
    register (credentials) {
        return Api().post('register', credentials, {withCredentials:true})
    },
    login (credentials) {
        console.log(credentials)
        return Api().post('login', credentials, {withCredentials:true},)
    },
}
