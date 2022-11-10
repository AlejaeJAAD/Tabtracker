const chatController = require('../ChatController')

module.exports = {
    async getRoomId (id) {
        try {
            const result = chatController.deleteAllChatsFromId(id)
            return result
        } catch (err) {
            console.log(err)
        }
    }
}