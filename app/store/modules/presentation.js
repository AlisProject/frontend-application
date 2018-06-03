import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  articleListScrollHeight: 0,
  notificationListScrollHeight: 0
})

const getters = {
  articleListScrollHeight: (state) => state.articleListScrollHeight,
  notificationListScrollHeight: (state) => state.notificationListScrollHeight
}

const actions = {
  setArticleListScrollHeight({ commit }, { scrollHeight }) {
    commit(types.SET_ARTICLE_LIST_SCROLL_HEIGHT, { scrollHeight })
  },
  setNotificationListScrollHeight({ commit }, { scrollHeight }) {
    commit(types.SET_NOTIFICATION_LIST_SCROLL_HEIGHT, { scrollHeight })
  }
}

const mutations = {
  [types.SET_ARTICLE_LIST_SCROLL_HEIGHT](state, { scrollHeight }) {
    state.articleListScrollHeight = scrollHeight
  },
  [types.SET_NOTIFICATION_LIST_SCROLL_HEIGHT](state, { scrollHeight }) {
    state.notificationListScrollHeight = scrollHeight
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
