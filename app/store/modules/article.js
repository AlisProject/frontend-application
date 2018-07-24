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
  gotArticleData: false,
  popularArticlesLastEvaluatedKey: {},
  newArticlesLastEvaluatedKey: {},
  publicArticlesLastEvaluatedKey: {},
  draftArticlesLastEvaluatedKey: {},
  hasPopularArticlesLastEvaluatedKey: false,
  hasPublicArticlesLastEvaluatedKey: false,
  hasDraftArticlesLastEvaluatedKey: false,
  isEdited: false,
  saveStatus: '',
  articleCommentsLastEvaluatedKey: {},
  articleCommentLikedCommentIds: [],
  searchArticles: {
    articles: [],
    page: 1,
    isLastPage: false,
    isFetching: false
  }
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
  gotArticleData: (state) => state.gotArticleData,
  popularArticlesLastEvaluatedKey: (state) => state.popularArticlesLastEvaluatedKey,
  newArticlesLastEvaluatedKey: (state) => state.newArticlesLastEvaluatedKey,
  hasNewArticlesLastEvaluatedKey: (state) =>
    !!Object.keys(state.newArticlesLastEvaluatedKey || {}).length,
  publicArticlesLastEvaluatedKey: (state) => state.publicArticlesLastEvaluatedKey,
  draftArticlesLastEvaluatedKey: (state) => state.draftArticlesLastEvaluatedKey,
  likesCount: (state) => state.likesCount,
  isLikedArticle: (state) => state.isLikedArticle,
  isEdited: (state) => state.isEdited,
  saveStatus: (state) => state.saveStatus,
  articleCommentsLastEvaluatedKey: (state) => state.articleCommentsLastEvaluatedKey,
  hasArticleCommentsLastEvaluatedKey: (state) =>
    !!Object.keys(state.articleCommentsLastEvaluatedKey || {}).length,
  articleCommentLikedCommentIds: (state) => state.articleCommentLikedCommentIs,
  searchArticles: (state) => state.searchArticles
}

