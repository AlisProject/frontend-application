import axios from '~/plugins/axios'

export function getPopularStories() {
  return axios.get('/stories/popular').then((response) => response.data)
}

export function getStory({ id }) {
  return axios.get('/story', { params: { id } })
}

export function getPublicStoriesByUserId({ userId }) {
  return axios.get('/stories/public', { params: { userId } })
}

export function getDraftStoriesByUserId({ userId }) {
  return axios.get('/stories/draft', { params: { userId } })
}

export function getAlisToken({ storyId }) {
  return axios.get(`/stories/${storyId}/alistoken`).then((response) => response.data)
}
