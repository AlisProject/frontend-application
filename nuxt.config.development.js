const nuxtConfig = require('./nuxt.config.js')

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

// パブリックチェーンにデプロイされたブリッジコントラクトのアドレス
nuxtConfig.env.PUBLIC_CHAIN_BRIDGE_ADDRESS = '0x0000000000000000000000000000000000000000'
// パブリックチェーンにデプロイされたALISトークンのアドレス
nuxtConfig.env.PUBLIC_CHAIN_ALIS_TOKEN_ADDRESS = '0x1111111111111111111111111111111111111111'
// パブリックチェーン操作用URL
nuxtConfig.env.PUBLIC_CHAIN_OPERATION_URL = 'https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

module.exports = nuxtConfig
