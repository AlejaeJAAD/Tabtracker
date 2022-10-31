const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const SongsController = require('./controllers/SongsController')
const YTDownloaderController = require('./controllers/YTDownloaderController')

//Validate token
const requireToken = require('./middlewares/requireToken')
const requireRefreshToken = require('./middlewares/requireRefreshToken')

//Links
const {getLinks, createLink, removeLink, updateLink, getNanoLink } = require('./controllers/LinksController')

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
    app.get('/songs', requireToken,
        SongsController.index
    )

    // Display song by ID
    app.get('/songs/:songId',
        SongsController.show
    )

    // Create song
    app.post('/songs', requireToken,
        SongsController.post
    )

    // Get song info using YT API
    app.post('/createdSongInfo', requireToken,
        SongsController.getcreatedSongInfo
    )   

    // Download song using PY Script
    app.post('/ytdownloader', requireToken,
        YTDownloaderController.download
    )

    // GET      api/v1/links                all links
    // GET      api/v1/links/:nanoLink      search link
    // POST     api/v1/links                create link
    // PATCH    api/v1/links                update link
    // DELETE   api/v1/links/:nanoLink      remove link
    app.get('/links', requireToken, getLinks
    )
    
    app.post('/links', requireToken, createLink
    )

    app.delete('/links/:id', requireToken, removeLink
    )

    app.patch('/links/:id', requireToken, updateLink
    )

    app.get('/links/:nanoLink', getNanoLink
    )

}
