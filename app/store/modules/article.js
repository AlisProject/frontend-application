/* eslint-disable space-before-function-paren */
import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  article: {},
  articleId: '',
  likesCount: 0,
  isLikedArticle: false,
  popularArticles: [],
  newArticles: [],
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
  draftArticlesLastEvaluatedKey: {},
  hasPopularArticlesLastEvaluatedKey: false,
  hasNewArticlesLastEvaluatedKey: false,
  hasPublicArticlesLastEvaluatedKey: false,
  hasDraftArticlesLastEvaluatedKey: false
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
  draftArticlesLastEvaluatedKey: (state) => state.draftArticlesLastEvaluatedKey,
  likesCount: (state) => state.likesCount,
  isLikedArticle: (state) => state.isLikedArticle
}

const actions = {
  async getPopularArticles({ commit, dispatch, state }) {
    if (!state.hasPopularArticlesLastEvaluatedKey) {
      try {
        commit(types.SET_HAS_POPULAR_ARTICLES_LAST_EVALUATED_KEY, { hasLastEvaluatedKey: true })
        const { article_id: articleId, score, evaluated_at: evaluatedAt } = state.popularArticlesLastEvaluatedKey
        const { Items: articles, LastEvaluatedKey } = await this.$axios.$get('/articles/popular', { params: { limit: 10, article_id: articleId, score, evaluated_at: evaluatedAt } })
        commit(types.SET_POPULAR_ARTICLES_LAST_EVALUATED_KEY, { lastEvaluatedKey: LastEvaluatedKey })
        const articlesWithData = await Promise.all(
          articles.map(async (article) => {
            const userInfo = await dispatch('getUserInfo', { userId: article.user_id })
            const alisToken = await dispatch('getAlisToken', { articleId: article.article_id })
            return { ...article, userInfo, alisToken }
          })
        )
        commit(types.SET_POPULAR_ARTICLES, { articles: articlesWithData })
      } catch (error) {
        Promise.reject(error)
      } finally {
        commit(types.SET_HAS_POPULAR_ARTICLES_LAST_EVALUATED_KEY, { hasLastEvaluatedKey: false })
      }
    }
  },
  async getNewPagesArticles({ commit, dispatch, state }) {
    if (!state.hasNewArticlesLastEvaluatedKey && state.newArticlesLastEvaluatedKey !== undefined) {
      try {
        commit(types.SET_HAS_NEW_ARTICLES_LAST_EVALUATED_KEY, { hasLastEvaluatedKey: true })
        const { article_id: articleId, sort_key: sortKey } = state.newArticlesLastEvaluatedKey
        const { Items: articles, LastEvaluatedKey } = await this.$axios.$get('/articles/recent', { params: { limit: 10, article_id: articleId, sort_key: sortKey } })
        commit(types.SET_NEW_ARTICLES_LAST_EVALUATED_KEY, { lastEvaluatedKey: LastEvaluatedKey })
        if (LastEvaluatedKey === undefined) {
          return
        }
        const articlesWithData = await Promise.all(
          articles.map(async (article) => {
            const userInfo = await dispatch('getUserInfo', { userId: article.user_id })
            const alisToken = await dispatch('getAlisToken', { articleId: article.article_id })
            return { ...article, userInfo, alisToken }
          })
        )
        commit(types.SET_NEW_ARTICLES, { articles: articlesWithData })
      } catch (error) {
        Promise.reject(error)
      } finally {
        commit(types.SET_HAS_NEW_ARTICLES_LAST_EVALUATED_KEY, { hasLastEvaluatedKey: false })
      }
    }
  },
  async getUserInfo({ commit }, { userId }) {
    const userInfo = await this.$axios.$get(`/users/${userId}/info`)
    return userInfo
  },
  async getAlisToken({ commit }, { articleId }) {
    const { alis_token: alisToken } = await this.$axios.$get(`/articles/${articleId}/alistoken`)
    return alisToken
  },
  async getLikesCount({ commit }, { articleId }) {
    const { count: likesCount } = await this.$axios.$get(`/articles/${articleId}/likes`)
    return likesCount
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
  async getArticleDetail({ commit, dispatch }, { articleId }) {
    try {
      const article = await this.$axios.$get(`/articles/${articleId}`)
      const userInfo = await dispatch('getUserInfo', { userId: article.user_id })
      const alisToken = await dispatch('getAlisToken', { articleId })
      const likesCount = await dispatch('getLikesCount', { articleId })
      commit(types.SET_LIKES_COUNT, { likesCount })
      commit(types.SET_ARTICLE_DETAIL, { article: { ...article, userInfo, alisToken } })
    } catch (error) {
      Promise.reject(error)
    }
  },
  async getPublicArticleDetail({ commit }, { articleId }) {
    const article = await this.$axios.$get(`/me/articles/${articleId}/public`)
    commit(types.SET_ARTICLE_DETAIL, { article })
  },
  async getEditPublicArticleDetail({ commit }, { articleId }) {
    try {
      const article = await this.$axios.$get(`/me/articles/${articleId}/public/edit`)
      if (article.eye_catch_url) {
        commit(types.UPDATE_THUMBNAIL, { thumbnail: article.eye_catch_url })
      }
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
    if (!state.hasPublicArticlesLastEvaluatedKey) {
      try {
        commit(types.SET_HAS_PUBLIC_ARTICLES_LAST_EVALUATED_KEY, { hasLastEvaluatedKey: true })
        const { article_id: articleId, sort_key: sortKey } = state.publicArticlesLastEvaluatedKey
        const { Items: articles, LastEvaluatedKey } = await this.$axios.$get('/me/articles/public', { params: { limit: 10, article_id: articleId, sort_key: sortKey } })
        commit(types.SET_PUBLIC_ARTICLES_LAST_EVALUATED_KEY, { lastEvaluatedKey: LastEvaluatedKey })
        const userInfo = await this.$axios.$get('/me/info')
        const articlesWithData = await Promise.all(
          articles.map(async (article) => {
            const alisToken = await dispatch('getAlisToken', { articleId: article.article_id })
            return { ...article, userInfo, alisToken }
          })
        )
        commit(types.SET_PUBLIC_ARTICLES, { articles: articlesWithData })
      } catch (error) {
        Promise.reject(error)
      } finally {
        commit(types.SET_HAS_PUBLIC_ARTICLES_LAST_EVALUATED_KEY, { hasLastEvaluatedKey: false })
      }
    }
  },
  async getDraftArticles({ commit, dispatch, state }) {
    if (!state.hasDraftArticlesLastEvaluatedKey) {
      try {
        commit(types.SET_DRAFT_PUBLIC_ARTICLES_LAST_EVALUATED_KEY, { hasLastEvaluatedKey: true })
        const { article_id: articleId, sort_key: sortKey } = state.draftArticlesLastEvaluatedKey
        const { Items: articles, LastEvaluatedKey } = await this.$axios.$get('/me/articles/drafts', { params: { limit: 10, article_id: articleId, sort_key: sortKey } })
        commit(types.SET_DRAFT_ARTICLES_LAST_EVALUATED_KEY, { lastEvaluatedKey: LastEvaluatedKey })
        const userInfo = await this.$axios.$get('/me/info')
        const articlesWithData = articles.map((article) => {
          return { ...article, userInfo }
        })
        commit(types.SET_DRAFT_ARTICLES, { articles: articlesWithData })
      } catch (error) {
        Promise.reject(error)
      } finally {
        commit(types.SET_DRAFT_PUBLIC_ARTICLES_LAST_EVALUATED_KEY, { hasLastEvaluatedKey: false })
      }
    }
  },
  async publishDraftArticle({ commit }, { article, articleId }) {
    await this.$axios.$put(`/me/articles/${articleId}/drafts/publish`, article)
  },
  async republishPublicArticle({ commit }, { article, articleId }) {
    await this.$axios.$put(`/me/articles/${articleId}/public/republish`, article)
  },
  async unpublishPublicArticle({ commit }, { articleId }) {
    await this.$axios.$put(`/me/articles/${articleId}/public/unpublish`)
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
  setLikesCountToArticle({ commit }, { likesCount }) {
    commit(types.SET_LIKES_COUNT_TO_ARTICLE, { likesCount })
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
  },
  async postFraud({ commit }, { articleId }) {
    try {
      await this.$axios.$post(`/me/articles/${articleId}/fraud`)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async postLike({ commit, state }, { articleId }) {
    try {
      await this.$axios.$post(`/me/articles/${articleId}/like`)
      commit(types.SET_LIKES_COUNT, { likesCount: state.likesCount + 1 })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getIsLikedArticle({ commit }, { articleId }) {
    try {
      const { liked } = await this.$axios.$get(`/me/articles/${articleId}/like`)
      commit(types.SET_IS_LIKED_ARTICLE, { liked })
      return liked
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const mutations = {
  [types.SET_POPULAR_ARTICLES](state, { articles }) {
    state.popularArticles.push(...articles)
  },
  [types.SET_NEW_ARTICLES](state, { articles }) {
    state.newArticles.push(...articles)
  },
  [types.SET_LIKES_COUNT](state, { likesCount }) {
    state.likesCount = likesCount
  },
  [types.SET_LIKES_COUNT_TO_ARTICLE](state, { likesCount }) {
    state.article.likesCount = likesCount
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
  },
  [types.SET_HAS_POPULAR_ARTICLES_LAST_EVALUATED_KEY](state, { hasLastEvaluatedKey }) {
    state.hasPopularArticlesLastEvaluatedKey = hasLastEvaluatedKey
  },
  [types.SET_HAS_NEW_ARTICLES_LAST_EVALUATED_KEY](state, { hasLastEvaluatedKey }) {
    state.hasNewArticlesLastEvaluatedKey = hasLastEvaluatedKey
  },
  [types.SET_HAS_PUBLIC_ARTICLES_LAST_EVALUATED_KEY](state, { hasLastEvaluatedKey }) {
    state.hasPublicArticlesLastEvaluatedKey = hasLastEvaluatedKey
  },
  [types.SET_DRAFT_PUBLIC_ARTICLES_LAST_EVALUATED_KEY](state, { hasLastEvaluatedKey }) {
    state.hasDraftArticlesLastEvaluatedKey = hasLastEvaluatedKey
  },
  [types.SET_IS_LIKED_ARTICLE](state, { liked }) {
    state.isLikedArticle = liked
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
