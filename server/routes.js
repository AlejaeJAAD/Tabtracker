const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const SongsController = require('./controllers/SongsController')
const YTDownloaderController = require('./controllers/YTDownloaderController')
const Song = require('./models/Song')

module.exports = (app) => {
    app.post('/register',
    AuthenticationControllerPolicy.register,
        AuthenticationController.register)
    app.post('/login',
        AuthenticationController.login)


    app.get('/songs',
        SongsController.index
    )
    app.get('/songs/:songId',
        SongsController.show
    )
    app.post('/songs',
        SongsController.post
    )
    app.post('/createdSongInfo',
        SongsController.getcreatedSongInfo
    )   

    app.post('/ytdownloader',
        YTDownloaderController.download)
}
