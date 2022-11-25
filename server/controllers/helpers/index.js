const chatController = require('../ChatController')

module.exports = {
    async getRoomId (id) {
        try {
            const result = chatController.deleteAllChatsFromId(id)
            return result
        } catch (err) {
            console.log(err)
        }
    },
    async deleteAllChats () {
        try {
            const result = await chatController.deleteAllChats()
            return result
        } catch (err) {
            console.log(err)
        }
    }
}