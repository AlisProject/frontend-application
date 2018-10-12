const nuxtConfig = require('./nuxt.config.js')

nuxtConfig.axios = {
  prefix: '/api',
  proxyHeaders: false,
  proxy: true
}

nuxtConfig.proxy = {
  '/api': {
    target: process.env.PROXY_TARGET_URL
    // pathRewrite: { '^/api': '/' }
  }
}

module.exports = nuxtConfig
