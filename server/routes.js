const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const SongsController = require('./controllers/SongsController')
const YTDownloaderController = require('./controllers/YTDownloaderController')

//Validate token
const requireToken = require('./middlewares/requireToken')
const requireRefreshToken = require('./middlewares/requireRefreshToken')

module.exports = (app) => {
    // Register route
    app.post('/register',
        AuthenticationControllerPolicy.register,
        AuthenticationController.register
    )

    // Login route
    app.post('/login',
        AuthenticationController.login
    )

    // Logout route
    app.get('/logout',
        AuthenticationController.logout
    )

    // Refresh token route
    app.get('/refresh-token', requireRefreshToken, AuthenticationController.refreshToken)

    // Protected route
    app.get('/dashboard', requireToken, AuthenticationController.infoUser,
    )
    
    // Display all songs
    app.get('/songs',
        SongsController.index
    )

    // Display song by ID
    app.get('/songs/:songId',
        SongsController.show
    )

    // Create song
    app.post('/songs',
        SongsController.post
    )

    // Get song info using YT API
    app.post('/createdSongInfo',
        SongsController.getcreatedSongInfo
    )   

    // Download song using PY Script
    app.post('/ytdownloader',
        YTDownloaderController.download)

}
