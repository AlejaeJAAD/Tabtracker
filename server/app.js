require('dotenv').config()

var cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors')

const mongoose = require('mongoose')
// Mongo DB Conecction
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@tabtracker-cluster.jtmwcvd.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('DB Connected'))
.catch(e => console.log('error db:', e))


const app = express()

const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
      origins: ['http://localhost:8080']
    }
})

// io.use((socket, next) => {
//     const token = socket.handshake.auth.token
//     console.log('token', token)
//     next()
// })

// io.on('connection', (socket) => {
//     console.log('a user connected')
//     socket.on('disconnect', () => {
//       console.log('user disconnected')
//     })
//     socket.on('my message', (msg) => {
//       console.log('message: ' + msg)
//       io.emit('my broadcast', `server: ${msg}`)
//     })

//     let token = socket.handshake.auth.token
//     console.log(token)
// })

io.on('connection', function (socket) {
    console.log('User connected')
    socket.on('disconnect', function() {
      console.log('User disconnected')
    })
    socket.on('save-message', function (data) {
      console.log(data)
      io.emit('new-message', { message: data })
    })
})

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2]

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || whiteList.includes(origin)) {
                return callback(null, origin)
            }
            return callback(
                "CORS ERROR origin: " + origin + " No authorization!"
            )
        },
        credentials: true,
    })
)


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true
}))

// Use routes file
require('./routes')(app)

// Middleware Vue router history
const history = require('connect-history-api-fallback')
app.use(history())
app.use(express.static(__dirname + "/public"))

// Initialize server
const PORT = process.env.PORT || 3001
http.listen(PORT, () => {
    console.log(`Server started on: ${PORT}`)
})

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message)
})
