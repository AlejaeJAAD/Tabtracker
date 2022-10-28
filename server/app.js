const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config()

// Conexión a Base de datos
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@tabtracker-cluster.jtmwcvd.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Base de datos conectada'))
.catch(e => console.log('error db:', e))


const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())

app.use(cors({ origin: "http://localhost:8080", credentials: true }))

app.use(express.json());
app.use(cookieParser());

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
  });
  
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
extended: true
}));

require('./routes')(app)

// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(__dirname + "/public"));

// Iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en: ${PORT}`)
})