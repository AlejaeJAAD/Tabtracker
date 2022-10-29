require('dotenv').config()

var cookieParser = require('cookie-parser');
const express = require('express')
const cors = require('cors')

const mongoose = require('mongoose');
// Mongo DB Conecction
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@tabtracker-cluster.jtmwcvd.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('DB Connected'))
.catch(e => console.log('error db:', e))


const app = express()

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || whiteList.includes(origin)) {
                return callback(null, origin);
            }
            return callback(
                "CORS ERROR origin: " + origin + " No authorization!"
            );
        },
        credentials: true,
    })
);


app.use(express.json());
app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Use routes file
require('./routes')(app)

// Middleware Vue router history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(__dirname + "/public"));

// Initialize server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on: ${PORT}`)
})

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
});