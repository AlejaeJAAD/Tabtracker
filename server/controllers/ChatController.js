const Chat = require('../models/Chat');

module.exports = {
    async getChats (req, res, next) {
        await Chat.find(function (err, products) {
            if (err) return next(err)
            res.json(products)
        })
    },

    //GET A CHAT BY ID
    async getChatById (req, res, next) {
        await Chat.findById(req.params.id, function (err, post) {
            if (err) return next(err)
            res.json(post)
        })
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