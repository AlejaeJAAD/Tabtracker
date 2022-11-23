const mongoose = require('mongoose')
const { Schema } = mongoose;

const chatSchema = new mongoose.Schema({
  room : { 
    type: Schema.Types.ObjectId, 
    ref: 'Room',
    required: true,
  },
  nickName: String,
  uid: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: String,
  created_date: { type: Date, default: Date.now },
},{ timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);