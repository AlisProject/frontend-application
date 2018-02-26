import {
  getPopularArticles,
  getNewArticles,
  getArticle,
  postArticle,
  getLikesCount,
  getPublicArticlesByUserId,
  getDraftArticlesByUserId,
  getAlisToken
} from '~/api/article'
import { getUserInfo } from '~/api/user'
import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  article: {},
  articleId: '',
  likesCount: 0,
  articles: [],
  newArticles: [],
  userInfo: {},
  userInfos: [],
  alisToken: 0,
  alisTokens: [],
  publicArticles: [],
  draftArticles: [],
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
  allArticles: (state) => state.articles,
  newArticles: (state) => state.newArticles,
  publicArticles: (state) => state.publicArticles,
  draftArticles: (state) => state.draftArticles,
  articleId: (state) => state.articleId,
  title: (state) => state.title,
  body: (state) => state.body,
  suggestedThumbnails: (state) => state.suggestedThumbnails
}

const actions = {
  async getAllArticles({ commit }) {
    const articles = await getPopularArticles()
    commit(types.SET_STORIES, { articles })
  },
  async getNewPagesArticles({ commit }) {
    const articles = await getNewArticles()
    commit(types.SET_NEW_STORIES, { articles })
  },
  async getUserInfo({ commit }, { userId }) {
    const userInfo = await getUserInfo({ userId })
    commit(types.SET_USER_INFO, { userInfo })
  },
  async getUserInfos({ commit }, { articles }) {
    const userInfos = []
    for (let i = 0; i < articles.length; i++) {
      userInfos.push(await getUserInfo({ userId: articles[i].user_id }))
    }
    commit(types.SET_USER_INFOS, { userInfos })
  },
  async getAlisToken({ commit }, { articleId }) {
    const { alistoken: alisToken } = await getAlisToken({ articleId })
    commit(types.SET_ALIS_TOKEN, { alisToken })
  },
  async getAlisTokens({ commit }, { articles }) {
    const alisTokens = []
    for (let i = 0; i < articles.length; i++) {
      alisTokens.push(await getAlisToken({ articleId: articles[i].article_id }))
    }
    commit(types.SET_ALIS_TOKENS, { alisTokens })
  },
  async getEditArticle({ commit }, { articleId }) {
    const article = await getArticle({ articleId })
    commit(types.SET_STORY, { article })
  },
  async getArticleDetail({ commit }, { articleId }) {
    const article = await getArticle({ articleId })
    commit(types.SET_STORY_DETAIL, { article })
  },
  async postNewArticle({ commit }, { article }) {
    const { article_id: articleId } = await postArticle({ article })
    commit(types.SET_STORY_ID, { articleId })
  },
  async getLikesCountOfArticle({ commit }, { articleId }) {
    const { likes_count: likesCount } = await getLikesCount({ articleId })
    commit(types.SET_LIKES_COUNT, { likesCount })
  },
  async getPublicArticles({ commit }, { userId }) {
    const articles = await getPublicArticlesByUserId({ userId })
    commit(types.SET_PUBLIC_STORIES, { articles })
  },
  async getDraftArticles({ commit }, { userId }) {
    const articles = await getDraftArticlesByUserId({ userId })
    commit(types.SET_DRAFT_STORIES, { articles })
  }
}

const mutations = {
  [types.SET_STORIES](state, { articles }) {
    state.articles = articles
  },
  [types.SET_NEW_STORIES](state, { articles }) {
    state.newArticles = articles
  },
  [types.SET_USER_INFO](state, { userInfo }) {
    state.userInfo = userInfo
  },
  [types.SET_USER_INFOS](state, { userInfos }) {
    state.userInfos = userInfos
  },
  [types.SET_USER_INFO_TO_STORY](state, { userInfo }) {
    state.article.user = userInfo
  },
  [types.SET_LIKES_COUNT](state, { likesCount }) {
    state.likesCount = likesCount
  },
  [types.SET_LIKES_COUNT_TO_STORY](state, { likesCount }) {
    state.article.likesCount = likesCount
  },
  [types.SET_USER_INFO_TO_STORIES](state, { articles, userInfos, type = 'default' }) {
    for (let i = 0; i < articles.length; i++) {
      articles[i].user = userInfos[i]
    }
    switch (type) {
      case 'public':
        this.publicArticles = articles
        break
      case 'draft':
        this.draftArticles = articles
        break
      case 'new':
        this.newArticles = articles
        break
      default:
        this.articles = articles
        break
    }
  },
  [types.SET_ALIS_TOKEN](state, { alisToken }) {
    state.alisToken = alisToken
  },
  [types.SET_ALIS_TOKEN_TO_STORY](state, { alisToken }) {
    state.article.alisToken = alisToken
  },
  [types.SET_ALIS_TOKENS](state, { alisTokens }) {
    state.alisTokens = alisTokens
  },
  [types.SET_ALIS_TOKEN_TO_STORIES](state, { articles, alisTokens, type = 'default' }) {
    for (let i = 0; i < articles.length; i++) {
      articles[i].alisToken = alisTokens[i].alistoken
    }
    switch (type) {
      case 'public':
        this.publicArticles = articles
        break
      case 'draft':
        this.draftArticles = articles
        break
      case 'new':
        this.newArticles = articles
        break
      default:
        this.articles = articles
        break
    }
  },
  [types.SET_STORY](state, { article }) {
    state.title = article.title
    state.body = article.body
  },
  [types.SET_STORY_ID](state, { articleId }) {
    state.articleId = articleId
  },
  [types.SET_STORY_DETAIL](state, { article }) {
    state.article = article
  },
  [types.SET_PUBLIC_STORIES](state, { articles }) {
    state.publicArticles = articles
  },
  [types.SET_DRAFT_STORIES](state, { articles }) {
    state.draftArticles = articles
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
