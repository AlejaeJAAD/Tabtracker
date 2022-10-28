const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const SongsController = require('./controllers/SongsController')
const YTDownloaderController = require('./controllers/YTDownloaderController')

//Validate token
const verifyToken = require('./validate-token');

module.exports = (app) => {
    app.post('/register',
        AuthenticationControllerPolicy.register,
        AuthenticationController.register)
    app.post('/login',
        AuthenticationController.login)
    app.get('/logout',
        AuthenticationController.logout)
    app.get('/refresh-token', AuthenticationController.refreshToken)


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

    //Protected route
    app.get('/dashboard', verifyToken, AuthenticationController.infoUser,
        )
}
