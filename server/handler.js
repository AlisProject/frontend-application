'use strict'

const awsServerlessExpress = require('aws-serverless-express')
const { app } = require('./app')

const server = awsServerlessExpress.createServer(app)

module.exports.handler = (event, context, callback) => {
  console.log(event)
  awsServerlessExpress.proxy(server, event, context)
}
