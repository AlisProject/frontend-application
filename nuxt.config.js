module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'ALIS - A Rewards System to Distinguish Trustworthy Articles.',
    titleTemplate: '%s | ALIS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: `ALIS is Japan's First Social Media Using Blockchain Technology` }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: `https://${process.env.DOMAIN}/d/nuxt/dist/favicon.ico` }]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#858DDA' },
  /*
  ** Build configuration
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/markdownit'
  ],
  markdownit: {
    injected: true,
    preset: 'default',
    breaks: true
  },
  plugins: [
    '~/plugins/axios',
    '~/plugins/vuelidate',
    { src: '~plugins/gtm.js', ssr: false }
  ],
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
