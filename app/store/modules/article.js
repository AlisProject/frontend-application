/* eslint-disable space-before-function-paren */
import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  article: {},
  articleId: '',
  likesCount: 0,
  popularArticles: [],
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
  thumbnail: '',
  isSaving: false,
  isSaved: false,
  gotArticleData: false,
  popularArticlesLastEvaluatedKey: {},
  newArticlesLastEvaluatedKey: {},
  publicArticlesLastEvaluatedKey: {},
  draftArticlesLastEvaluatedKey: {}
})

const getters = {
  article: (state) => state.article,
  popularArticles: (state) => state.popularArticles,
  newArticles: (state) => state.newArticles,
  publicArticles: (state) => state.publicArticles,
  draftArticles: (state) => state.draftArticles,
  articleId: (state) => state.articleId,
  title: (state) => state.title,
  body: (state) => state.body,
  suggestedThumbnails: (state) => state.suggestedThumbnails,
  thumbnail: (state) => state.thumbnail,
  isSaving: (state) => state.isSaving,
  isSaved: (state) => state.isSaved,
  gotArticleData: (state) => state.gotArticleData,
  popularArticlesLastEvaluatedKey: (state) => state.popularArticlesLastEvaluatedKey,
  newArticlesLastEvaluatedKey: (state) => state.newArticlesLastEvaluatedKey,
  publicArticlesLastEvaluatedKey: (state) => state.publicArticlesLastEvaluatedKey,
  draftArticlesLastEvaluatedKey: (state) => state.draftArticlesLastEvaluatedKey
}

const actions = {
  async getPopularArticles({ commit, dispatch, state }) {
    try {
      const { article_id: articleId, score, evaluated_at: evaluatedAt } = state.popularArticlesLastEvaluatedKey
      const { Items: articles, LastEvaluatedKey } = await this.$axios.$get('/articles/popular', { params: { limit: 10, article_id: articleId, score, evaluated_at: evaluatedAt } })
      commit(types.SET_POPULAR_ARTICLES_LAST_EVALUATED_KEY, { lastEvaluatedKey: LastEvaluatedKey })
      const articlesWithData = await Promise.all(
        articles.map(async (article) => {
          const userInfo = await dispatch('getUserInfo', { userId: article.user_id })
          article.userInfo = userInfo
          return article
        })
      )
      commit(types.SET_POPULAR_ARTICLES, { articles: articlesWithData })
    } catch (error) {
      Promise.reject(error)
    }
  },
  async getNewPagesArticles({ commit, dispatch, state }) {
    try {
      const { article_id: articleId, sort_key: sortKey } = state.newArticlesLastEvaluatedKey
      const { Items: articles, LastEvaluatedKey } = await this.$axios.$get('/articles/recent', { params: { limit: 10, article_id: articleId, sort_key: sortKey } })
      commit(types.SET_NEW_ARTICLES_LAST_EVALUATED_KEY, { lastEvaluatedKey: LastEvaluatedKey })
      const articlesWithData = await Promise.all(
        articles.map(async (article) => {
          const userInfo = await dispatch('getUserInfo', { userId: article.user_id })
          article.userInfo = userInfo
          return article
        })
      )
      commit(types.SET_NEW_ARTICLES, { articles: articlesWithData })
    } catch (error) {
      Promise.reject(error)
    }
  },
  async getUserInfo({ commit }, { userId }) {
    const userInfo = await this.$axios.$get(`/users/${userId}/info`)
    return userInfo
  },
  async getUserInfos({ commit }, { articles }) {
    const userInfos = []
    for (let i = 0; i < articles.length; i++) {
      const { user_id: userId } = articles[i]
      userInfos.push(await this.$axios.$get(`/users/${userId}`))
    }
    commit(types.SET_USER_INFOS, { userInfos })
  },
  async getAlisToken({ commit }, { articleId }) {
    const { alistoken: alisToken } = await this.$axios.$get(`/articles/${articleId}/alistoken`)
    commit(types.SET_ALIS_TOKEN, { alisToken })
  },
  async getAlisTokens({ commit }, { articles }) {
    const alisTokens = []
    for (let i = 0; i < articles.length; i++) {
      const { article_id: articleId } = articles[i]
      alisTokens.push(await this.$axios.$get(`/articles/${articleId}/alistoken`))
    }
    commit(types.SET_ALIS_TOKENS, { alisTokens })
  },
  async getEditArticle({ commit }, { articleId }) {
    const article = await this.$axios.$get(`/articles/${articleId}`)
    commit(types.SET_ARTICLE, { article })
  },
  async getEditDraftArticle({ commit }, { articleId }) {
    try {
      const article = await this.$axios.$get(`/me/articles/${articleId}/drafts`)
      commit(types.SET_ARTICLE, { article })
    } catch (error) {
      Promise.reject(error)
    }
  },
  async getArticleDetail({ commit }, { articleId }) {
    try {
      const article = await this.$axios.$get(`/articles/${articleId}`)
      commit(types.SET_ARTICLE_DETAIL, { article })
    } catch (error) {
      Promise.reject(error)
    }
  },
  async getPublicArticleDetail({ commit }, { articleId }) {
    const article = await this.$axios.$get(`/me/articles/public/${articleId}`)
    commit(types.SET_ARTICLE_DETAIL, { article })
  },
  async getEditPublicArticleDetail({ commit }, { articleId }) {
    try {
      const article = await this.$axios.$get(`/me/articles/${articleId}/public/edit`)
      commit(types.SET_ARTICLE, { article })
    } catch (error) {
      Promise.reject(error)
    }
  },
  async postNewArticle({ commit }, { article }) {
    const { article_id: articleId } = await this.$axios.$post('/me/articles/drafts', article)
    commit(types.SET_ARTICLE_ID, { articleId })
  },
  async putDraftArticle({ commit }, { article, articleId }) {
    await this.$axios.$put(`/me/articles/${articleId}/drafts`, article)
  },
  async putPublicArticle({ commit }, { article, articleId }) {
    await this.$axios.$put(`/me/articles/${articleId}/public`, article)
  },
  async getLikesCountOfArticle({ commit }, { articleId }) {
    const { likes_count: likesCount } = await this.$axios.$get(`/articles/${articleId}/like`)
    commit(types.SET_LIKES_COUNT, { likesCount })
  },
  async getPublicArticles({ commit, dispatch, state }) {
    try {
      const { article_id: articleId, sort_key: sortKey } = state.publicArticlesLastEvaluatedKey
      const { Items: articles, LastEvaluatedKey } = await this.$axios.$get('/me/articles/public', { params: { limit: 10, article_id: articleId, sort_key: sortKey } })
      commit(types.SET_PUBLIC_ARTICLES_LAST_EVALUATED_KEY, { lastEvaluatedKey: LastEvaluatedKey })
      const userInfo = await this.$axios.$get('/me/info')
      const articlesWithData = articles.map((article) => {
        article.userInfo = userInfo
        return article
      })
      commit(types.SET_PUBLIC_ARTICLES, { articles: articlesWithData })
    } catch (error) {
      Promise.reject(error)
    }
  },
  async getDraftArticles({ commit, dispatch, state }) {
    try {
      const { article_id: articleId, sort_key: sortKey } = state.draftArticlesLastEvaluatedKey
      const { Items: articles, LastEvaluatedKey } = await this.$axios.$get('/me/articles/drafts', { params: { limit: 10, article_id: articleId, sort_key: sortKey } })
      commit(types.SET_DRAFT_ARTICLES_LAST_EVALUATED_KEY, { lastEvaluatedKey: LastEvaluatedKey })
      const userInfo = await this.$axios.$get('/me/info')
      const articlesWithData = articles.map((article) => {
        article.userInfo = userInfo
        return article
      })
      commit(types.SET_DRAFT_ARTICLES, { articles: articlesWithData })
    } catch (error) {
      Promise.reject(error)
    }
  },
  async publishDraftArticle({ commit }, { article, articleId }) {
    await this.$axios.$put(`/me/articles/${articleId}/drafts/publish`, article)
  },
  async republishPublicArticle({ commit }, { article, articleId }) {
    await this.$axios.$put(`/me/articles/${articleId}/public/republish`, article)
  },
  async unpublishPublicArticle({ commit }, { articleId }) {
    await this.$axios.$put(`/me/articles/public/${articleId}/unpublish`)
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
  },
  setIsSaving({ commit }, { isSaving }) {
    commit(types.SET_IS_SAVING, { isSaving })
  },
  setIsSaved({ commit }, { isSaved }) {
    commit(types.SET_IS_SAVED, { isSaved })
  },
  async postArticleImage({ commit }, { articleId, articleImage, imageContentType }) {
    try {
      const config = {
        headers: { 'content-type': imageContentType }
      }
      const result = await this.$axios.$post(`/me/articles/${articleId}/images`,
        { article_image: articleImage }, config
      )
      return result
    } catch (error) {
      Promise.reject(error)
    }
  },
  setGotArticleData({ commit }, { gotArticleData }) {
    commit(types.SET_GOT_ARTICLE_DATA, { gotArticleData })
  }
}

