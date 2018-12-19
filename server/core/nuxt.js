const { Nuxt } = require('nuxt')
const config = require('./../../nuxt.config.js')

config.dev = process.env.NODE_ENV === 'development'

const nuxt = new Nuxt(config)

module.exports = {
  nuxt,
  config
}
