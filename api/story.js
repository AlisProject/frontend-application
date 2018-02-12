import axios from '~/plugins/axios'

function sendGet(url) {
  return axios.get(url).then((response) => response.data)
}

export function getPopularStories() {
  return sendGet('/stories/popular')
}

export function getNewStories() {
  return sendGet('/stories/new')
}

export function getStory({ storyId }) {
  return sendGet(`/stories/${storyId}`)
}

export function getLikesCount({ storyId }) {
  return sendGet(`/stories/${storyId}/like`)
}

export function getPublicStoriesByUserId({ userId }) {
  return sendGet('/me/stories/public', { params: { userId } })
}

export function getDraftStoriesByUserId({ userId }) {
  return sendGet('/me/stories/drafts', { params: { userId } })
}

export function getAlisToken({ storyId }) {
  return axios.get(`/stories/${storyId}/alistoken`).then((response) => response.data)
}
