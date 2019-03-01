const loggerMiddleware = (req, res, next) => {
  console.log('[info]', 'Request URL: ', req.url)
  next()
}

module.exports = {
  loggerMiddleware
}
