const express = require('express')
const cors = require('cors')
const app = express()

require('./src/utils/db')

const usersRouter = require('./src/controllers/users')

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)

module.exports = app;