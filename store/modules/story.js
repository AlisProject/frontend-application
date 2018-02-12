import {
  getPopularStories,
  getNewStories,
  getStory,
  getPublicStoriesByUserId,
  getDraftStoriesByUserId,
  getAlisToken
} from '~/api/story'
import { getUserInfo } from '~/api/user'
import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  stories: [],
  newStories: [],
  userInfos: [],
  alisTokens: [],
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
  newStories: (state) => state.newStories,
  publicStories: (state) => state.publicStories,
  draftStories: (state) => state.draftStories,
  title: (state) => state.title,
  body: (state) => state.body,
  suggestedThumbnails: (state) => state.suggestedThumbnails
}

const actions = {
  async getAllStories({ commit }) {
    const stories = await getPopularStories()
    commit(types.SET_STORIES, { stories })
  },
  async getNewPagesStories({ commit }) {
    const stories = await getNewStories()
    commit(types.SET_NEW_STORIES, { stories })
  },
  async getUserInfos({ commit }, { stories }) {
    const userInfos = []
    for (let i = 0; i < stories.length; i++) {
      userInfos.push(await getUserInfo({ userId: stories[i].user_id }))
    }
    commit(types.SET_USER_INFOS, { userInfos })
  },
  async getAlisTokens({ commit }, { stories }) {
    const alisTokens = []
    for (let i = 0; i < stories.length; i++) {
      alisTokens.push(await getAlisToken({ storyId: stories[i].story_id }))
    }
    commit(types.SET_ALIS_TOKENS, { alisTokens })
  },
  async getEditStory({ commit }, { id }) {
    const { data: story } = await getStory({ id })
    commit(types.SET_STORY, { story })
  },
  async getPublicStories({ commit }, { userId }) {
    const stories = await getPublicStoriesByUserId({ userId })
    commit(types.SET_PUBLIC_STORIES, { stories })
  },
  async getDraftStories({ commit }, { userId }) {
    const stories = await getDraftStoriesByUserId({ userId })
    commit(types.SET_DRAFT_STORIES, { stories })
  }
}

const mutations = {
  [types.SET_STORIES](state, { stories }) {
    state.stories = stories
  },
  [types.SET_NEW_STORIES](state, { stories }) {
    state.newStories = stories
  },
  [types.SET_USER_INFOS](state, { userInfos }) {
    state.userInfos = userInfos
  },
  [types.SET_USER_INFO_TO_STORIES](state, { stories, userInfos, type = 'default' }) {
    for (let i = 0; i < stories.length; i++) {
      stories[i].user = userInfos[i]
    }
    switch (type) {
      case 'public':
        this.publicStories = stories
        break
      case 'draft':
        this.draftStories = stories
        break
      case 'new':
        this.newStories = stories
        break
      default:
        this.stories = stories
        break
    }
  },
  [types.SET_ALIS_TOKENS](state, { alisTokens }) {
    state.alisTokens = alisTokens
  },
  [types.SET_ALIS_TOKEN_TO_STORIES](state, { stories, alisTokens, type = 'default' }) {
    for (let i = 0; i < stories.length; i++) {
      stories[i].alisToken = alisTokens[i].alistoken
    }
    switch (type) {
      case 'public':
        this.publicStories = stories
        break
      case 'draft':
        this.draftStories = stories
        break
      case 'new':
        this.newStories = stories
        break
      default:
        this.stories = stories
        break
    }
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
