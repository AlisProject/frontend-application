// CI環境でのみ利用する設定
const nuxtConfig = require('./nuxt.config.js')

// Sentryへのreleaseとsourcemapの反映を行う
nuxtConfig.sentry = {
  dsn: `${process.env.SENTRY_DSN}`,
  publishRelease: true,
  config: {
    release: `${process.env.SENTRY_RELEASE}`,
    ignoreErrors: [/^view-createPositionAt-offset-required.*/]
  }
}

module.exports = nuxtConfig
