const axiosRetry = require('axios-retry')

module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    script: [
      {
        src: `//cdn.iframe.ly/embed.js?api_key=${process.env.IFRAMELY_API_KEY}&omit_script=1`,
        async: true
      },
      {
        // web3 を npm から追加すると、インポート時に SSR で落ちるようになってしまうため、CDN から読み込んでいる。
        src: '//cdn.jsdelivr.net/gh/ethereum/web3.js@1.0.0-beta.34/dist/web3.min.js',
        defer: true
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
      { rel: 'shortcut icon', href: `https://${process.env.DOMAIN}/d/nuxt/dist/touch-icon.png` },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: '#0086cc' },
  /*
   ** Build configuration
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/markdownit', '@nuxtjs/style-resources'],
  styleResources: {
    scss: ['~assets/stylesheets/mixins/**.scss']
  },
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
    proxyHeaders: false,
    retry: {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay
    }
  },
  srcDir: 'app',
  router: {
    base: '/'
  },
  render: {
    /**
     * compression を通すと API Gateway がレスポンスを返せないので
     * なにもしないミドルウェアを定義しておく
     */
    compressor: (req, res, next) => {
      next()
    }
  },
  build: {
    publicPath: `https://${process.env.DOMAIN}/d/nuxt/dist/`,
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
    }
  },
  css: [
    '~assets/stylesheets/medium-editor.scss',
    '~assets/stylesheets/vuex-toast.scss',
    '@alisproject/alis-editor/dist/AlisEditor.css',
    '~assets/stylesheets/ckeditor-view.scss'
  ],
  env: {
    IFRAMELY_API_KEY: process.env.IFRAMELY_API_KEY,
    REGION: process.env.REGION,
    USER_POOL_ID: process.env.USER_POOL_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    DOMAIN: process.env.DOMAIN,
    PUBLIC_CHAIN_BRIDGE_ADDRESS: process.env.PUBLIC_CHAIN_BRIDGE_ADDRESS,
    PUBLIC_CHAIN_ALIS_TOKEN_ADDRESS: process.env.PUBLIC_CHAIN_ALIS_TOKEN_ADDRESS,
    PUBLIC_CHAIN_REGISTRY_ADDRESS: process.env.PUBLIC_CHAIN_REGISTRY_ADDRESS,
    PUBLIC_CHAIN_OPERATION_URL: process.env.PUBLIC_CHAIN_OPERATION_URL,
    DAILY_LIMIT_TOKEN_SEND_VALUE: process.env.DAILY_LIMIT_TOKEN_SEND_VALUE,
    ALIS_APP_ID: process.env.ALIS_APP_ID
  }
}
