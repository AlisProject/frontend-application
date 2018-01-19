import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import stories from '~/static/stories.js'

const mock = new MockAdapter(axios)

mock.onGet('/stories').reply(200, stories)
mock.onGet('/stories/public', { params: { userId: '1' } }).reply(200, stories)

for (let i = 0; i < 10; i++) {
  const id = String(i + 1)
  mock.onGet('/story', { params: { id } }).reply(200, stories[i])
}

export function getStories() {
  return axios.get('/stories')
}

export function getStory({ id }) {
  return axios.get('/story', { params: { id } })
}

export function getPublicStoriesByUserId({ userId }) {
  return axios.get('/stories/public', { params: { userId } })
}
