const Room = require('../models/Room');
const helpers = require("./helpers")

module.exports = {
    //GET ALL ROOMS
    async getRooms(req, res, next) {
        await Room.find(function (err, products) {
            if (err) {return next(err)}

            const modifiedProducts = products.map(product => ({
                _id: product._id,
                room_name: product.room_name,
                created_date: product.created_date.toDateString()
            }));
            

            res.status(200).json(modifiedProducts)
            
        }).clone().catch(function(err){ console.log(err)})
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
                // res.json(post)
            })
            helpers.getRoomId(req.params.id);
            res.status(200).json({
                message: 'Room has been deleted successfully with all the chats'
            })
        } catch (err) {
            console.log(err)
        }
    },
    
    //Delete all rooms
    async deleteAllRooms (req, res) {
        await Room.deleteMany({})
            .then(data => {
                helpers.deleteAllChats()
                return res.send({
                    message: `${data.deletedCound} rooms were deleted successfully`
                })
            })
            .catch(err => {
                return res.status(500).send({
                    message: err.message || "Some error occurred while removing all the rooms."
                })
            })
    },
}