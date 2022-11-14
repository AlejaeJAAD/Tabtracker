import Api from '@/services/Api'

export default {
    getAllTutorials (params) {
        return Api().get('tutorials', {params})
    },
    getTutorial (id) {
        return Api().get(`tutorials/${id}`)
    },
    postTutorial (song) {
        return Api().post('tutorials', song)
    },
    updateTutorial (id, data) {
        return Api().put(`tutorials/${id}`, data)
    },
    deleteTutorial (id) {
        return Api().delete(`tutorials/${id}`)
    },
    deleteAll() {
        return Api().delete('tutorials')
    },
    getByTitle(title, {params}) {
        return Api().get(`tutorials/title/${title}`, {params});
    },    
    getAllPublishedTutorials (songId) {
        return Api().get('tutorials/published')
    },
}
