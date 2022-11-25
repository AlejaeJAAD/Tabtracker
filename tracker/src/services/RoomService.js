import Api from '@/services/Api'

export default {
    getAllRooms() {
        return Api().get('rooms')
    },
    deleteRoom(id) {
        return Api().delete(`rooms/${id}`)
    },
    deleteAllRooms() {
        return Api().delete('rooms')
    },
}
