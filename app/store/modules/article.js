import { uniqBy } from 'lodash'
import * as types from '../mutation-types'
import { getBodyAfterImageTagOptimization } from '~/utils/article'

const namespaced = true

const state = () => ({
  article: {},
  articleId: '',
  likesCount: 0,
  isLikedArticle: false,
  popularArticles: [],
  tmpPopularArticles: [],
  tmpPopularArticleIds: [],
  newArticles: [],
  tmpNewArticles: [],
  publicArticles: [],
  draftArticles: [],
  title: '',
  body: '',
  originalBody: '',
  articleContentEditHistories: null,
  currentPrice: null,
  suggestedThumbnails: [],
  thumbnail: '',
  isSaving: false,
  gotArticleData: false,
  publicArticlesLastEvaluatedKey: {},
  draftArticlesLastEvaluatedKey: {},
  hasPublicArticlesLastEvaluatedKey: false,
  isEdited: false,
  isEditedTitle: false,
  isEditedBody: false,
  saveStatus: '',
  articleCommentsLastEvaluatedKey: {},
  articleCommentLikedCommentIds: [],
  searchArticles: {
    articles: [],
    page: 1,
    isLastPage: false,
    isFetching: false
  },
  page: 1,
  isLastPage: false,
  isTmpArticlesLastPage: false,
  isTmpPopularArticlesLastPage: false,
  topics: [],
  articleType: 'popularArticles',
  topicType: null,
  topicDisplayName: '',
  fetchingArticleTopic: '',
  tags: [],
  tagArticles: {
    currentTag: '',
    articles: [],
    page: 1,
    isLastPage: false,
    isFetching: false
  },
  isFetchedPublicArticle: false,
  eyecatchArticles: [],
  tipEyecatchArticles: [],
  recommendedArticles: {
    articles: [],
    tmpArticles: [],
    tmpArticleIds: [],
    page: 1,
    isLastPage: false,
    isTmpRecommendedArticlesLastPage: false
  },
  purchasedArticleIds: [],
  purchasedArticles: {
    lastEvaluatedKey: {},
    articles: []
  },
  isFetchedPurchasedArticle: false,
  tipRankingArticles: {
    articles: [],
    tmpArticles: [],
    page: 1,
    isLastPage: false
  },
  cryptoRankingInfo: [],
  supporters: []
})

const getters = {
  article: (state) => state.article,
  popularArticles: (state) => uniqBy(state.popularArticles, 'article_id'),
  newArticles: (state) => uniqBy(state.newArticles, 'article_id'),
  publicArticles: (state) => state.publicArticles,
  draftArticles: (state) => state.draftArticles,
  articleId: (state) => state.articleId,
  title: (state) => state.title,
  body: (state) => state.body,
  originalBody: (state) => state.originalBody,
  articleContentEditHistories: (state) => state.articleContentEditHistories,
  suggestedThumbnails: (state) => Array.from(new Set(state.suggestedThumbnails)),
  thumbnail: (state) => state.thumbnail,
  isSaving: (state) => state.isSaving,
  gotArticleData: (state) => state.gotArticleData,
  publicArticlesLastEvaluatedKey: (state) => state.publicArticlesLastEvaluatedKey,
  draftArticlesLastEvaluatedKey: (state) => state.draftArticlesLastEvaluatedKey,
  hasDraftArticlesLastEvaluatedKey: (state) => state.draftArticlesLastEvaluatedKey !== null,
  likesCount: (state) => state.likesCount,
  isLikedArticle: (state) => state.isLikedArticle,
  isEdited: (state) => state.isEdited,
  isEditedTitle: (state) => state.isEditedTitle,
  isEditedBody: (state) => state.isEditedBody,
  saveStatus: (state) => state.saveStatus,
  articleCommentsLastEvaluatedKey: (state) => state.articleCommentsLastEvaluatedKey,
  hasArticleCommentsLastEvaluatedKey: (state) =>
    !!Object.keys(state.articleCommentsLastEvaluatedKey || {}).length,
  articleCommentLikedCommentIds: (state) => state.articleCommentLikedCommentIs,
  searchArticles: (state) => state.searchArticles,
  topics: (state) => state.topics.sort((a, b) => a.order > b.order),
  page: (state) => state.page,
  isLastPage: (state) => state.isLastPage,
  articleType: (state) => state.articleType,
  topicType: (state) => state.topicType || null,
  topicDisplayName: (state) => state.topicDisplayName,
  fetchingArticleTopic: (state) => state.fetchingArticleTopic,
  tags: (state) => state.tags,
  tagArticles: (state) => state.tagArticles,
  hasPublicArticlesLastEvaluatedKey: (state) => state.hasPublicArticlesLastEvaluatedKey,
  isFetchedPublicArticle: (state) => state.isFetchedPublicArticle,
  eyecatchArticles: (state) => state.eyecatchArticles,
  tipEyecatchArticles: (state) => {
    const tipEyecatchArticles = [...state.tipEyecatchArticles]
    const articleCount = tipEyecatchArticles.length
    const fillCount = 3 - articleCount
    // 投げ銭ランキングのアイキャッチ表示枠で、記事が3件未満のときは変わりの画像を表示する必要があるため、
    // 画像の表示枠を null で埋めている。
    return [...tipEyecatchArticles, ...new Array(fillCount).fill(null)]
  },
  recommendedArticles: (state) => {
    const recommendedArticles = [...state.recommendedArticles.articles]
    const removeTargetArticleIds = state.tipEyecatchArticles.map((article) => article.article_id)
    const filteredRecommendedArticles = recommendedArticles.filter((recommendedArticle) => {
      return !removeTargetArticleIds.includes(recommendedArticle.article_id)
    })
    // 表示する記事のグリットがずれないようにするため、表示する記事を 6 の倍数にしている。
    const removeCount = filteredRecommendedArticles.length % 6
    const removedArticles =
      removeCount === 0
        ? [...filteredRecommendedArticles]
        : [...filteredRecommendedArticles.slice(0, -removeCount)]
    return {
      ...state.recommendedArticles,
      // 最後のページではグリットに関係なくすべての記事を表示したいため、
      // そのまま filteredRecommendedArticles を表示している。
      articles: state.recommendedArticles.isLastPage ? filteredRecommendedArticles : removedArticles
    }
  },
  purchasedArticleIds: (state) => state.purchasedArticleIds,
  purchasedArticles: (state) => {
    return {
      ...state.purchasedArticles,
      hasLastEvaluatedKey: state.purchasedArticles.lastEvaluatedKey !== null
    }
  },
  currentPrice: (state) => state.currentPrice,
  isFetchedPurchasedArticle: (state) => state.isFetchedPurchasedArticle,
  tipRankingArticles: (state) => {
    const tipRankingArticles = [...state.tipRankingArticles.articles]
    const removeTargetArticleIds = state.tipEyecatchArticles.map((article) => article.article_id)
    const filteredTipRankingArticles = tipRankingArticles.filter((tipRankingArticle) => {
      return !removeTargetArticleIds.includes(tipRankingArticle.article_id)
    })
    return {
      ...state.tipRankingArticles,
      articles: filteredTipRankingArticles
    }
  },
  supporters: (state) => state.supporters,
  cryptoRankingInfo: (state) => state.cryptoRankingInfo
}