const mutations = {
  [types.SET_POPULAR_ARTICLES](state, { articles }) {
    state.popularArticles.push(...articles)
  },
  [types.SET_NEW_ARTICLES](state, { articles }) {
    state.newArticles.push(...articles)
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
        this.popularArticles = articles
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
        this.popularArticles = articles
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
    state.publicArticles.push(...articles)
  },
  [types.SET_DRAFT_ARTICLES](state, { articles }) {
    state.draftArticles.push(...articles)
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
  },
  [types.SET_IS_SAVING](state, { isSaving }) {
    state.isSaving = isSaving
  },
  [types.SET_IS_SAVED](state, { isSaved }) {
    state.isSaved = isSaved
  },
  [types.SET_GOT_ARTICLE_DATA](state, { gotArticleData }) {
    state.gotArticleData = gotArticleData
  },
  [types.SET_POPULAR_ARTICLES_LAST_EVALUATED_KEY](state, { lastEvaluatedKey }) {
    state.popularArticlesLastEvaluatedKey = lastEvaluatedKey
  },
  [types.SET_NEW_ARTICLES_LAST_EVALUATED_KEY](state, { lastEvaluatedKey }) {
    state.newArticlesLastEvaluatedKey = lastEvaluatedKey
  },
  [types.SET_PUBLIC_ARTICLES_LAST_EVALUATED_KEY](state, { lastEvaluatedKey }) {
    state.publicArticlesLastEvaluatedKey = lastEvaluatedKey
  },
  [types.SET_DRAFT_ARTICLES_LAST_EVALUATED_KEY](state, { lastEvaluatedKey }) {
    state.draftArticlesLastEvaluatedKey = lastEvaluatedKey
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
