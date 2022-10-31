const mongoose = require('mongoose');
const { Schema } = mongoose;

const songSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  artist: {
    type: String,
    trim: true
  },
  genre: {
    type: String,
    trim: true
  },
  album: {
    type: String,
    trim: true
  },
  albumImageUrl: {
    type: String,
    trim: true
  },
  youtubeChannelId: {
    type: String,
    trim: true
  },
  youtubeVideoId: {
    type: String,
    trim: true
  },
  lyrics: {
    type: String,
    trim: true
  },
  subscriberCount: {
    type: String,
    trim: true
  },
  videoCount: {
    type: String,
    trim: true
  },
  viewCount: {
    type: String,
    trim: true
  },
  uid: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Song', songSchema)