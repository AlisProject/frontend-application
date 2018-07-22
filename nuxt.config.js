const isProduction = process.env.NODE_ENV === 'production'

const nuxtConfig = {
  /*
  ** Headers of the page
  */
  head: {
    script: [
      {
        src: `//cdn.iframe.ly/embed.js?api_key=${process.env.IFRAMELY_API_KEY}&omit_script=1`,
        async: true
      }
    ],
    title: 'ALIS - A Rewards System to Distinguish Trustworthy Articles.',
    titleTemplate: '%s | ALIS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'apple-mobile-web-app-title', content: 'ALIS' },
      {
        hid: 'description',
        name: 'description',
        content: `ALIS is Japan's First Social Media Using Blockchain Technology`
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'ALIS - A Rewards System to Distinguish Trustworthy Articles.'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: `ALIS is Japan's First Social Media Using Blockchain Technology`
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:image',
        property: 'og:image',
        content: `https://${process.env.DOMAIN}/d/nuxt/dist/OGP_1200×630.png`
      },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:site', name: 'twitter:site', content: '@ALIS_media' },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: `https://${process.env.DOMAIN}/d/nuxt/dist/OGP_1200×630.png`
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: `https://${process.env.DOMAIN}/d/nuxt/dist/favicon.ico`
      },
      {
        rel: 'apple-touch-icon',
        sizes: '192x192',
        href: `https://${process.env.DOMAIN}/d/nuxt/dist/touch-icon.png`
      },
      { rel: 'shortcut icon', href: `https://${process.env.DOMAIN}/d/nuxt/dist/touch-icon.png` }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#858DDA' },
  /*
  ** Build configuration
  */
  modules: ['@nuxtjs/axios', '@nuxtjs/markdownit', 'nuxt-sass-resources-loader'],
  sassResources: ['~/assets/stylesheets/mixins/**.scss'],
  markdownit: {
    injected: true,
    preset: 'default',
    breaks: true
  },
  plugins: ['~/plugins/axios', '~/plugins/vuelidate', { src: '~plugins/gtm.js', ssr: false }],
  axios: {
    baseURL: process.env.BASE_URL,
    proxyHeaders: false
  },
  srcDir: 'app',
  router: {
    base: '/'
  },
  render: {
    gzip: false
  },
  build: {
    publicPath: `https://${process.env.DOMAIN}/d/nuxt/dist/`,
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: ['axios']
  },
  css: ['~assets/stylesheets/medium-editor.scss', '~assets/stylesheets/vuex-toast.scss'],
  env: {
    IFRAMELY_API_KEY: process.env.IFRAMELY_API_KEY,
    REGION: process.env.REGION,
    USER_POOL_ID: process.env.USER_POOL_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    DOMAIN: process.env.DOMAIN
  }
}

if (!isProduction) {
  nuxtConfig.axios = {
    prefix: '/api',
    proxyHeaders: false,
    proxy: true
  }
  nuxtConfig.proxy = {
    '/api': {
      target: process.env.BASE_URL,
      pathRewrite: { '^/api': '/' }
    }
  }
}

module.exports = nuxtConfig
