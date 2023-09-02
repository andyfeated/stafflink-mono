const express = require('express')
const cors = require('cors')
const app = express()

require('../src/utils/db')

const usersRouter = require('../src/controllers/users')
const loginRouter = require('../src/controllers/login')

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app;