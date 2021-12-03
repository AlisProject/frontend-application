import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  articleDeleteModal: {
    isShow: false
  }
})

const getters = {
  articleDeleteModal: (state) => state.articleDeleteModal
}

const actions = {
  setArticleDeleteModal({ commit }, { isShow }) {
    commit(types.SET_ARTICLE_DELETE_MODAL, { isShow })
  }
}

const mutations = {
  [types.SET_ARTICLE_DELETE_MODAL](state, { isShow }) {
    state.articleDeleteModal.isShow = isShow
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
