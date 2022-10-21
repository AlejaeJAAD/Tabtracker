const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const SongsController = require('./controllers/SongsController')
const YTDownloaderController = require('./controllers/YTDownloaderController')

module.exports = (app) => {
    app.post('/register',
    AuthenticationControllerPolicy.register,
        AuthenticationController.register)
    app.post('/login',
        AuthenticationController.login)


    app.get('/songs',
        SongsController.index
    )
    app.post('/songs',
        SongsController.post)

    app.post('/ytdownloader',
        YTDownloaderController.download)
}
