const Chat = require('../models/Chat')
const User = require('../models/User')
const helpers = require("./helpers")

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
            let users = []
            let data = []
            const chats = await Chat.find({room: req.params.id})
            const modifiedChats = chats.map(chats => ({
                _id: chats._id,
                room: chats.room,
                nickName: chats.nickName,
                message: chats.message,
                uid: chats.uid.toString(),
                created_date: chats.created_date.toDateString()
            }))

            for (let index = 0; index < modifiedChats.length; index++) {
                const user = await User.findById(modifiedChats[index].uid)
                users.push(user)
                users[index].password = undefined;
                if(modifiedChats[index].uid == users[index]._id) {
                    data.push([modifiedChats[index], users[index]])
                }
            }
            
            res.status(200).json(data)
        } catch (err) {
            res.status(500).send({
                error: 'An error has occured trying to fetch the chats for that room'
            })
        }
    },

    //Create chat
    async createChat (req, res, next) {
        try {
            const chat = new Chat({
                room: req.body.room,
                nickName: req.body.nickName,
                message: req.body.message,
                uid: req.body.uid
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
    },

    async deleteAllChats (req, res) {
        try {
            const result = await Chat.deleteMany({})
            return result
                // .then(data => {
                //     return res.send({
                //         message: `${data.deletedCound} chats were deleted successfully`
                //     })
                // })
        } catch (err) {
            // return res.status(500).send({
            //     message: err.message || "Some error occurred while removing all the chats."
            // })
            console.log(err)
        }
    },
}