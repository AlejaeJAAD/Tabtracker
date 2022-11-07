const Room = require('../models/Room');

module.exports = {
    //GET ALL ROOMS
    async getRooms(req, res, next) {
        try {
            await Room.find(function (err, products) {
                if (err) return next(err)
                res.json(products)
            })
        } catch (err) {
            console.log(err)
        }
    },
    //GET A ROOM BY ID
    async getRoomById(req, res, next) {
        try {
            await Room.findById(req.params.id, function (err, post) {
                if (err) return next(err)
                res.json(post)
            })
        } catch (err) {
            console.log(err)
        }
    },

    //CREATE ROOM
    async createRoom(req, res, next) {
        try {
            await Room.create(req.body, function (err, post) {
                if (err) return next(err)
                res.json(post)
            })
        } catch (err) {
            console.log(err)
        }
    },

    //UPDATE ROOM
    async updateRoom(req, res, next) {
        try {
            await Room.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if (err) return next(err)
                res.json(post)
            })
        } catch (err) {
            console.log(err)
        }
    },

    //DELETE ROOM
    async deleteRoom(req, res, next) {
        try {
            Room.findByIdAndRemove(req.params.id, req.body, function (err, post) {
                if (err) return next(err)
                res.json(post)
            })
        } catch (err) {
            console.log(err)
        }
    }
}