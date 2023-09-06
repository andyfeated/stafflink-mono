const express = require('express')
const cors = require('cors')
const app = express()

require('../src/utils/db')

const usersRouter = require('../src/controllers/users')
const loginRouter = require('../src/controllers/login')
const companiesRouter = require('../src/controllers/companies')
const annoucementsRouter = require('../src/controllers/announcements')

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/companies', companiesRouter)
app.use('/api/announcements', annoucementsRouter)

module.exports = app;