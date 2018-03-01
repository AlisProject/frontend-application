import axios from '~/plugins/axios'

function sendGet(url) {
  return axios.get(url).then((response) => response.data)
}

function sendPost(url, data) {
  return axios.post(url, data).then((response) => response.data)
}

function sendPut(url, data) {
  return axios.put(url, data).then((response) => response.data)
}

export function getPopularArticles() {
  return sendGet('/articles/popular')
}

export function getNewArticles() {
  return sendGet('/articles/new')
}

export function getArticle({ articleId }) {
  return sendGet(`/articles/${articleId}`)
}

export function postArticle({ article }) {
  return sendPost('/me/articles/drafts', article)
}

export function getLikesCount({ articleId }) {
  return sendGet(`/articles/${articleId}/like`)
}

export function getPublicArticlesByUserId({ userId }) {
  return sendGet('/me/articles/public', { params: { userId } })
}

export function getDraftArticlesByUserId({ userId }) {
  return sendGet('/me/articles/drafts', { params: { userId } })
}

export function getAlisToken({ articleId }) {
  return axios.get(`/articles/${articleId}/alistoken`).then((response) => response.data)
}

export function putDraftArticle({ article, articleId }) {
  return sendPut(`/me/articles/drafts/${articleId}`, article)
}
