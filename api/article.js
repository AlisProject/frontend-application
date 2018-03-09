import axios from '~/plugins/axios'

function sendPut(url, data) {
  return axios.put(url, data).then((response) => response.data)
}

export function publishPublicArticle({ article, articleId }) {
  return sendPut(`/me/articles/public/${articleId}/edit/publish`, article)
}

export function unpublishPublicArticle({ articleId }) {
  return sendPut(`/me/articles/public/${articleId}/unpublish`)
}
