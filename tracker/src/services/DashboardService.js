import Api from '@/services/Api'

export default {
    show (token) {
        return Api().get('dashboard', token)
    }
}