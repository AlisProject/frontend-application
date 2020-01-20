'use strict'

const awsServerlessExpress = require('aws-serverless-express')
const { app } = require('./app')

const server = awsServerlessExpress.createServer(app)

/*
URLエンコードされていない不正な path (ex. /tag/￩ﾶﾏ￨ﾂﾉ￦ﾖﾙ￧ﾐﾆ) が指定された場合、そのまま awsServerlessExpress.proxy に連携すると、
内部で例外（ERR_UNESCAPED_CHARACTERS）をキャッチし、StatusCode 500 を返却する。
ただし、path の入力ミスはクライアント側の問題であり StatusCode 400 が正しいため、path については
awsServerlessExpress.proxy 連携前に検証し、問題があった場合は 400 を返却するようにしている。
チェックの内容については node 内で利用されているものと同様の正規表現を利用。
https://github.com/nodejs/node/blob/c9b93e234454322ac0b7a6cd29d394f428f3e37d/lib/_http_client.js#L67
*/
const INVALID_PATH_REGEX = /[^\u0021-\u00ff]/

module.exports.handler = (event, context, callback) => {
  console.log('[info]', 'Event', JSON.stringify(event))
  if (INVALID_PATH_REGEX.test(event.path)) {
    console.log(`Invalid path: ${event.path}`)
    const response = {
      statusCode: 400,
      headers: {},
      body: '',
      isBase64Encoded: false
    }
    // 待機中のイベントがあっても処理を中断
    context.callbackWaitsForEmptyEventLoop = false
    callback(null, response)
  } else {
    awsServerlessExpress.proxy(server, event, context)
  }
}