const actions = {
  // 人気記事一覧を取得。人気記事が取得し終わったら、そのまま新規記事を続けて取得する。
  async getPopularArticles({ commit, dispatch, state, rootState }, { topic }) {
    try {
      commit(types.SET_FETCHING_ARTICLE_TOPIC, { topic })
      // 最終ページ、もしくはミュート済みユーザを除いた記事数が表示件数以上になるまでループ
      // ミュート済みユーザの記事があることを想定し、API コール数を削減するため多めに取得
      const viewCount = 12
      const limitCount = viewCount + 6
      while (!state.isTmpArticlesLastPage && state.tmpPopularArticles.length < viewCount) {
        // 人気記事一覧取得
        if (!state.isTmpPopularArticlesLastPage) {
          const { Items: tmpArticles } = await this.$axios.$get('/api/articles/popular', {
            params: { topic, limit: limitCount, page: state.page }
          })
          // ページ数追加
          commit(types.SET_ARTICLES_PAGE, { page: state.page + 1 })
          // ページ末尾のケースを考慮
          if (tmpArticles.length < limitCount) {
            commit(types.SET_TMP_POPULAR_ARTICLES_IS_LAST_PAGE, { isLastPage: true })
            commit(types.SET_ARTICLES_PAGE, { page: 1 })
          }
          // ミュート済みユーザの記事を除外し、tmpPopularArticles に追加
          const withOutMuteUserArticles = tmpArticles.filter(
            (article) => rootState.user.muteUsers.indexOf(article.user_id) === -1
          )
          commit(types.SET_TMP_POPULAR_ARTICLES, { tmpArticles: withOutMuteUserArticles })
          commit(types.SET_TMP_POPULAR_ARTICLE_IDS, {
            tmpArticleIds: withOutMuteUserArticles.map((i) => i.article_id)
          })
        }
        // 新規記事一覧取得。人気記事一覧の記事データが存在しない場合は続けて新規記事一覧から取得
        if (state.isTmpPopularArticlesLastPage) {
          const { Items: tmpArticles } = await this.$axios.$get('/api/articles/recent', {
            params: { topic, limit: limitCount, page: state.page }
          })
          // ページ数追加
          commit(types.SET_ARTICLES_PAGE, { page: state.page + 1 })
          // ページ末尾のケースを考慮
          if (tmpArticles.length < limitCount) {
            commit(types.SET_TMP_ARTICLES_IS_LAST_PAGE, { isLastPage: true })
          }
          // ミュート済みユーザの記事かつ、人気記事で取得した記事を除外し、tmpPopularArticles に追加
          commit(types.SET_TMP_POPULAR_ARTICLES, {
            tmpArticles: tmpArticles.filter(
              (article) =>
                rootState.user.muteUsers.indexOf(article.user_id) === -1 &&
                state.tmpPopularArticleIds.indexOf(article.article_id) === -1
            )
          })
        }
      }

      // tmpArticles の先頭から表示件数の記事を取得し、store から削除
      const articles = state.tmpPopularArticles.slice(0, viewCount)
      commit(types.DELETE_TMP_POPULAR_ARTICLES, { deleteCount: viewCount })

      const articlesWithData = await Promise.all(
        articles.map(async (article) => {
          const [userInfo, alisToken] = await Promise.all([
            dispatch('getUserInfo', { userId: article.user_id }),
            dispatch('getAlisToken', { articleId: article.article_id })
          ])
          return { ...article, userInfo, alisToken }
        })
      )
      // 新着記事の取得処理直後に人気記事の取得が始まると、本来は人気記事のみ表示されるべき画面で
      // 新着記事が表示されるため、新着記事の取得中は人気記事の追加を行わない。
      // また、トピックに対しても同様の問題が生じるため別トピックの取得中は記事の追加を行わない。
      if (state.articleType === 'newArticles' || state.fetchingArticleTopic !== topic) return
      commit(types.SET_POPULAR_ARTICLES, { articles: articlesWithData })
      if (state.tmpPopularArticles.length < 1 && state.isTmpArticlesLastPage) {
        commit(types.SET_ARTICLES_IS_LAST_PAGE, { isLastPage: true })
      }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getNewPagesArticles({ commit, dispatch, state, rootState }, { topic }) {
    try {
      commit(types.SET_FETCHING_ARTICLE_TOPIC, { topic })
      // 最終ページ、もしくはミュート済みユーザを除いた記事数が表示件数以上になるまでループ
      // ミュート済みユーザの記事があることを想定し、API コール数を削減するため多めに取得
      const viewCount = 12
      const limitCount = viewCount + 6
      while (!state.isTmpArticlesLastPage && state.tmpNewArticles.length < viewCount) {
        const { Items: tmpArticles } = await this.$axios.$get('/api/articles/recent', {
          params: { topic, limit: limitCount, page: state.page }
        })
        // ページ数追加
        commit(types.SET_ARTICLES_PAGE, { page: state.page + 1 })
        // ページ末尾のケースを考慮
        if (tmpArticles.length < limitCount) {
          commit(types.SET_TMP_ARTICLES_IS_LAST_PAGE, { isLastPage: true })
        }
        // ミュート済みユーザの記事を削除し、tmpArticles に追加
        commit(types.SET_TMP_NEW_ARTICLES, {
          tmpArticles: tmpArticles.filter(
            (article) => rootState.user.muteUsers.indexOf(article.user_id) === -1
          )
        })
      }
      // tmpArticles の先頭から表示件数の記事を取得し、store から削除
      const articles = state.tmpNewArticles.slice(0, viewCount)
      commit(types.DELETE_TMP_NEW_ARTICLES, { deleteCount: viewCount })

      const articlesWithData = await Promise.all(
        articles.map(async (article) => {
          const [userInfo, alisToken] = await Promise.all([
            dispatch('getUserInfo', { userId: article.user_id }),
            dispatch('getAlisToken', { articleId: article.article_id })
          ])
          return { ...article, userInfo, alisToken }
        })
      )
      // 人気記事の取得処理直後に新着記事の取得が始まると、本来は新着記事のみ表示されるべき画面で
      // 人気記事が表示されるため、人気記事の取得中は新着記事の追加を行わない。
      // また、トピックに対しても同様の問題が生じるため別トピックの取得中は記事の追加を行わない。
      if (state.articleType === 'popularArticles' || state.fetchingArticleTopic !== topic) return
      commit(types.SET_NEW_ARTICLES, { articles: articlesWithData })
      if (state.tmpNewArticles.length < 1 && state.isTmpArticlesLastPage) {
        commit(types.SET_ARTICLES_IS_LAST_PAGE, { isLastPage: true })
      }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getUserInfo({ commit }, { userId }) {
    const userInfo = await this.$axios.$get(`/api/users/${userId}/info`)
    return userInfo
  },
  async getAlisToken({ commit }, { articleId }) {
    try {
      const { alis_token: alisToken } = await this.$axios.$get(
        `/api/articles/${articleId}/alistoken`
      )
      return alisToken
    } catch (error) {
      console.error(error)
      return 0
    }
  },
  async getLikesCount({ commit }, { articleId }) {
    const { count: likesCount } = await this.$axios.$get(`/api/articles/${articleId}/likes`)
    return likesCount
  },
  async getEditArticle({ commit }, { articleId }) {
    const article = await this.$axios.$get(`/api/articles/${articleId}`)
    commit(types.SET_ARTICLE, { article })
  },
  async getEditDraftArticle({ commit }, { articleId, version }) {
    try {
      const queryParam = version == null ? '' : `?version=${version}`
      const article = await this.$axios.$get(`/api/me/articles/${articleId}/drafts${queryParam}`)
      // "/me/articles/drafts/article_id" への POST で記事が作成された直後、その記事データには body カラムがないため、
      // article.body.replace がエラーとなってしまう。
      // そこで、article.body の存在確認を行ってから article.body.replace の処理を行っている。
      // また、article.body.replace は有料記事本文に含まれる有料エリアを示すラインを削除する処理である。
      const body =
        article.body && article.body.replace(/<p class=["|']paywall-line["|']>.*?<\/p>/, '')
      if (article.eye_catch_url) {
        commit(types.UPDATE_THUMBNAIL, { thumbnail: article.eye_catch_url })
      }
      commit(types.SET_ARTICLE, { article: { ...article, body } })
      commit(types.SET_ARTICLE_ID, { articleId })
      commit(types.SET_ARTICLE_TOPIC, { topicType: article.topic })
      commit(types.SET_ARTICLE_TAGS, { tags: article.tags })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getArticleDetail({ commit, dispatch }, { articleId }) {
    try {
      const article = await this.$axios.$get(`/api/articles/${articleId}`)
      const body = getBodyAfterImageTagOptimization(
        article.body,
        process.env.ALIS_APP_DOMAIN,
        article.user_id,
        articleId
      )
      const [userInfo, alisToken, likesCount] = await Promise.all([
        dispatch('getUserInfo', { userId: article.user_id }),
        dispatch('getAlisToken', { articleId }),
        dispatch('getLikesCount', { articleId })
      ])
      const comments = []
      commit(types.SET_LIKES_COUNT, { likesCount })
      commit(types.SET_ARTICLE_DETAIL, {
        article: { ...article, body, userInfo, alisToken, comments }
      })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getPublicArticleDetail({ commit, dispatch }, { articleId }) {
    const article = await this.$axios.$get(`/api/me/articles/${articleId}/public`)
    commit(types.RESET_ARTICLE_COMMENTS_LAST_EVALUATED_KEY)
    const body = getBodyAfterImageTagOptimization(
      article.body,
      process.env.ALIS_APP_DOMAIN,
      article.user_id,
      articleId
    )
    const [userInfo, alisToken, likesCount] = await Promise.all([
      dispatch('getUserInfo', { userId: article.user_id }),
      dispatch('getAlisToken', { articleId }),
      dispatch('getLikesCount', { articleId })
    ])
    const comments = []
    commit(types.SET_LIKES_COUNT, { likesCount })
    commit(types.SET_ARTICLE_DETAIL, {
      article: { ...article, body, userInfo, alisToken, comments }
    })
    commit(types.SET_ARTICLE_ID, { articleId })
    commit(types.SET_IS_FETCHED_PUBLIC_ARTICLE, { isFetched: true })
  },
  async getPublicArticleOriginalBody({ commit }, { articleId }) {
    const article = await this.$axios.$get(`/api/me/articles/${articleId}/public`)
    commit(types.SET_ARTICLE_ORIGINAL_BODY, { originalBody: article.body })
  },
  async getEditPublicArticleDetail({ commit }, { articleId, version }) {
    try {
      const queryParam = version == null ? '' : `?version=${version}`
      const article = await this.$axios.$get(
        `/api/me/articles/${articleId}/public/edit${queryParam}`
      )
      // 有料記事本文に含まれる有料エリアを示すラインを削除
      const body = article.body.replace(/<p class=["|']paywall-line["|']>.*?<\/p>/, '')
      if (article.eye_catch_url) {
        commit(types.UPDATE_THUMBNAIL, { thumbnail: article.eye_catch_url })
      }
      commit(types.SET_ARTICLE, { article: { ...article, body } })
      commit(types.SET_ARTICLE_ID, { articleId })
      commit(types.SET_ARTICLE_TOPIC, { topicType: article.topic })
      commit(types.SET_ARTICLE_TAGS, { tags: article.tags })
      commit(types.SET_ARTICLE_CURRENT_PRICE, { price: article.price })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async putDraftArticle({ commit }, { article, articleId }) {
    await this.$axios.$put(`/api/me/articles/${articleId}/drafts`, article)
  },
  async putPublicArticle({ commit }, { article, articleId }) {
    await this.$axios.$put(`/api/me/articles/${articleId}/public`, article)
  },
  async getLikesCountOfArticle({ commit }, { articleId }) {
    const { likes_count: likesCount } = await this.$axios.$get(`/api/articles/${articleId}/like`)
    commit(types.SET_LIKES_COUNT, { likesCount })
  },
  async getPublicArticles({ commit, dispatch, state }) {
    if (!state.hasPublicArticlesLastEvaluatedKey) {
      try {
        commit(types.SET_HAS_PUBLIC_ARTICLES_LAST_EVALUATED_KEY, { hasLastEvaluatedKey: true })
        const { article_id: articleId, sort_key: sortKey } = state.publicArticlesLastEvaluatedKey
        const { Items: articles, LastEvaluatedKey } = await this.$axios.$get(
          '/api/me/articles/public',
          { params: { limit: 12, article_id: articleId, sort_key: sortKey } }
        )
        commit(types.SET_PUBLIC_ARTICLES_LAST_EVALUATED_KEY, { lastEvaluatedKey: LastEvaluatedKey })
        const userInfo = await this.$axios.$get('/api/me/info')
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
  async getDraftArticles({ commit, getters }) {
    if (!getters.hasDraftArticlesLastEvaluatedKey) return
    try {
      const { article_id: articleId, sort_key: sortKey } = getters.draftArticlesLastEvaluatedKey
      const { Items: articles, LastEvaluatedKey } = await this.$axios.$get(
        '/api/me/articles/drafts',
        {
          params: { limit: 12, article_id: articleId, sort_key: sortKey }
        }
      )
      commit(types.SET_DRAFT_ARTICLES_LAST_EVALUATED_KEY, {
        lastEvaluatedKey: LastEvaluatedKey || null
      })
      const userInfo = await this.$axios.$get('/api/me/info')
      const articlesWithData = articles.map((article) => {
        return { ...article, userInfo }
      })
      commit(types.SET_DRAFT_ARTICLES, { articles: articlesWithData })
    } catch (error) {
      Promise.reject(error)
    }
  },
  async getArticleContentEditHistories({ commit }, { articleId }) {
    try {
      const { Items: articleContentEditHistories } = await this.$axios.$get(
        `/api/me/articles/${articleId}/content_edit_histories`
      )
      commit(types.SET_ARTICLE_CONTENT_EDIT_HISTORIES, {
        articleContentEditHistories: articleContentEditHistories
      })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  resetArticleContentEditHistories({ commit }) {
    commit(types.SET_ARTICLE_CONTENT_EDIT_HISTORIES, { articleContentEditHistories: null })
  },
  async publishDraftArticle({ commit }, { articleId, topic, tags }) {
    await this.$axios.$put(`/api/me/articles/${articleId}/drafts/publish`, { topic, tags })
  },
  async republishPublicArticle({ commit }, { articleId, topic, tags }) {
    await this.$axios.$put(`/api/me/articles/${articleId}/public/republish`, { topic, tags })
  },
  async unpublishPublicArticle({ commit }, { articleId }) {
    await this.$axios.$put(`/api/me/articles/${articleId}/public/unpublish`)
  },
  updateTitle({ commit }, { title }) {
    commit(types.UPDATE_TITLE, { title })
  },
  updateBody({ commit }, { body }) {
    commit(types.UPDATE_BODY, { body })
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
        `/api/me/articles/${articleId}/images`,
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
    this.$axios.$post(`/api/me/articles/${articleId}/pv`)
  },
  async postLike({ commit, state }, { articleId }) {
    try {
      await this.$axios.$post(`/api/me/articles/${articleId}/like`)
      commit(types.SET_LIKES_COUNT, { likesCount: state.likesCount + 1 })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getIsLikedArticle({ commit }, { articleId }) {
    try {
      const { liked } = await this.$axios.$get(`/api/me/articles/${articleId}/like`)
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
  setIsEditedTitle({ commit }, { isEditedTitle }) {
    commit(types.SET_IS_EDITED_TITLE, { isEditedTitle })
  },
  setIsEditedBody({ commit }, { isEditedBody }) {
    commit(types.SET_IS_EDITED_BODY, { isEditedBody })
  },
  setSaveStatus({ commit }, { saveStatus }) {
    commit(types.SET_SAVE_STATUS, { saveStatus })
  },
  async postArticleComment({ commit }, { articleId, text }) {
    try {
      const { comment_id: commentId } = await this.$axios.$post(
        `/api/me/articles/${articleId}/comments`,
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
        `/api/articles/${articleId}/comments`,
        { params }
      )
      commit(types.SET_ARTICLE_COMMENTS_LAST_EVALUATED_KEY, {
        lastEvaluatedKey: LastEvaluatedKey || {}
      })
      const commentsWithData = await Promise.all(
        comments.map(async (comment) => {
          const [userInfo, likesCount] = await Promise.all([
            dispatch('getUserInfo', { userId: comment.user_id }),
            dispatch('getArticleCommentLikesCount', {
              commentId: comment.comment_id
            })
          ])
          const isLiked = state.articleCommentLikedCommentIds.includes(comment.comment_id)
          let replies = []
          if (comment.replies) {
            replies = await Promise.all(
              comment.replies.map(async (replyComment) => {
                const [userInfo, likesCount, replyedUserInfo] = await Promise.all([
                  dispatch('getUserInfo', { userId: replyComment.user_id }),
                  dispatch('getArticleCommentLikesCount', {
                    commentId: replyComment.comment_id
                  }),
                  dispatch('getUserInfo', {
                    userId: replyComment.replyed_user_id
                  })
                ])
                const isLiked = state.articleCommentLikedCommentIds.includes(
                  replyComment.comment_id
                )
                return { ...replyComment, userInfo, isLiked, likesCount, replyedUserInfo }
              })
            )
          }
          return { ...comment, userInfo, isLiked, likesCount, replies }
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
      await this.$axios.$post(`/api/me/comments/${commentId}/likes`)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async deleteArticleComment({ commit }, { commentId }) {
    try {
      await this.$axios.$delete(`/api/me/comments/${commentId}`)
      commit(types.DELETE_ARTICLE_COMMENT, { commentId })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  addArticleComment({ commit, rootState }, { text, commentId }) {
    const { currentUserInfo } = rootState.user
    const comment = {
      text,
      userInfo: currentUserInfo,
      user_id: currentUserInfo.user_id,
      created_at: new Date().getTime() / 1000,
      comment_id: commentId,
      isLiked: false,
      likesCount: 0,
      replies: []
    }

    commit(types.ADD_ARTICLE_COMMENT, { comment })
  },
  async getIsLikedArticleCommentIds({ commit }, { articleId }) {
    try {
      const { comment_ids: commentIds } = await this.$axios.$get(
        `/api/me/articles/${articleId}/comments/likes`
      )
      commit(types.SET_ARTICLE_COMMENT_LIKED_COMMENT_IDS, { commentIds })
      return commentIds
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getArticleCommentLikesCount({ commit }, { commentId }) {
    try {
      const { count: likesCount } = await this.$axios.$get(`/api/comments/${commentId}/likes`)
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
    const limit = 12
    const articles = await this.$axios.$get('/api/search/articles', {
      params: { limit, query, page: state.searchArticles.page }
    })
    const articlesWithData = await Promise.all(
      articles.map(async (article) => {
        const [userInfo, alisToken] = await Promise.all([
          dispatch('getUserInfo', { userId: article.user_id }),
          dispatch('getAlisToken', { articleId: article.article_id })
        ])
        return { ...article, userInfo, alisToken }
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
  },
  resetSearchArticlesIsLastPage({ commit }) {
    commit(types.RESET_SEARCH_ARTICLES_IS_LAST_PAGE)
  },
  async getTopics({ commit }) {
    try {
      const topics = await this.$axios.$get('/api/topics')
      commit(types.SET_TOPICS, { topics })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  resetArticleData({ commit }) {
    commit(types.RESET_ARTICLE_DATA)
  },
  setArticleType({ commit }, { articleType }) {
    commit(types.SET_ARTICLE_TYPE, { articleType })
  },
  resetArticleTopic({ commit }) {
    commit(types.RESET_ARTICLE_TOPIC)
  },
  setArticleTopic({ commit }, { topicType }) {
    commit(types.SET_ARTICLE_TOPIC, { topicType })
  },
  setTopicDisplayName({ commit }, { topicName }) {
    commit(types.SET_TOPIC_DISPLAY_NAME, { topicName })
  },
  updateTags({ commit }, { tags }) {
    commit(types.UPDATE_TAGS, { tags })
  },
  async getTagArticles({ commit, dispatch, state }, { tag }) {
    if (state.tagArticles.isFetching) return
    try {
      commit(types.SET_TAG_ARTICLES_CURRENT_TAG, { tag })
      commit(types.SET_IS_FETCHING_TAG_ARTICLES, { isFetching: true })
      const limit = 12
      const articles = await this.$axios.$get('/api/search/articles', {
        params: { limit, tag, page: state.tagArticles.page }
      })
      const articlesWithData = await Promise.all(
        articles.map(async (article) => {
          const [userInfo, alisToken] = await Promise.all([
            dispatch('getUserInfo', { userId: article.user_id }),
            dispatch('getAlisToken', { articleId: article.article_id })
          ])
          return { ...article, userInfo, alisToken }
        })
      )
      commit(types.SET_TAG_ARTICLES, { articles: articlesWithData })
      commit(types.SET_TAG_ARTICLES_PAGE, { page: state.tagArticles.page + 1 })
      if (articles.length < limit) {
        commit(types.SET_TAG_ARTICLES_IS_LAST_PAGE, { isLastPage: true })
      }
    } catch (error) {
      return Promise.reject(error)
    } finally {
      commit(types.SET_IS_FETCHING_TAG_ARTICLES, { isFetching: false })
    }
  },
  resetTagArticlesData({ commit }) {
    commit(types.RESET_TAG_ARTICLES_DATA)
  },
  async postArticleReplyComment({ commit }, { articleId, text, parentId, replyedUserId }) {
    try {
      const { comment_id: commentId } = await this.$axios.$post(
        `/api/me/articles/${articleId}/comments/reply`,
        { text, parent_id: parentId, replyed_user_id: replyedUserId }
      )
      return commentId
    } catch (error) {
      return Promise.reject(error)
    }
  },
  addArticleReplyComment(
    { commit, rootState },
    { text, commentId, parentId, replyedUserId, replyedUserDisplayName }
  ) {
    const { currentUserInfo } = rootState.user
    const replyComment = {
      text,
      userInfo: currentUserInfo,
      user_id: currentUserInfo.user_id,
      created_at: new Date().getTime() / 1000,
      comment_id: commentId,
      isLiked: false,
      likesCount: 0,
      replyed_user_id: replyedUserId,
      replyedUserInfo: {
        user_display_name: replyedUserDisplayName
      }
    }

    commit(types.ADD_ARTICLE_REPLY_COMMENT, { replyComment, parentId })
  },
  async deleteArticleReplyComment({ commit }, { commentId, parentId }) {
    try {
      await this.$axios.$delete(`/api/me/comments/${commentId}`)
      commit(types.DELETE_ARTICLE_REPLY_COMMENT, { commentId, parentId })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  setIsFetchedPublicArticle({ commit }, { isFetched }) {
    commit(types.SET_IS_FETCHED_PUBLIC_ARTICLE, { isFetched: true })
  },
  async getEyecatchArticles({ commit, dispatch }) {
    try {
      const { Items: articles } = await this.$axios.$get('/api/articles/eyecatch')
      const articlesWithData = await Promise.all(
        articles.map(async (article) => {
          if (article === null) return null
          const [userInfo, alisToken] = await Promise.all([
            dispatch('getUserInfo', { userId: article.user_id }),
            dispatch('getAlisToken', { articleId: article.article_id })
          ])
          return { ...article, userInfo, alisToken }
        })
      )
      commit(types.SET_EYECATCH_ARTICLES, { articles: articlesWithData })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getRecommendedArticles({ commit, state, dispatch, rootState }) {
    try {
      // 最終ページ、もしくはミュート済みユーザを除いた記事数が表示件数以上になるまでループ
      // ミュート済みユーザの記事があることを想定し、API コール数を削減するため多めに取得
      const viewCount = 12
      const limitCount = viewCount + 6
      while (
        !state.recommendedArticles.isTmpArticlesLastPage &&
        state.recommendedArticles.tmpArticles.length < viewCount
      ) {
        // おすすめ記事一覧取得
        if (!state.recommendedArticles.isTmpRecommendedArticlesLastPage) {
          const { Items: tmpArticles } = await this.$axios.$get('/api/articles/recommended', {
            params: { limit: limitCount, page: state.recommendedArticles.page }
          })
          // ページ数追加
          commit(types.SET_RECOMMENDED_ARTICLES_PAGE, { page: state.recommendedArticles.page + 1 })
          // ページ末尾のケースを考慮
          if (tmpArticles.length < limitCount) {
            commit(types.SET_TMP_RECOMMENDED_ARTICLES_IS_LAST_PAGE, { isLastPage: true })
            commit(types.SET_RECOMMENDED_ARTICLES_PAGE, { page: 1 })
          }
          // ミュート済みユーザ記事を削除し、tmpArticles に追加
          const withOutMuteUserArticles = tmpArticles.filter(
            (article) => rootState.user.muteUsers.indexOf(article.user_id) === -1
          )
          commit(types.SET_RECOMMENDED_ARTICLES_TMP_ARTICLES, {
            tmpArticles: withOutMuteUserArticles
          })
          commit(types.SET_RECOMMENDED_ARTICLES_TMP_ARTICLE_IDS, {
            tmpArticleIds: withOutMuteUserArticles.map((i) => i.article_id)
          })
        }
        // 新規記事一覧取得。おすすめ記事一覧の記事データが存在しない場合は続けて新規記事一覧から取得
        if (state.recommendedArticles.isTmpRecommendedArticlesLastPage) {
          const { Items: tmpArticles } = await this.$axios.$get('/api/articles/recent', {
            params: { limit: limitCount, page: state.recommendedArticles.page }
          })
          // ページ数追加
          commit(types.SET_RECOMMENDED_ARTICLES_PAGE, { page: state.recommendedArticles.page + 1 })
          // ページ末尾のケースを考慮
          if (tmpArticles.length < limitCount) {
            commit(types.SET_RECOMMENDED_ARTICLES_IS_TMP_ARTICLES_LAST_PAGE, { isLastPage: true })
          }
          // ミュート済みユーザの記事と、オススメ記事で取得した記事を除外し、tmpArticles に追加
          commit(types.SET_RECOMMENDED_ARTICLES_TMP_ARTICLES, {
            tmpArticles: tmpArticles.filter(
              (article) =>
                rootState.user.muteUsers.indexOf(article.user_id) === -1 &&
                state.recommendedArticles.tmpArticleIds.indexOf(article.article_id) === -1
            )
          })
        }
      }

      // tmpArticles の先頭から表示件数の記事を取得し、store から削除
      const articles = state.recommendedArticles.tmpArticles.slice(0, viewCount)
      commit(types.DELETE_RECOMMENDED_ARTICLES_TMP_ARTICLES, { deleteCount: viewCount })

      const articlesWithData = await Promise.all(
        articles.map(async (article) => {
          const [userInfo, alisToken] = await Promise.all([
            dispatch('getUserInfo', { userId: article.user_id }),
            dispatch('getAlisToken', { articleId: article.article_id })
          ])
          return { ...article, userInfo, alisToken }
        })
      )
      commit(types.SET_RECOMMENDED_ARTICLES, { articles: articlesWithData })
      if (
        state.recommendedArticles.tmpArticles.length < 1 &&
        state.recommendedArticles.isTmpArticlesLastPage
      ) {
        commit(types.SET_RECOMMENDED_ARTICLES_IS_LAST_PAGE, { isLastPage: true })
      }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async putDraftArticleTitle({ commit }, { articleTitle, articleId }) {
    await this.$axios.$put(`/api/me/articles/${articleId}/drafts/title`, articleTitle, {
      timeout: 10000
    })
  },
  async putPublicArticleTitle({ commit }, { articleTitle, articleId }) {
    await this.$axios.$put(`/api/me/articles/${articleId}/public/title`, articleTitle, {
      timeout: 10000
    })
  },
  async putDraftArticleBody({ commit }, { articleBody, articleId }) {
    await this.$axios.$put(`/api/me/articles/${articleId}/drafts/body`, articleBody, {
      timeout: 10000
    })
  },
  async putPublicArticleBody({ commit }, { articleBody, articleId }) {
    await this.$axios.$put(`/api/me/articles/${articleId}/public/body`, articleBody, {
      timeout: 10000
    })
  },
  async postNewArticleId({ commit }) {
    const { article_id: articleId } = await this.$axios.$post('/api/me/articles/drafts/article_id')
    commit(types.SET_ARTICLE_ID, { articleId })
    return articleId
  },
  async publishDraftArticleWithHeader(
    { commit },
    { articleId, topic, tags, eyeCatchUrl, price, paidBody }
  ) {
    const params = {
      topic,
      tags,
      eye_catch_url: eyeCatchUrl
    }
    if (price && paidBody) {
      params.price = price
      params.paid_body = paidBody
    }
    await this.$axios.$put(`/api/me/articles/${articleId}/drafts/publish_with_header`, params)
  },
  async republishPublicArticleWithHeader(
    { commit },
    { articleId, topic, tags, eyeCatchUrl, price, paidBody }
  ) {
    const params = {
      topic,
      tags,
      eye_catch_url: eyeCatchUrl
    }
    if (price && paidBody) {
      params.price = price
      params.paid_body = paidBody
    }
    await this.$axios.$put(`/api/me/articles/${articleId}/public/republish_with_header`, params)
  },
  async setPurchasedArticleIds({ commit }) {
    try {
      const { article_ids: articleIds } = await this.$axios.$get(
        '/api/me/articles/purchased/article_ids'
      )
      commit(types.SET_PURCHASED_ARTICLE_IDS, { articleIds })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getPurchaedArticleDetail({ commit, dispatch }, { articleId }) {
    try {
      const article = await this.$axios.$get(`/api/me/articles/purchased/${articleId}`)
      const [userInfo, alisToken, likesCount] = await Promise.all([
        dispatch('getUserInfo', { userId: article.user_id }),
        dispatch('getAlisToken', { articleId }),
        dispatch('getLikesCount', { articleId })
      ])
      const comments = []
      commit(types.SET_LIKES_COUNT, { likesCount })
      commit(types.SET_ARTICLE_DETAIL, { article: { ...article, userInfo, alisToken, comments } })
      commit(types.SET_IS_FETCHED_PURCHASED_ARTICLE, { isFetched: true })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getArticlePrice({ commit }, { articleId }) {
    try {
      const { price } = await this.$axios.$get(`/api/articles/${articleId}/price`)
      commit(types.UPDATE_ARTICLE_PRICE, { price })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async purchaseArticle({ commit, state }, { articleId, purchaseTransaction, burnTransaction }) {
    try {
      const { status } = await this.$axios.$post(`/api/me/articles/${articleId}/purchase`, {
        purchase_signed_transaction: purchaseTransaction,
        burn_signed_transaction: burnTransaction
      })
      commit(types.SET_PURCHASED_ARTICLE_IDS, {
        articleIds: [...state.purchasedArticleIds, articleId]
      })
      return status
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getPurchasedArticles({ commit, dispatch, getters }) {
    try {
      if (!getters.purchasedArticles.hasLastEvaluatedKey) return
      const {
        article_id: articleId,
        sort_key: sortKey
      } = getters.purchasedArticles.lastEvaluatedKey
      const { Items: articles, LastEvaluatedKey } = await this.$axios.$get(
        '/api/me/articles/purchased',
        { params: { limit: 12, article_id: articleId, sort_key: sortKey } }
      )
      const articlesWithData = await Promise.all(
        articles.map(async (article) => {
          const [userInfo, alisToken] = await Promise.all([
            dispatch('getUserInfo', { userId: article.user_id }),
            dispatch('getAlisToken', { articleId: article.article_id })
          ])
          return { ...article, userInfo, alisToken }
        })
      )
      commit(types.SET_PURCHASED_ARTICLES_LAST_EVALUATED_KEY, {
        lastEvaluatedKey: LastEvaluatedKey || null
      })
      commit(types.SET_PURCHASED_ARTICLES, { articles: articlesWithData })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  resetCurrentPrice({ commit }) {
    commit(types.SET_ARTICLE_CURRENT_PRICE, { price: null })
  },
  async getTipEyecatchArticles({ commit, dispatch, rootState }) {
    try {
      // 最終ページ、もしくはミュート済みユーザを除いた記事数が表示件数以上になるまでループ
      // ミュート済みユーザの記事があることを想定し、API コール数を削減するため多めに取得
      const viewCount = 3
      const limitCount = viewCount + 6
      const articles = []
      let pageCount = 1
      let isLast = false
      // ミュート済みユーザの記事を除外した上で、記事数が表示件数以上になるまでループ
      while (!isLast && articles.length < viewCount) {
        const { Items: tmpArticles } = await this.$axios.$get('/api/articles/tip_ranking', {
          params: { limit: limitCount, page: pageCount }
        })
        pageCount++
        if (tmpArticles.length < limitCount) {
          isLast = true
        }
        // ミュート済みユーザの記事を除外後、先頭から表示件数を満たすように articles に追加
        articles.push(
          ...tmpArticles
            .filter((article) => rootState.user.muteUsers.indexOf(article.user_id) === -1)
            .slice(0, viewCount - articles.length)
        )
      }

      const articlesWithData = await Promise.all(
        articles.map(async (article) => {
          if (article === null) return null
          const [userInfo, alisToken] = await Promise.all([
            dispatch('getUserInfo', { userId: article.user_id }),
            dispatch('getAlisToken', { articleId: article.article_id })
          ])
          return { ...article, userInfo, alisToken }
        })
      )
      commit(types.SET_TIP_EYECATCH_ARTICLES, { articles: articlesWithData })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getTipRankingArticles({ commit, state, dispatch, rootState }) {
    try {
      // 最終ページ、もしくはミュート済みユーザを除いた記事数が表示件数以上になるまでループ
      // ミュート済みユーザの記事があることを想定し、API コール数を削減するため多めに取得
      const viewCount = 12
      const limitCount = viewCount + 6
      while (
        !state.tipRankingArticles.isLastPage &&
        state.tipRankingArticles.tmpArticles.length < viewCount
      ) {
        const { Items: tmpArticles } = await this.$axios.$get('/api/articles/tip_ranking', {
          params: { limit: limitCount, page: state.tipRankingArticles.page }
        })
        // ページ数追加
        commit(types.SET_TIP_RANKING_ARTICLES_PAGE, { page: state.tipRankingArticles.page + 1 })
        // ページ末尾のケースを考慮
        if (tmpArticles.length < limitCount) {
          commit(types.SET_TIP_RANKING_ARTICLES_IS_LAST_PAGE, { isLastPage: true })
        }
        // ミュート済みユーザの記事を削除し、tmpArticles に追加
        commit(types.SET_TIP_RANKING_ARTICLES_TMP_ARTICLES, {
          tmpArticles: tmpArticles.filter(
            (article) => rootState.user.muteUsers.indexOf(article.user_id) === -1
          )
        })
      }
      // tmpArticles の先頭から 12 件を取得し、store から削除
      const articles = state.tipRankingArticles.tmpArticles.slice(0, viewCount)
      commit(types.DELETE_TIP_RANKING_ARTICLES_TMP_ARTICLES, { deleteCount: viewCount })

      const articlesWithData = await Promise.all(
        articles.map(async (article) => {
          const [userInfo, alisToken] = await Promise.all([
            dispatch('getUserInfo', { userId: article.user_id }),
            dispatch('getAlisToken', { articleId: article.article_id })
          ])
          return { ...article, userInfo, alisToken }
        })
      )
      commit(types.SET_TIP_RANKING_ARTICLES, { articles: articlesWithData })
      if (state.tipRankingArticles.tmpArticles.length < 1 && state.tipRankingArticles.isLastPage) {
        commit(types.SET_TIP_RANKING_ARTICLES_IS_TMP_ARTICLES_LAST_PAGE, { isLastPage: true })
      }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getArticleSupporters({ commit }, { articleId }) {
    try {
      const { Items: supporters } = await this.$axios.$get(`/api/articles/${articleId}/supporters`)
      commit(types.SET_ARTICLE_SUPPORTERS, { supporters })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getCryptoRankingInfo({ commit }, { limit }) {
    try {
      const rankingInfo = await this.$axios.$get(`/api/crypto/ranking`, {
        params: { limit: limit }
      })
      commit(types.SET_CRYPTO_RANKING_INFO, { rankingInfo })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  resetCryptoRankingInfo({ commit }) {
    commit(types.RESET_CRYPTO_RANKING_INFO)
  },

  // Laboリソース

  async getLaboNArticleRandom({ commit, dispatch }) {
    try {
      const article = await this.$axios.$get(`/laboratory/labo/n/random`)
      const body = getBodyAfterImageTagOptimization(
        article.body,
        process.env.ALIS_APP_DOMAIN,
        article.user_id,
        article.article_id
      )
      const [userInfo, alisToken, likesCount, comments] = await Promise.all([
        dispatch('getUserInfo', { userId: article.user_id }),
        dispatch('getAlisToken', { articleId: article.article_id }),
        dispatch('getLikesCount', { articleId: article.article_id }),
        dispatch('getArticleComments', { articleId: article.article_id })
      ])
      commit(types.SET_LIKES_COUNT, { likesCount })
      commit(types.SET_ARTICLE_DETAIL, {
        article: { ...article, body, userInfo, alisToken, comments }
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const mutations = {
  [types.SET_POPULAR_ARTICLES](state, { articles }) {
    state.popularArticles.push(...articles)
  },
  [types.SET_TMP_POPULAR_ARTICLES](state, { tmpArticles }) {
    state.tmpPopularArticles.push(...tmpArticles)
  },
  [types.SET_TMP_POPULAR_ARTICLE_IDS](state, { tmpArticleIds }) {
    state.tmpPopularArticleIds.push(...tmpArticleIds)
  },
  [types.DELETE_TMP_POPULAR_ARTICLES](state, { deleteCount }) {
    state.tmpPopularArticles.splice(0, deleteCount)
  },
  [types.SET_NEW_ARTICLES](state, { articles }) {
    state.newArticles.push(...articles)
  },
  [types.SET_TMP_NEW_ARTICLES](state, { tmpArticles }) {
    state.tmpNewArticles.push(...tmpArticles)
  },
  [types.DELETE_TMP_NEW_ARTICLES](state, { deleteCount }) {
    state.tmpNewArticles.splice(0, deleteCount)
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
  [types.SET_ARTICLE_ORIGINAL_BODY](state, { originalBody }) {
    state.originalBody = originalBody
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
  [types.SET_ARTICLE_CONTENT_EDIT_HISTORIES](state, { articleContentEditHistories: histories }) {
    state.articleContentEditHistories = histories
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
  [types.SET_PUBLIC_ARTICLES_LAST_EVALUATED_KEY](state, { lastEvaluatedKey }) {
    state.publicArticlesLastEvaluatedKey = lastEvaluatedKey
  },
  [types.SET_DRAFT_ARTICLES_LAST_EVALUATED_KEY](state, { lastEvaluatedKey }) {
    state.draftArticlesLastEvaluatedKey = lastEvaluatedKey
  },
  [types.SET_HAS_NEW_ARTICLES_LAST_EVALUATED_KEY](state, { hasLastEvaluatedKey }) {
    state.hasNewArticlesLastEvaluatedKey = hasLastEvaluatedKey
  },
  [types.SET_HAS_PUBLIC_ARTICLES_LAST_EVALUATED_KEY](state, { hasLastEvaluatedKey }) {
    state.hasPublicArticlesLastEvaluatedKey = hasLastEvaluatedKey
  },
  [types.SET_IS_LIKED_ARTICLE](state, { liked }) {
    state.isLikedArticle = liked
  },
  [types.SET_IS_EDITED](state, { isEdited }) {
    state.isEdited = isEdited
  },
  [types.SET_IS_EDITED_TITLE](state, { isEditedTitle }) {
    state.isEditedTitle = isEditedTitle
  },
  [types.SET_IS_EDITED_BODY](state, { isEditedBody }) {
    state.isEditedBody = isEditedBody
  },
  [types.SET_SAVE_STATUS](state, { saveStatus }) {
    state.saveStatus = saveStatus
  },
  [types.SET_ARTICLE_COMMENTS](state, { comments }) {
    state.article.comments.push(...comments)
    state.article.initComment = true
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
  },
  [types.RESET_SEARCH_ARTICLES_IS_LAST_PAGE](state) {
    state.searchArticles.isLastPage = false
  },
  [types.SET_TOPICS](state, { topics }) {
    state.topics = topics
  },
  [types.SET_ARTICLES_PAGE](state, { page }) {
    state.page = page
  },
  [types.SET_ARTICLES_IS_LAST_PAGE](state, { isLastPage }) {
    state.isLastPage = isLastPage
  },
  [types.SET_TMP_ARTICLES_IS_LAST_PAGE](state, { isLastPage }) {
    state.isTmpArticlesLastPage = isLastPage
  },
  [types.SET_TMP_POPULAR_ARTICLES_IS_LAST_PAGE](state, { isLastPage }) {
    state.isTmpPopularArticlesLastPage = isLastPage
  },
  [types.RESET_ARTICLE_DATA](state) {
    state.newArticles = []
    state.popularArticles = []
    state.tmpNewArticles = []
    state.tmpPopularArticles = []
    state.tmpPopularArticleIds = []
    state.isFetching = false
    state.page = 1
    state.isLastPage = false
    state.isTmpArticlesLastPage = false
    state.isTmpPopularArticlesLastPage = false
    state.eyecatchArticles = []
    // fixme: 本来であれば tipEyecatchArticles も記事情報なので初期化すべきだが、
    //        TOPページから他カテゴリに遷移する際に記事が何も表示されない状態となり、見栄えが悪いためコメントアウトしている。
    // state.tipEyecatchArticles = []
    state.recommendedArticles = {
      articles: [],
      tmpArticles: [],
      tmpArticleIds: [],
      page: 1,
      isLastPage: false,
      isTmpArticlesLastPage: false,
      isTmpRecommendedArticlesLastPage: false
    }
    state.tipRankingArticles = {
      articles: [],
      tmpArticles: [],
      page: 1,
      isLastPage: false,
      isTmpArticlesLastPage: false
    }
  },
  [types.SET_ARTICLE_TYPE](state, { articleType }) {
    state.articleType = articleType
  },
  [types.SET_ARTICLE_TOPIC](state, { topicType }) {
    state.topicType = topicType
  },
  [types.RESET_ARTICLE_TOPIC](state) {
    state.topicType = null
  },
  [types.SET_TOPIC_DISPLAY_NAME](state, { topicName }) {
    state.topics.forEach((topic) => {
      if (topic.name === topicName) {
        state.topicDisplayName = topic.display_name
      }
    })
  },
  [types.SET_FETCHING_ARTICLE_TOPIC](state, { topic }) {
    state.fetchingArticleTopic = topic
  },
  [types.SET_ARTICLE_TAGS](state, { tags = [] }) {
    // vue-tags-input の形式に適するようにタグを整形
    const formattedTags = (tags || []).map((tag) => {
      return {
        text: tag,
        tiClasses: ['ti-valid']
      }
    })
    state.tags = formattedTags
  },
  [types.UPDATE_TAGS](state, { tags }) {
    state.tags = tags
  },
  [types.SET_TAG_ARTICLES](state, { articles }) {
    state.tagArticles.articles.push(...articles)
  },
  [types.SET_TAG_ARTICLES_IS_LAST_PAGE](state, { isLastPage }) {
    state.tagArticles.isLastPage = isLastPage
  },
  [types.SET_TAG_ARTICLES_PAGE](state, { page }) {
    state.tagArticles.page = page
  },
  [types.RESET_TAG_ARTICLES_DATA](state) {
    state.tagArticles.articles = []
    state.tagArticles.page = 1
    state.tagArticles.isLastPage = false
  },
  [types.SET_TAG_ARTICLES_CURRENT_TAG](state, { tag }) {
    state.tagArticles.currentTag = tag
  },
  [types.ADD_ARTICLE_REPLY_COMMENT](state, { replyComment, parentId }) {
    const parentCommentIndex = state.article.comments.findIndex(
      (comment) => comment.comment_id === parentId
    )
    state.article.comments[parentCommentIndex].replies.unshift(replyComment)
  },
  [types.DELETE_ARTICLE_REPLY_COMMENT](state, { commentId, parentId }) {
    const parentCommentIndex = state.article.comments.findIndex(
      (comment) => comment.comment_id === parentId
    )
    const replies = state.article.comments[parentCommentIndex].replies.filter(
      (comment) => comment.comment_id !== commentId
    )
    state.article.comments[parentCommentIndex].replies = replies
  },
  [types.SET_IS_FETCHED_PUBLIC_ARTICLE](state, { isFetched }) {
    state.isFetchedPublicArticle = isFetched
  },
  [types.SET_EYECATCH_ARTICLES](state, { articles }) {
    state.eyecatchArticles = articles
  },
  [types.SET_RECOMMENDED_ARTICLES](state, { articles }) {
    state.recommendedArticles.articles.push(...articles)
  },
  [types.SET_RECOMMENDED_ARTICLES_IS_LAST_PAGE](state, { isLastPage }) {
    state.recommendedArticles.isLastPage = isLastPage
  },
  [types.SET_TMP_RECOMMENDED_ARTICLES_IS_LAST_PAGE](state, { isLastPage }) {
    state.recommendedArticles.isTmpRecommendedArticlesLastPage = isLastPage
  },
  [types.SET_RECOMMENDED_ARTICLES_IS_TMP_ARTICLES_LAST_PAGE](state, { isLastPage }) {
    state.recommendedArticles.isTmpArticlesLastPage = isLastPage
  },
  [types.SET_RECOMMENDED_ARTICLES_PAGE](state, { page }) {
    state.recommendedArticles.page = page
  },
  [types.SET_RECOMMENDED_ARTICLES_TMP_ARTICLES](state, { tmpArticles }) {
    state.recommendedArticles.tmpArticles.push(...tmpArticles)
  },
  [types.SET_RECOMMENDED_ARTICLES_TMP_ARTICLE_IDS](state, { tmpArticleIds }) {
    state.recommendedArticles.tmpArticleIds.push(...tmpArticleIds)
  },
  [types.DELETE_RECOMMENDED_ARTICLES_TMP_ARTICLES](state, { deleteCount }) {
    state.recommendedArticles.tmpArticles.splice(0, deleteCount)
  },
  [types.SET_IS_FETCHING_TAG_ARTICLES](state, { isFetching }) {
    state.tagArticles.isFetching = isFetching
  },
  [types.RESET_ARTICLE_COMMENTS_LAST_EVALUATED_KEY](state) {
    state.articleCommentsLastEvaluatedKey = {}
  },
  [types.SET_PURCHASED_ARTICLE_IDS](state, { articleIds }) {
    state.purchasedArticleIds = articleIds
  },
  [types.UPDATE_ARTICLE_PRICE](state, { price }) {
    state.article.price = price
  },
  [types.SET_PURCHASED_ARTICLES_LAST_EVALUATED_KEY](state, { lastEvaluatedKey }) {
    state.purchasedArticles.lastEvaluatedKey = lastEvaluatedKey
  },
  [types.SET_PURCHASED_ARTICLES](state, { articles }) {
    state.purchasedArticles.articles.push(...articles)
  },
  [types.SET_ARTICLE_CURRENT_PRICE](state, { price }) {
    state.currentPrice = price || null
  },
  [types.SET_IS_FETCHED_PURCHASED_ARTICLE](state, { isFetched }) {
    state.isFetchedPurchasedArticle = isFetched
  },
  [types.SET_TIP_EYECATCH_ARTICLES](state, { articles }) {
    state.tipEyecatchArticles = articles
  },
  [types.SET_TIP_RANKING_ARTICLES](state, { articles }) {
    state.tipRankingArticles.articles.push(...articles)
  },
  [types.SET_TIP_RANKING_ARTICLES_IS_LAST_PAGE](state, { isLastPage }) {
    state.tipRankingArticles.isLastPage = isLastPage
  },
  [types.SET_TIP_RANKING_ARTICLES_IS_TMP_ARTICLES_LAST_PAGE](state, { isLastPage }) {
    state.tipRankingArticles.isTmpArticlesLastPage = isLastPage
  },
  [types.SET_TIP_RANKING_ARTICLES_PAGE](state, { page }) {
    state.tipRankingArticles.page = page
  },
  [types.SET_TIP_RANKING_ARTICLES_TMP_ARTICLES](state, { tmpArticles }) {
    state.tipRankingArticles.tmpArticles.push(...tmpArticles)
  },
  [types.DELETE_TIP_RANKING_ARTICLES_TMP_ARTICLES](state, { deleteCount }) {
    state.tipRankingArticles.tmpArticles.splice(0, deleteCount)
  },
  [types.SET_ARTICLE_SUPPORTERS](state, { supporters }) {
    state.supporters = supporters
  },
  [types.SET_CRYPTO_RANKING_INFO](state, { rankingInfo }) {
    state.cryptoRankingInfo = rankingInfo
  },
  [types.RESET_CRYPTO_RANKING_INFO](state) {
    state.cryptoRankingInfo = []
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
