import Vuex from 'vuex'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import stories from '~/static/stories.js'

const mock = new MockAdapter(axios)

mock.onGet('/stories').reply(200, stories)

const store = () =>
  new Vuex.Store({
    state: {
      stories: []
    },
    mutations: {
      setStories(state, stories) {
        state.stories = stories
      }
    },
    actions: {
      async getStories({ commit }) {
        const { data } = await axios.get('/stories')
        commit('setStories', data)
      }
    }
  })

export default store
