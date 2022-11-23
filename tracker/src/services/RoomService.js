import Api from '@/services/Api'

export default {
    getAllRooms() {
        return Api().get('rooms')
    },
    deleteRoom(id) {
        return Api().delete(`rooms/${id}`)
    },
    deleteAll() {
        return Api().delete('rooms')
    },
}
