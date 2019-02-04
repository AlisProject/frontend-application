module.exports = {
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
    title: 'ALIS | 信頼できる記事と人々を明らかにする全く新しいソーシャルメディア',
    titleTemplate: '%s | ALIS',
    meta: [
      { charset: 'utf-8' },
      { hid: 'viewport', name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'apple-mobile-web-app-title', content: 'ALIS' },
      {
        hid: 'description',
        name: 'description',
        content: `ALIS is Japan's First Social Media Using Blockchain Technology`
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'ALIS | 信頼できる記事と人々を明らかにする全く新しいソーシャルメディア'
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
      },
      { hid: 'fb:app_id', property: 'fb:app_id', content: '2157199921164241' }
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
  loading: { color: '#0086cc' },
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
  plugins: [
    '~/plugins/axios',
    '~/plugins/vuelidate',
    { src: '~plugins/gtm.js', ssr: false },
    { src: '~/plugins/vue-tags-input', ssr: false },
    { src: '~/plugins/editor', ssr: false }
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
    vendor: ['axios', 'moment', '@johmun/vue-tags-input', '@alisproject/alis-editor']
  },
  css: [
    '~assets/stylesheets/medium-editor.scss',
    '~assets/stylesheets/vuex-toast.scss',
    '@alisproject/alis-editor/dist/AlisEditor.css',
    '~/assets/stylesheets/ckeditor-view.scss'
  ],
  env: {
    IFRAMELY_API_KEY: process.env.IFRAMELY_API_KEY,
    REGION: process.env.REGION,
    USER_POOL_ID: process.env.USER_POOL_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    DOMAIN: process.env.DOMAIN
  }
}
