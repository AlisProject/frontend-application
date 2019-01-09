import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  articleListScrollHeight: 0,
  notificationListScrollHeight: 0,
  searchArticlesScrollHeight: 0,
  searchUsersScrollHeight: 0,
  searchTagsScrollHeight: 0,
  tagArticlesScrollHeight: 0,
  defaultHeaderNavHorizontalScrollPosition: 0
})

const getters = {
  articleListScrollHeight: (state) => state.articleListScrollHeight,
  notificationListScrollHeight: (state) => state.notificationListScrollHeight,
  searchArticlesScrollHeight: (state) => state.searchArticlesScrollHeight,
  searchUsersScrollHeight: (state) => state.searchUsersScrollHeight,
  searchTagsScrollHeight: (state) => state.searchTagsScrollHeight,
  tagArticlesScrollHeight: (state) => state.tagArticlesScrollHeight,
  defaultHeaderNavHorizontalScrollPosition: (state) =>
    state.defaultHeaderNavHorizontalScrollPosition
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
  },
  setSearchTagsScrollHeight({ commit }, { scrollHeight }) {
    commit(types.SET_SEARCH_TAGS_SCROLL_HEIGHT, { scrollHeight })
  },
  setTagArticlesScrollHeight({ commit }, { scrollHeight }) {
    commit(types.SET_TAG_ARTICLES_SCROLL_HEIGHT, { scrollHeight })
  },
  setDefaultHeaderNavHorizontalScrollPosition({ commit }, { scrollPosition }) {
    commit(types.SET_DEFAULT_HEADER_NAV_HORIZONTAL_SCROLL_POSITION, { scrollPosition })
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
  },
  [types.SET_SEARCH_TAGS_SCROLL_HEIGHT](state, { scrollHeight }) {
    state.searchTagsScrollHeight = scrollHeight
  },
  [types.SET_TAG_ARTICLES_SCROLL_HEIGHT](state, { scrollHeight }) {
    state.tagArticlesScrollHeight = scrollHeight
  },
  [types.SET_DEFAULT_HEADER_NAV_HORIZONTAL_SCROLL_POSITION](state, { scrollPosition }) {
    state.defaultHeaderNavHorizontalScrollPosition = scrollPosition
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
