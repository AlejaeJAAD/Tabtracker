const { PythonShell } = require('python-shell');
const { YOUTUBE_API_KEY } = require('../config/config')
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    async download(req, res) {
        const query = req.body.songName.replace(/ /g,"_")
        if (!YOUTUBE_API_KEY) {
            throw new Error("No API key is provided");
        }
        const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=video&part=snippet&q=${query}`;
        //console.log('This is the url: ', url)

        const response = await fetch(url);
        const data = await response.json();

        const firstVideoSelectedData = data.items[0]
        const ytVideo = 'https://www.youtube.com/watch?v='+firstVideoSelectedData.id.videoId
        //console.log(ytVideo)
          
        try {
            const directoryName = 'videosDownloadedFromYoutubeUsingNodeJSThroughPython'
            //const youtubeVideo = await req.body

            let options = {
                scriptPath: 'download/',
                args: [ytVideo, directoryName]
            };
            
            PythonShell.run("script.py", options, (err, res) => {
                if (err) console.log(err)
                if (res) console.log(res)
            })
            res.send(data)
        } catch (err) {
            console.log(err)
            res.status(400).send({
                error: 'Failed.'
            })
        }
    }


}
