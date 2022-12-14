const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  room_name: String,
  created_date: { type: Date, default: Date.now },
},{ timestamps: true })

module.exports = mongoose.model('Room', roomSchema);