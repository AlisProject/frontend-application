import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import stories from '~/static/stories.js'

const mock = new MockAdapter(axios)

mock.onGet('/stories').reply(200, stories)

export function getStories() {
  return axios.get('/stories')
}
