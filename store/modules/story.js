import { getStories } from '~/api/story'
import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  stories: []
})

const getters = {
  allStories: (state) => state.stories
}

const actions = {
  async getAllStories({ commit }) {
    const { data: stories } = await getStories()
    commit(types.SET_STORIES, { stories })
  }
}

const mutations = {
  [types.SET_STORIES](state, { stories }) {
    state.stories = stories
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
