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
      { name: 'apple-mobile-web-app-title', content: 'ALIS' },
      { hid: 'description', name: 'description', content: `ALIS is Japan's First Social Media Using Blockchain Technology` },
      { hid: 'og:title', property: 'og:title', content: 'ALIS - A Rewards System to Distinguish Trustworthy Articles.' },
      { hid: 'og:description', property: 'og:description', content: `ALIS is Japan's First Social Media Using Blockchain Technology` },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:image', property: 'og:image', content: `https://${process.env.DOMAIN}/d/nuxt/dist/OGP_1200×630.png` },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
      { hid: 'twitter:site', name: 'twitter:site', content: '@ALIS_media' },
      { hid: 'twitter:image', name: 'twitter:image', content: `https://${process.env.DOMAIN}/d/nuxt/dist/OGP_1200×630.png` }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: `https://${process.env.DOMAIN}/d/nuxt/dist/favicon.ico` },
      { rel: 'apple-touch-icon', sizes: '192x192', href: `https://${process.env.DOMAIN}/d/nuxt/dist/touch-icon.png` },
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
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/markdownit',
    '@nuxtjs/proxy'
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
  proxy: process.env.NODE_ENV !== 'localhost' ? [] : [
    `https://${process.env.DOMAIN}/api/`
  ],
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
