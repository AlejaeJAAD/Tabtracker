import Api from '@/services/Api'

export default {
    getAllTutorials (params) {
        return Api().get('tutorials', {params})
    },
    getAllPublishedTutorials (songId) {
        return Api().get('tutorials/published')
    },
    postTutorial (song) {
        return Api().post('tutorials', song)
    },
}
