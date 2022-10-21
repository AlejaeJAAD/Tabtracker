const YTDownloaderController = require('./controllers/YTDownloaderController')

module.exports = (app) => {
    app.post('/ytdownloader',
        YTDownloaderController.download)
}
