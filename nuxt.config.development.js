const nuxtConfig = require('./nuxt.config.js')

nuxtConfig.axios = {
  proxyHeaders: false,
  proxy: true
}

nuxtConfig.proxy = {
  '/api': process.env.BASE_URL,
  '/oauth2': process.env.BASE_URL,
  '/labo': process.env.BASE_URL
}

module.exports = nuxtConfig
