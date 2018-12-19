/**
 * レスポンスヘッダーを設定するミドルウェア
 * XSS 対策などのヘッダーを記述
 */
const setHeadersMiddleware = (req, res, next) => {
  res.removeHeader('x-powered-by')
  res.header('no-cache', 'Set-Cookie')
  res.header('x-xss-protection', '1; mode=block')
  res.header('x-frame-options', 'DENY')
  res.header('x-content-type-options', 'nosniff')
  res.header('Cache-Control', 'max-age=120')
  next()
}

module.exports = {
  setHeadersMiddleware
}
