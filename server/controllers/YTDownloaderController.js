const { PythonShell } = require('python-shell');

module.exports = {
    async download(req, res) {
        try {
            const directoryName = 'videosDownloadedFromYoutubeUsingNodeJSThroughPython'
            //const youtubeVideo = await req.body

            let options = {
                scriptPath: 'download/',
                args: [req.body.songName, directoryName]
            };
            
            PythonShell.run("script.py", options, (err, res) => {
                if (err) console.log(err)
                if (res) console.log(res)
            })
            return res.status(200)
        } catch (err) {
            console.log(err)
            res.status(400).send({
                error: 'Failed.'
            })
        }
    }


}
