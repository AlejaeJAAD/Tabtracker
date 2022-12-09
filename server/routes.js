const AC = require('./controllers/AuthenticationController')
const ACP = require('./policies/AuthenticationControllerPolicy')
const SC = require('./controllers/SongsController')
const YTDownloaderController = require('./controllers/YTDownloaderController')

//Validate token
const requireToken = require('./middlewares/requireToken')
const requireRefreshToken = require('./middlewares/requireRefreshToken')
const restorePasswordToken = require('./middlewares/restorePasswordToken')

//Links
const {getLinks, createLink, removeLink, updateLink, getNanoLink } = require('./controllers/LinksController')

//Rooms
const {getRooms, getRoomById, createRoom, updateRoom, deleteRoom, deleteAllRooms} = require('./controllers/RoomsController')

//Chats
const {getChats, getChatById, createChat, updateChat, deleteChat} = require('./controllers/ChatController')

//Tutorials
const {postTutorial, getAllTutorials, getAllPublishedTutorials, getOneTutorial, getByTttle, updateOneTutorial, deleteOneTutorial, deleteAllTutorials} = require('./controllers/TutorialsController')

//Customers
const {newCustomer, getCustomers, getCustomerById, deleteAllCustomers, deleteCustomerById, updateCustomerById} = require('./controllers/CustomersController')

const {getMusicData} = require('./controllers/MusicController')

const {generatePDF} = require('./controllers/PDFController')

module.exports = (app) => {
    // Register route
    app.post('/register', ACP.register, AC.register)
    // Login route
    app.post('/login', AC.login)
    // Logout route
    app.get('/logout', AC.logout)
    // Forgot password
    app.put('/forgot-password', AC.forgotPassword)
    //Confirm email (recover password)
    app.put('/confirm-recover-password-email', restorePasswordToken, AC.confirmRecoverPasswordEmail)
    // Create new password
    app.put('/new-password', requireToken, AC.createNewPassword)
    // Refresh token route
    app.get('/refresh-token', requireRefreshToken, AC.refreshToken)

    // Protected route
    app.get('/userInfo', requireToken, AC.infoUser)
    app.post('/getUserData', AC.getUserData)

    // Display all songs
    app.get('/songs', requireToken, SC.index)
    // Display all songs mixed
    app.get('/getAllSongs', SC.getAllSongs)
    // Search song using parameter query
    app.get('/searchSong/:songName', requireToken, SC.searchSong)
    // Display song by ID
    app.get('/songs/:songId',SC.show)
    // Create song
    app.post('/songs', requireToken,SC.post)
    // Get song info using YT API
    app.post('/createdSongInfo', requireToken,SC.getcreatedSongInfo)

    // Download song using PY Script
    app.post('/ytdownloader', requireToken, YTDownloaderController.download)

    // GET      api/v1/links                all links
    // GET      api/v1/links/:nanoLink      search link
    // POST     api/v1/links                create link
    // PATCH    api/v1/links                update link
    // DELETE   api/v1/links/:nanoLink      remove link
    app.get('/links', requireToken, getLinks)
    app.post('/links', requireToken, createLink)
    app.delete('/links/:id', requireToken, removeLink)
    app.patch('/links/:id', requireToken, updateLink)
    app.get('/links/:nanoLink', getNanoLink)

    //ROOM - CHAT - SOCKET IO
    app.get('/rooms', getRooms)
    app.get('/rooms/:id', getRoomById)
    app.post('/rooms', createRoom)
    app.patch('/rooms/:id', updateRoom)
    app.delete('/rooms/:id', deleteRoom)
    app.delete('/rooms', deleteAllRooms)
    app.get('/chats', getChats)
    app.get('/chats/:id', getChatById)
    app.post('/chats', createChat)
    app.patch('/chats/:id', updateChat)
    app.delete('/chats/:id', deleteChat)

    app.get('/musicData',
        getMusicData
    )

    //Tutorials using paginate server side
    app.post('/tutorials', requireToken, postTutorial)
    app.get('/tutorials',  getAllTutorials)
    app.get('/tutorials/published', getAllPublishedTutorials)
    app.get('/tutorials/:id', getOneTutorial)
    app.get('/tutorials/title/:tutorialName', getByTttle)
    app.put('/tutorials/:id', updateOneTutorial)
    app.delete('/tutorials/:id', deleteOneTutorial)
    app.delete('/tutorials', deleteAllTutorials)

    app.post('/generatePDF', generatePDF)

    //Customers
    app.post('/customers', newCustomer)
    app.get('/customers', getCustomers)
    app.get('/customers/:id', getCustomerById)
    app.delete('/customers', deleteAllCustomers)
    app.delete('/customers/:id', deleteCustomerById)
    app.put('/customers/:id', updateCustomerById)
    
}
