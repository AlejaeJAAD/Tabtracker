const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  title: 
    {type: String, required: true,},
  artist: 
    {type: String, required: true},
  genre: 
    {type: String, required: true},
  album: 
    {type: String, required: true},
  albumImageUrl: 
    {type: String, required: true},
  youtubeChannelId: 
    {type: String, required: true},
  youtubeVideoId: 
    {type: String, required: true},
  lyrics: 
    {type: String, required: true},
  subscriberCount: 
    {type: String, required: true},
  videoCount: 
    {type: String, required: true},
  viewCount: 
    {type: String, required: true}
})

module.exports = mongoose.model('Song', songSchema)