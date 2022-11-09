const Chat = require('../models/Chat');

module.exports = {
    async getChats (req, res, next) {
        await Chat.find(function (err, products) {
            if (err) {return next(err)}
            
            res.json(products)
        })
    },

    //GET A CHAT BY ID
    async getChatById (req, res, next) {
        await Chat.find({room: req.params.id}, function (err, post) {
            if (err) {return next(err)}
            const modifiedPost = post.map(post => ({
                _id: post._id,
                room: post.room,
                nickname: post.nickname,
                message: post.message,
                created_date: post.created_date.toDateString()
            }));
            

            res.status(200).json(modifiedPost)
        }).clone().catch(function(err){ console.log(err)})
    },

    //Create chat
    async createChat (req, res, next) {
        await Chat.create(req.body, function (err, post) {
            if (err) return next(err)
            res.json(post)
        })
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
        Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
            if (err) return next(err)
            res.json(post)
        })
    }
}