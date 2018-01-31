import {
  getStories,
  getStory,
  getPublicStoriesByUserId,
  getDraftStoriesByUserId
} from '~/api/story'
import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  stories: [],
  publicStories: [],
  draftStories: [],
  title: '',
  body: '',
  tags: [
    {
      id: Math.random()
        .toString(36)
        .slice(-9),
      name: ''
    }
  ],
  suggestedThumbnails: [],
  thumbnail: ''
})

const getters = {
  allStories: (state) => state.stories,
  publicStories: (state) => state.publicStories,
  draftStories: (state) => state.draftStories,
  title: (state) => state.title,
  body: (state) => state.body,
  suggestedThumbnails: (state) => state.suggestedThumbnails
}

const actions = {
  async getAllStories({ commit }) {
    const { data: stories } = await getStories()
    commit(types.SET_STORIES, { stories })
  },
  async getEditStory({ commit }, { id }) {
    const { data: story } = await getStory({ id })
    commit(types.SET_STORY, { story })
  },
  async getPublicStories({ commit }, { userId }) {
    const { data: stories } = await getPublicStoriesByUserId({ userId })
    commit(types.SET_PUBLIC_STORIES, { stories })
  },
  async getDraftStories({ commit }, { userId }) {
    const { data: stories } = await getDraftStoriesByUserId({ userId })
    commit(types.SET_DRAFT_STORIES, { stories })
  }
}

const mutations = {
  [types.SET_STORIES](state, { stories }) {
    state.stories = stories
  },
  [types.SET_STORY](state, { story }) {
    state.title = story.title
    state.body = story.body
  },
  [types.SET_PUBLIC_STORIES](state, { stories }) {
    state.publicStories = stories
  },
  [types.SET_DRAFT_STORIES](state, { stories }) {
    state.draftStories = stories
  },
  [types.UPDATE_TITLE](state, { title }) {
    state.title = title
  },
  [types.UPDATE_BODY](state, { body }) {
    state.body = body
  },
  [types.ADD_TAG](state, { id, name }) {
    state.tags.unshift({ id, name })
  },
  [types.UPDATE_TAG](state, { id, name }) {
    const tagIndex = state.tags.findIndex((tag) => tag.id === id)
    state.tags[tagIndex] = { id, name }
  },
  [types.UPDATE_SUGGESTED_THUMBNAILS](state, { thumbnails }) {
    state.suggestedThumbnails = thumbnails
  },
  [types.UPDATE_THUMBNAIL](state, { thumbnail }) {
    state.thumbnail = thumbnail
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
