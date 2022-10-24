import Api from '@/services/Api'

export default {
    index () {
        return Api().get('songs')
    },
    post (song) {
        return Api().post('songs', song)
    },
    show (songId) {
        return Api().get(`songs/${songId}`)
    },
    createdSongInfo (song) {
        return Api().post('createdSongInfo', song)
    },
    download (link) {
        return Api().post('ytdownloader', link)
    },
}
