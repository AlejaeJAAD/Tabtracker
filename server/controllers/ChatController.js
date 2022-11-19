const Chat = require('../models/Chat')

module.exports = {
    async getChats (req, res, next) {
        await Chat.find(function (err, products) {
            if (err) {return next(err)}
            
            res.json(products)
        })
    },

    //GET A CHAT BY ID
    async getChatById (req, res, next) {
        try {
            const chats = await Chat.find({room: req.params.id})
            const modifiedChats = chats.map(chats => ({
                _id: chats._id,
                room: chats.room,
                nickname: chats.nickname,
                message: chats.message,
                created_date: chats.created_date.toDateString()
            }));

            res.status(200).json(modifiedChats)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to fetch the chats for that room'
            })
        }
    },

    //Create chat
    async createChat (req, res, next) {
        console.log(req.body)
        try {
            const chat = new Chat({
                room: req.body.room,
                nickname: req.body.nickname,
                message: req.body.message,
                user: req.body.user
            })
            
            const newChat = await chat.save()
            res.json({
                newChat
            })
        } catch (err) {
            return res.status(500).json({
                error: 'Some error with the server'
            })
        }
    },

    //Update chat
    async updateChat (req, res, next) {
        await Chat.findByIdAndUpdate(req.params.id, res.body, function (err, post) {
            if (err) return next(err)
            res.json(post)
        })
    },

    //Delete chat
    async deleteChat (req, res, next) {
        await Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) return next(err)
            res.json(post)
        })
    },

    async deleteAllChatsFromId (id) {
        try {
            const result = await Chat.deleteMany({room: id})
            return result
        } catch (error) {
            console.log(error)
        }
    }
}