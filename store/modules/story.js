import {
  getPopularStories,
  getNewStories,
  getStory,
  postStory,
  getLikesCount,
  getPublicStoriesByUserId,
  getDraftStoriesByUserId,
  getAlisToken
} from '~/api/story'
import { getUserInfo } from '~/api/user'
import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  story: {},
  storyId: '',
  likesCount: 0,
  stories: [],
  newStories: [],
  userInfo: {},
  userInfos: [],
  alisToken: 0,
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
  storyId: (state) => state.storyId,
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
  async getUserInfo({ commit }, { userId }) {
    const userInfo = await getUserInfo({ userId })
    commit(types.SET_USER_INFO, { userInfo })
  },
  async getUserInfos({ commit }, { stories }) {
    const userInfos = []
    for (let i = 0; i < stories.length; i++) {
      userInfos.push(await getUserInfo({ userId: stories[i].user_id }))
    }
    commit(types.SET_USER_INFOS, { userInfos })
  },
  async getAlisToken({ commit }, { storyId }) {
    const { alistoken: alisToken } = await getAlisToken({ storyId })
    commit(types.SET_ALIS_TOKEN, { alisToken })
  },
  async getAlisTokens({ commit }, { stories }) {
    const alisTokens = []
    for (let i = 0; i < stories.length; i++) {
      alisTokens.push(await getAlisToken({ storyId: stories[i].story_id }))
    }
    commit(types.SET_ALIS_TOKENS, { alisTokens })
  },
  async getEditStory({ commit }, { storyId }) {
    const story = await getStory({ storyId })
    commit(types.SET_STORY, { story })
  },
  async getStoryDetail({ commit }, { storyId }) {
    const story = await getStory({ storyId })
    commit(types.SET_STORY_DETAIL, { story })
  },
  async postNewStory({ commit }, { story }) {
    const { story_id: storyId } = await postStory({ story })
    commit(types.SET_STORY_ID, { storyId })
  },
  async getLikesCountOfStory({ commit }, { storyId }) {
    const { likes_count: likesCount } = await getLikesCount({ storyId })
    commit(types.SET_LIKES_COUNT, { likesCount })
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
  [types.SET_USER_INFO](state, { userInfo }) {
    state.userInfo = userInfo
  },
  [types.SET_USER_INFOS](state, { userInfos }) {
    state.userInfos = userInfos
  },
  [types.SET_USER_INFO_TO_STORY](state, { userInfo }) {
    state.story.user = userInfo
  },
  [types.SET_LIKES_COUNT](state, { likesCount }) {
    state.likesCount = likesCount
  },
  [types.SET_LIKES_COUNT_TO_STORY](state, { likesCount }) {
    state.story.likesCount = likesCount
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
  [types.SET_ALIS_TOKEN](state, { alisToken }) {
    state.alisToken = alisToken
  },
  [types.SET_ALIS_TOKEN_TO_STORY](state, { alisToken }) {
    state.story.alisToken = alisToken
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
  [types.SET_STORY_ID](state, { storyId }) {
    state.storyId = storyId
  },
  [types.SET_STORY_DETAIL](state, { story }) {
    state.story = story
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
