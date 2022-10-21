const { PythonShell } = require('python-shell');

module.exports = {
    async download(req, res) {
        try {
            const directoryName = 'videosDownloadedFromYoutubeUsingNodeJSThroughPython'
            const youtubeVideo = await req.body

            let options = {
                scriptPath: 'public/',
                args: [youtubeVideo.link, directoryName]
            };
            
            PythonShell.run("script.py", options, (err, res) => {
                if (err) console.log(err)
                if (res) console.log(res)
            })
            res.send(youtubeVideo.link)
        } catch (err) {
            res.status(400).send({
                error: 'Failed.'
            })
        }
    }
}
