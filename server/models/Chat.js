const mongoose = require('mongoose')
const { Schema } = mongoose;

const chatSchema = new mongoose.Schema({
  room : { 
    type: Schema.Types.ObjectId, 
    ref: 'Room',
    required: true,
  },
  nickname: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: String,
  created_date: { type: Date, default: Date.now },
},{ timestamps: true });

chatSchema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model('Chat', chatSchema);