const actions = {
  async getPopularArticles({ commit, dispatch, state }) {
    if (!state.hasPopularArticlesLastEvaluatedKey) {
      try {
        commit(types.SET_HAS_POPULAR_ARTICLES_LAST_EVALUATED_KEY, { hasLastEvaluatedKey: true })
        const {
          article_id: articleId,
          score,
          evaluated_at: evaluatedAt
        } = state.popularArticlesLastEvaluatedKey
        const { Items: articles, LastEvaluatedKey } = await this.$axios.$get('/articles/popular', {
          params: { limit: 10, article_id: articleId, score, evaluated_at: evaluatedAt }
        })
        commit(types.SET_POPULAR_ARTICLES_LAST_EVALUATED_KEY, {
          lastEvaluatedKey: LastEvaluatedKey
        })
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
  async getNewPagesArticles({ commit, getters, dispatch, state }) {
    try {
      const { article_id: articleId, sort_key: sortKey } = state.newArticlesLastEvaluatedKey
      let articles = []
      let LastEvaluatedKey = {}
      if (articleId && sortKey) {
        const data = await this.$axios.$get(
          `/articles/recent?limit=10&article_id=${articleId}&sort_key=${sortKey}`
        )
        articles = data.Items
        LastEvaluatedKey = data.LastEvaluatedKey
      } else {
        const data = await this.$axios.$get('/articles/recent?limit=10')
        articles = data.Items
        LastEvaluatedKey = data.LastEvaluatedKey
      }
      commit(types.SET_NEW_ARTICLES_LAST_EVALUATED_KEY, { lastEvaluatedKey: LastEvaluatedKey })
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
      if (article.eye_catch_url) {
        commit(types.UPDATE_THUMBNAIL, { thumbnail: article.eye_catch_url })
      }
      commit(types.SET_ARTICLE, { article })
      commit(types.SET_ARTICLE_ID, { articleId })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getArticleDetail({ commit, dispatch }, { articleId }) {
    try {
      const article = await this.$axios.$get(`/articles/${articleId}`)
      const userInfo = await dispatch('getUserInfo', { userId: article.user_id })
      const alisToken = await dispatch('getAlisToken', { articleId })
      const likesCount = await dispatch('getLikesCount', { articleId })
      const comments = await dispatch('getArticleComments', { articleId })
      commit(types.SET_LIKES_COUNT, { likesCount })
      commit(types.SET_ARTICLE_DETAIL, { article: { ...article, userInfo, alisToken, comments } })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getPublicArticleDetail({ commit }, { articleId }) {
    const article = await this.$axios.$get(`/me/articles/${articleId}/public`)
    commit(types.SET_ARTICLE_DETAIL, { article })
    commit(types.SET_ARTICLE_ID, { articleId })
  },
  async getEditPublicArticleDetail({ commit }, { articleId }) {
    try {
      const article = await this.$axios.$get(`/me/articles/${articleId}/public/edit`)
      if (article.eye_catch_url) {
        commit(types.UPDATE_THUMBNAIL, { thumbnail: article.eye_catch_url })
      }
      commit(types.SET_ARTICLE, { article })
      commit(types.SET_ARTICLE_ID, { articleId })
    } catch (error) {
      return Promise.reject(error)
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
        const { Items: articles, LastEvaluatedKey } = await this.$axios.$get(
          '/me/articles/public',
          { params: { limit: 10, article_id: articleId, sort_key: sortKey } }
        )
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
        const { Items: articles, LastEvaluatedKey } = await this.$axios.$get(
          '/me/articles/drafts',
          { params: { limit: 10, article_id: articleId, sort_key: sortKey } }
        )
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
  async postArticleImage({ commit }, { articleId, articleImage, imageContentType }) {
    try {
      const config = {
        headers: { 'content-type': imageContentType }
      }
      const result = await this.$axios.$post(
        `/me/articles/${articleId}/images`,
        { article_image: articleImage },
        config
      )
      return result
    } catch (error) {
      Promise.reject(error)
    }
  },
  setGotArticleData({ commit }, { gotArticleData }) {
    commit(types.SET_GOT_ARTICLE_DATA, { gotArticleData })
  },
  postPv({ commit }, { articleId }) {
    this.$axios.$post(`/me/articles/${articleId}/pv`)
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
  },
  setIsLikedArticle({ commit }, { liked }) {
    commit(types.SET_IS_LIKED_ARTICLE, { liked })
  },
  setIsEdited({ commit }, { isEdited }) {
    commit(types.SET_IS_EDITED, { isEdited })
  },
  setSaveStatus({ commit }, { saveStatus }) {
    commit(types.SET_SAVE_STATUS, { saveStatus })
  },
  async postArticleComment({ commit }, { articleId, text }) {
    try {
      const { comment_id: commentId } = await this.$axios.$post(
        `/me/articles/${articleId}/comments`,
        { text }
      )
      return commentId
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getArticleComments({ commit, dispatch, state }, { articleId }) {
    try {
      const {
        article_id: articleCommentsarticleId,
        comment_id: commentId,
        sort_key: sortKey
      } = state.articleCommentsLastEvaluatedKey
      const paramsWithKeys = {
        limit: 10,
        comment_id: commentId,
        article_id: articleCommentsarticleId,
        sort_key: sortKey
      }
      const params = commentId && sortKey ? paramsWithKeys : { limit: 5 }

      const { Items: comments, LastEvaluatedKey } = await this.$axios.$get(
        `/articles/${articleId}/comments`,
        { params }
      )
      commit(types.SET_ARTICLE_COMMENTS_LAST_EVALUATED_KEY, {
        lastEvaluatedKey: LastEvaluatedKey || {}
      })
      const commentsWithData = await Promise.all(
        comments.map(async (comment) => {
          const userInfo = await dispatch('getUserInfo', { userId: comment.user_id })
          let isLiked = state.articleCommentLikedCommentIds.includes(comment.comment_id)
          const likesCount = await dispatch('getArticleCommentLikesCount', {
            commentId: comment.comment_id
          })
          return { ...comment, userInfo, isLiked, likesCount }
        })
      )
      return commentsWithData
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async setArticleComments({ commit, dispatch }, { articleId }) {
    try {
      const comments = await dispatch('getArticleComments', { articleId })
      commit(types.SET_ARTICLE_COMMENTS, { comments })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async postCommentLike({ commit }, { commentId }) {
    try {
      await this.$axios.$post(`/me/comments/${commentId}/likes`)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async deleteArticleComment({ commit }, { commentId }) {
    try {
      await this.$axios.$delete(`/me/comments/${commentId}`)
      commit(types.DELETE_ARTICLE_COMMENT, { commentId })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  addArticleComment({ commit, rootState }, { text, commentId }) {
    const comment = {
      text,
      userInfo: rootState.user.currentUserInfo,
      created_at: new Date().getTime() / 1000,
      comment_id: commentId,
      isLiked: false,
      likesCount: 0
    }

    commit(types.ADD_ARTICLE_COMMENT, { comment })
  },
  async getIsLikedArticleCommentIds({ commit }, { articleId }) {
    try {
      const { comment_ids: commentIds } = await this.$axios.$get(
        `/me/articles/${articleId}/comments/likes`
      )
      commit(types.SET_ARTICLE_COMMENT_LIKED_COMMENT_IDS, { commentIds })
      return commentIds
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getArticleCommentLikesCount({ commit }, { commentId }) {
    try {
      const { count: likesCount } = await this.$axios.$get(`/comments/${commentId}/likes`)
      return likesCount
    } catch (error) {
      return Promise.reject(error)
    }
  },
  resetArticleCommentsLastEvaluatedKey({ commit }) {
    commit(types.SET_ARTICLE_COMMENTS_LAST_EVALUATED_KEY, { lastEvaluatedKey: {} })
  },
  async updateArticleCommentsByCommentIds({ commit, dispatch }, { articleId }) {
    try {
      const commentIds = await dispatch('getIsLikedArticleCommentIds', { articleId })
      commit(types.UPDATE_ARTICLE_COMMENTS_BY_COMMENT_IDS, { commentIds })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getSearchArticles({ commit, dispatch, state }, { query }) {
    if (state.searchArticles.isFetching) return
    commit(types.SET_SEARCH_ARTICLES_IS_FETCHING, { isFetching: true })
    const limit = 10
    const articles = await this.$axios.$get('/search/articles', {
      params: { limit, query, page: state.searchArticles.page }
    })
    const articlesWithData = await Promise.all(
      articles.map(async (article) => {
        const userInfo = await dispatch('getUserInfo', { userId: article.user_id })
        const alisToken = await dispatch('getAlisToken', { articleId: article.article_id })
        return { ...article, userInfo, alisToken, tmp: Math.random() }
      })
    )
    commit(types.SET_SEARCH_ARTICLES_IS_FETCHING, { isFetching: false })
    commit(types.SET_SEARCH_ARTICLES, { articles: articlesWithData })
    commit(types.SET_SEARCH_ARTICLES_PAGE, { page: state.searchArticles.page + 1 })
    if (articles.length < limit) {
      commit(types.SET_SEARCH_ARTICLES_IS_LAST_PAGE, { isLastPage: true })
    }
  },
  resetSearchArticles({ commit }) {
    commit(types.RESET_SEARCH_ARTICLES)
  },
  resetSearchArticlesPage({ commit }) {
    commit(types.RESET_SEARCH_ARTICLES_PAGE)
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
  },
  [types.SET_IS_EDITED](state, { isEdited }) {
    state.isEdited = isEdited
  },
  [types.SET_SAVE_STATUS](state, { saveStatus }) {
    state.saveStatus = saveStatus
  },
  [types.SET_ARTICLE_COMMENTS](state, { comments }) {
    state.article.comments.push(...comments)
  },
  [types.SET_ARTICLE_COMMENTS_LAST_EVALUATED_KEY](state, { lastEvaluatedKey }) {
    state.articleCommentsLastEvaluatedKey = lastEvaluatedKey
  },
  [types.ADD_ARTICLE_COMMENT](state, { comment }) {
    state.article.comments.unshift(comment)
  },
  [types.SET_ARTICLE_COMMENT_LIKED_COMMENT_IDS](state, { commentIds }) {
    state.articleCommentLikedCommentIds = commentIds
  },
  [types.UPDATE_ARTICLE_COMMENTS_BY_COMMENT_IDS](state, { commentIds }) {
    const comments = state.article.comments.map((comment) => {
      const isLiked = commentIds.includes(comment.comment_id)
      return { ...comment, isLiked }
    })
    state.article.comments = [...comments]
  },
  [types.DELETE_ARTICLE_COMMENT](state, { commentId }) {
    const comments = state.article.comments.filter((comment) => comment.comment_id !== commentId)
    state.article.comments = comments
  },
  [types.SET_SEARCH_ARTICLES](state, { articles }) {
    state.searchArticles.articles.push(...articles)
  },
  [types.SET_SEARCH_ARTICLES_IS_LAST_PAGE](state, { isLastPage }) {
    state.searchArticles.isLastPage = isLastPage
  },
  [types.SET_SEARCH_ARTICLES_PAGE](state, { page }) {
    state.searchArticles.page = page
  },
  [types.RESET_SEARCH_ARTICLES](state) {
    state.searchArticles.articles = []
  },
  [types.RESET_SEARCH_ARTICLES_PAGE](state) {
    state.searchArticles.page = 1
  },
  [types.SET_SEARCH_ARTICLES_IS_FETCHING](state, { isFetching }) {
    state.searchArticles.isFetching = isFetching
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
