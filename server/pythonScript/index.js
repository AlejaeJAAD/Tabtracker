const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
//const {spawn} = require('child_process');
const port = 5000

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('./routes')(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))