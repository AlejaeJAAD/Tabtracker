import Api from '@/services/Api'

export default {
    refresh () {
        return Api().get('refresh-token')
    },
    show (token, user) {
        return Api().get('dashboard', token, user)
    }
}