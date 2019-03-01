const { Nuxt } = require('nuxt')
const config = require('./../../nuxt.config.js')

config.dev = false

const nuxt = new Nuxt(config)

module.exports = {
  nuxt,
  config
}
