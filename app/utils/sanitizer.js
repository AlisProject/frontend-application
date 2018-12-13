const sanitize = require('sanitize-html/src/index.js')

export function sanitizeCommonTags(html) {
  return sanitize(html, {
    allowedTags: ['a', 'b', 'blockquote', 'br', 'h2', 'h3', 'i', 'p', 'u', 'hr']
  })
}
