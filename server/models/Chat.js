const mongoose = require('mongoose')
const { Schema } = mongoose;

const chatSchema = new mongoose.Schema({
  room : { 
    type: Schema.Types.ObjectId, 
    ref: 'Room',
    required: true,
  },
  nickname: String,
  message: String,
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', chatSchema);