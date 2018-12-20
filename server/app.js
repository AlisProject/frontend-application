const express = require('express')

const { nuxt } = require('./core/nuxt')
const { setHeadersMiddleware } = require('./middlewares/header-middleware')
const { loggerMiddleware } = require('./middlewares/logger-middleware')

const app = express()

/** middleware */
app.use(setHeadersMiddleware)
app.use(loggerMiddleware)

app.use(nuxt.render)

module.exports.app = app
