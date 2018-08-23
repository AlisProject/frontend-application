import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  articleListScrollHeight: 0,
  notificationListScrollHeight: 0,
  searchArticlesScrollHeight: 0,
  searchUsersScrollHeight: 0
})

const getters = {
  articleListScrollHeight: (state) => state.articleListScrollHeight,
  notificationListScrollHeight: (state) => state.notificationListScrollHeight,
  searchArticlesScrollHeight: (state) => state.searchArticlesScrollHeight,
  searchUsersScrollHeight: (state) => state.searchUsersScrollHeight
}

const actions = {
  setArticleListScrollHeight({ commit }, { scrollHeight }) {
    commit(types.SET_ARTICLE_LIST_SCROLL_HEIGHT, { scrollHeight })
  },
  setNotificationListScrollHeight({ commit }, { scrollHeight }) {
    commit(types.SET_NOTIFICATION_LIST_SCROLL_HEIGHT, { scrollHeight })
  },
  setSearchArticlesScrollHeight({ commit }, { scrollHeight }) {
    commit(types.SET_SEARCH_ARTICLES_SCROLL_HEIGHT, { scrollHeight })
  },
  setSearchUsersScrollHeight({ commit }, { scrollHeight }) {
    commit(types.SET_SEARCH_USERS_SCROLL_HEIGHT, { scrollHeight })
  }
}

const mutations = {
  [types.SET_ARTICLE_LIST_SCROLL_HEIGHT](state, { scrollHeight }) {
    state.articleListScrollHeight = scrollHeight
  },
  [types.SET_NOTIFICATION_LIST_SCROLL_HEIGHT](state, { scrollHeight }) {
    state.notificationListScrollHeight = scrollHeight
  },
  [types.SET_SEARCH_ARTICLES_SCROLL_HEIGHT](state, { scrollHeight }) {
    state.searchArticlesScrollHeight = scrollHeight
  },
  [types.SET_SEARCH_USERS_SCROLL_HEIGHT](state, { scrollHeight }) {
    state.searchUsersScrollHeight = scrollHeight
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
