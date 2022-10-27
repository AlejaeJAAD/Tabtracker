const Song = require('../models/Song')
const { YOUTUBE_API_KEY } = require('../config/config')
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    async index (req, res) {
        try {
          Song.find({}, 
            {
              _id : 1,
              title : 1,
              artist: 1,
              genre: 1,
              album: 1,
              albumImageUrl: 1,
              youtubeChannelId: 1,
              youtubeVideoId: 1,
              lyrics: 1,
              tab: 1,
              subscriberCount: 1,
              videoCount: 1,
              viewCount: 1
              
            }, function (err, data) {
            return res.status(200).json(data)
          }
        )} catch (err) {
          res.status(500).send({
            error: 'an error has occured trying to fetch the songs'
          })
        }
    },
    async show (req, res) {
      try {
        const song = await Song.findById(req.params.songId)
        res.send(song)
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to fetch the songs'
        })
      }
    },
    async post (req, res) {
        try {
          const song = await Song.create(req.body)
          res.send(song)
        } catch (err) {
          res.status(500).send({
            error: 'an error has occured trying to create the song'
          })
        }
    },
    async getcreatedSongInfo (req, res) {
        const artistName = req.body.artistName.replace(/ /g,"_")
        const songName = req.body.songName.replace(/ /g,"_")
        const query = (`${artistName}_${songName}`)
      
        if (!YOUTUBE_API_KEY) {
            throw new Error("No API key is provided");
        }

        //Search video by name
        const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=video&part=snippet&q=${query}`;
        console.log(url)
        const response01 = await fetch(url);
        const data01 = await response01.json();

        //Retrieve json from result of search
        const firstVideoSelectedData = data01.items[0]

        const ytVideo = `https://www.youtube.com/watch?v=${firstVideoSelectedData.id.videoId}`
        const channelId = firstVideoSelectedData.snippet.channelId
        const ytChannelURL = `https://www.youtube.com/channel/${channelId}`

        //Get channel info by id
        //const channelURL = `https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`;
        const channel = `https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${YOUTUBE_API_KEY}`

        const response02 = await fetch(channel);
        const data02 = await response02.json();

        const channelData = data02.items[0]

        const songInfo = {
          firstVideoSelectedData,
          channelData,
          ytVideo,
          ytChannelURL
        }

        return res.status(200).json(songInfo)

    }
}