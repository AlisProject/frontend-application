const axiosRetry = require('axios-retry')
const CKEditorStyles = require('@ckeditor/ckeditor5-dev-utils').styles

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
        content: `https://${process.env.ALIS_APP_DOMAIN}/d/nuxt/dist/OGP_1200×630.png`
      },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:site', name: 'twitter:site', content: '@ALIS_media' },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: `https://${process.env.ALIS_APP_DOMAIN}/d/nuxt/dist/OGP_1200×630.png`
      },
      { hid: 'fb:app_id', property: 'fb:app_id', content: '2157199921164241' }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: `https://${process.env.ALIS_APP_DOMAIN}/d/nuxt/dist/favicon.ico`
      },
      {
        rel: 'apple-touch-icon',
        sizes: '192x192',
        href: `https://${process.env.ALIS_APP_DOMAIN}/d/nuxt/dist/touch-icon.png`
      },
      {
        rel: 'shortcut icon',
        href: `https://${process.env.ALIS_APP_DOMAIN}/d/nuxt/dist/touch-icon.png`
      },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css'
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
  modules: ['@nuxtjs/axios', '@nuxtjs/markdownit', '@nuxtjs/style-resources', '@nuxtjs/sentry'],
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
    { src: '~/plugins/editor', ssr: false },
    { src: '~/plugins/lazysizes', ssr: false }
  ],
  axios: {
    baseURL: process.env.BASE_URL,
    proxyHeaders: false,
    retry: {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay
    }
  },
  sentry: {
    dsn: `${process.env.SENTRY_DSN}`
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
    /**
     * この postcss 設定を足さないと CKEditor5 ^16.0.0 で build された
     * AlisEditor.css の parse にシンタックスエラーが起きる
     */
    postcss: CKEditorStyles.getPostCssConfig({
      themeImporter: {
        themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
      },
      minify: true
    }),

    publicPath: `https://${process.env.ALIS_APP_DOMAIN}/d/nuxt/dist/`,
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
    },

    /**
     * Edgeブラウザ対応のためeditorプラグインをトランスパイルする
     */
    transpile: ['editor'],

    /**
     * editorプラグインのトランスパイル時にエラーが出力されるため、明示的にcompactを有効化する
     * [参考] https://stackoverflow.com/questions/35192796/babel-note-the-code-generator-has-deoptimised-the-styling-of-app-js-as-it-exc
     */
    babel: {
      compact: true
    }
  },
  css: [
    '~assets/stylesheets/medium-editor.scss',
    '~assets/stylesheets/vuex-toast.scss',
    '@alisproject/alis-editor/dist/AlisEditor.css',
    '~/assets/stylesheets/gruvbox-dark-modified.css',
    '~assets/stylesheets/ckeditor-view.scss'
  ],
  env: {
    IFRAMELY_API_KEY: process.env.IFRAMELY_API_KEY,
    REGION: process.env.AWS_DEFAULT_REGION,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    COGNITO_APP_CLIENT_ID: process.env.COGNITO_APP_CLIENT_ID,
    ALIS_APP_DOMAIN: process.env.ALIS_APP_DOMAIN,
    WEB3_SERVICE_BASE_URL: process.env.WEB3_SERVICE_BASE_URL,
    PUBLIC_CHAIN_BRIDGE_ADDRESS: process.env.PUBLIC_CHAIN_BRIDGE_ADDRESS,
    PUBLIC_CHAIN_ALIS_TOKEN_ADDRESS: process.env.PUBLIC_CHAIN_ALIS_TOKEN_ADDRESS,
    PUBLIC_CHAIN_REGISTRY_ADDRESS: process.env.PUBLIC_CHAIN_REGISTRY_ADDRESS,
    PUBLIC_CHAIN_LICENSE_TOKEN_ADDRESS: process.env.PUBLIC_CHAIN_LICENSE_TOKEN_ADDRESS,
    PUBLIC_CHAIN_OPERATION_URL: process.env.PUBLIC_CHAIN_OPERATION_URL,
    PRIVATE_CHAIN_ALIS_TOKEN_ADDRESS: process.env.PRIVATE_CHAIN_ALIS_TOKEN_ADDRESS,
    PRIVATE_CHAIN_BRIDGE_ADDRESS: process.env.PRIVATE_CHAIN_BRIDGE_ADDRESS,
    BURN_ADDRESS: process.env.BURN_ADDRESS,
    DAILY_LIMIT_TOKEN_SEND_VALUE: process.env.DAILY_LIMIT_TOKEN_SEND_VALUE,
    SENTRY_DSN: process.env.SENTRY_DSN,
    ALIS_APP_ID: process.env.ALIS_APP_ID,
    COGNITO_IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID,
    ALL_TOKEN_HISTORY_CSV_DWONLOAD_S3_BUCKET: process.env.ALL_TOKEN_HISTORY_CSV_DWONLOAD_S3_BUCKET,
    AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION
  }
}
