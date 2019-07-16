const nuxtConfig = require('./nuxt.config.development.js')

nuxtConfig.build = {
  ...nuxtConfig.build,
  /*
   ** Run ESLint on save
   */
  extend(config) {
    if (process.server && process.browser) {
      config.module.rules.push({
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/
      })
    }

    config.devtool = 'eval-source-map'
  }
}

module.exports = nuxtConfig
