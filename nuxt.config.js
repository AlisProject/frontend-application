module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'alis-frontend-sample',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  modules: [
    '@nuxtjs/axios'
  ],
  plugins: [
    '~/plugins/axios',
    '~/plugins/vuelidate'
  ],
  axios: {
    baseURL: process.env.BASE_URL
  },
  srcDir: 'app',
  router: {
    base: '/'
  },
  render: {
    gzip: false
  },
  build: {
    publicPath: `https://s3-${process.env.REGION}.amazonaws.com/${process.env.DIST_S3_BUCKET_NAME}/`,
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
  css: ['~assets/stylesheets/medium-editor.scss'],
  env: {
    IFRAMELY_API_KEY: process.env.IFRAMELY_API_KEY,
    REGION: process.env.REGION,
    USER_POOL_ID: process.env.USER_POOL_ID,
    CLIENT_ID: process.env.CLIENT_ID
  }
}
