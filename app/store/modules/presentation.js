import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  articleListScrollHeight: 0
})

const getters = {
  articleListScrollHeight: (state) => state.articleListScrollHeight
}

const actions = {
  setArticleListScrollHeight({ commit }, { scrollHeight }) {
    commit(types.SET_ARTICLE_LIST_SCROLL_HEIGHT, { scrollHeight })
  }
}

const mutations = {
  [types.SET_ARTICLE_LIST_SCROLL_HEIGHT](state, { scrollHeight }) {
    state.articleListScrollHeight = scrollHeight
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
