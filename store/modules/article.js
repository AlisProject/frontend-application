import * as articleApi from '~/api/article'
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
  suggestedThumbnails: (state) => state.suggestedThumbnails,
  thumbnail: (state) => state.thumbnail
}

const actions = {
  async getAllArticles({ commit }) {
    const articles = await articleApi.getPopularArticles()
    commit(types.SET_ARTICLES, { articles })
  },
  async getNewPagesArticles({ commit }) {
    const articles = await articleApi.getNewArticles()
    commit(types.SET_NEW_ARTICLES, { articles })
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
    const { alistoken: alisToken } = await articleApi.getAlisToken({ articleId })
    commit(types.SET_ALIS_TOKEN, { alisToken })
  },
  async getAlisTokens({ commit }, { articles }) {
    const alisTokens = []
    for (let i = 0; i < articles.length; i++) {
      alisTokens.push(await articleApi.getAlisToken({ articleId: articles[i].article_id }))
    }
    commit(types.SET_ALIS_TOKENS, { alisTokens })
  },
  async getEditArticle({ commit }, { articleId }) {
    const article = await articleApi.getArticle({ articleId })
    commit(types.SET_ARTICLE, { article })
  },
  async getEditDraftArticle({ commit }, { articleId }) {
    const article = await articleApi.getDraftArticle({ articleId })
    commit(types.SET_ARTICLE, { article })
  },
  async getArticleDetail({ commit }, { articleId }) {
    const article = await articleApi.getArticle({ articleId })
    commit(types.SET_ARTICLE_DETAIL, { article })
  },
  async getPublicArticleDetail({ commit }, { articleId }) {
    const article = await articleApi.getPublicArticle({ articleId })
    commit(types.SET_ARTICLE_DETAIL, { article })
  },
  async getEditPublicArticleDetail({ commit }, { articleId }) {
    const article = await articleApi.getEditPublicArticle({ articleId })
    commit(types.SET_ARTICLE, { article })
  },
  async postNewArticle({ commit }, { article }) {
    const { article_id: articleId } = await articleApi.postArticle({ article })
    commit(types.SET_ARTICLE_ID, { articleId })
  },
  async putDraftArticle({ commit }, { article, articleId }) {
    await articleApi.putDraftArticle({ article, articleId })
  },
  async getLikesCountOfArticle({ commit }, { articleId }) {
    const { likes_count: likesCount } = await articleApi.getLikesCount({ articleId })
    commit(types.SET_LIKES_COUNT, { likesCount })
  },
  async getPublicArticles({ commit }, { userId }) {
    const articles = await articleApi.getPublicArticlesByUserId({ userId })
    commit(types.SET_PUBLIC_ARTICLES, { articles })
  },
  async getDraftArticles({ commit }, { userId }) {
    const articles = await articleApi.getDraftArticlesByUserId({ userId })
    commit(types.SET_DRAFT_ARTICLES, { articles })
  },
  updateTitle({ commit }, { title }) {
    commit(types.UPDATE_TITLE, { title })
  },
  updateBody({ commit }, { body }) {
    commit(types.UPDATE_BODY, { body })
  },
  addTag({ commit }, { id, name }) {
    commit(types.ADD_TAG, { id, name })
  },
  updateTag({ commit }, { id, name }) {
    commit(types.UPDATE_TAG, { id, name })
  },
  updateSuggestedThumbnails({ commit }, { thumbnails }) {
    commit(types.UPDATE_SUGGESTED_THUMBNAILS, { thumbnails })
  },
  updateThumbnail({ commit }, { thumbnail }) {
    commit(types.UPDATE_THUMBNAIL, { thumbnail })
  },
  setUserInfoToArticle({ commit }, { userInfo }) {
    commit(types.SET_USER_INFO_TO_ARTICLE, { userInfo })
  },
  setLikesCountToArticle({ commit }, { likesCount }) {
    commit(types.SET_LIKES_COUNT_TO_ARTICLE, { likesCount })
  },
  setAlisTokenToArticle({ commit }, { alisToken }) {
    commit(types.SET_ALIS_TOKEN_TO_ARTICLE, { alisToken })
  },
  setUserInfoToArticles({ commit }, { articles, userInfos, type }) {
    commit(types.SET_USER_INFO_TO_ARTICLES, { articles, userInfos, type })
  },
  setAlisTokenToArticles({ commit }, { articles, alisTokens, type }) {
    commit(types.SET_ALIS_TOKEN_TO_ARTICLES, { articles, alisTokens, type })
  }
}

const mutations = {
  [types.SET_ARTICLES](state, { articles }) {
    state.articles = articles
  },
  [types.SET_NEW_ARTICLES](state, { articles }) {
    state.newArticles = articles
  },
  [types.SET_USER_INFO](state, { userInfo }) {
    state.userInfo = userInfo
  },
  [types.SET_USER_INFOS](state, { userInfos }) {
    state.userInfos = userInfos
  },
  [types.SET_USER_INFO_TO_ARTICLE](state, { userInfo }) {
    state.article.user = userInfo
  },
  [types.SET_LIKES_COUNT](state, { likesCount }) {
    state.likesCount = likesCount
  },
  [types.SET_LIKES_COUNT_TO_ARTICLE](state, { likesCount }) {
    state.article.likesCount = likesCount
  },
  [types.SET_USER_INFO_TO_ARTICLES](state, { articles, userInfos, type = 'default' }) {
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
  [types.SET_ALIS_TOKEN_TO_ARTICLE](state, { alisToken }) {
    state.article.alisToken = alisToken
  },
  [types.SET_ALIS_TOKENS](state, { alisTokens }) {
    state.alisTokens = alisTokens
  },
  [types.SET_ALIS_TOKEN_TO_ARTICLES](state, { articles, alisTokens, type = 'default' }) {
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
  [types.SET_ARTICLE](state, { article }) {
    state.title = article.title
    state.body = article.body
  },
  [types.SET_ARTICLE_ID](state, { articleId }) {
    state.articleId = articleId
  },
  [types.SET_ARTICLE_DETAIL](state, { article }) {
    state.article = article
  },
  [types.SET_PUBLIC_ARTICLES](state, { articles }) {
    state.publicArticles = articles
  },
  [types.SET_DRAFT_ARTICLES](state, { articles }) {
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
