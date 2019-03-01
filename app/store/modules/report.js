import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  userReportModal: {
    isShow: false,
    isSelectReasonModal: false,
    isInputFreeTextModal: false,
    isConfirmationModal: false,
    selectReason: {
      formData: {
        reason: ''
      },
      formError: {
        reason: false
      }
    },
    inputFreeText: {
      formData: {
        originURL: null,
        freeText: ''
      },
      formError: {
        originURL: false,
        freeText: false
      }
    }
  },
  articleReportModal: {
    isShow: false,
    isSelectReasonModal: false,
    isInputFreeTextModal: false,
    isConfirmationModal: false,
    selectReason: {
      formData: {
        reason: ''
      },
      formError: {
        reason: false
      }
    },
    inputFreeText: {
      formData: {
        originURL: null,
        freeText: ''
      },
      formError: {
        originURL: false,
        freeText: false
      }
    }
  }
})

const getters = {
  userReportModal: state => state.userReportModal,
  articleReportModal: state => state.articleReportModal
}

const actions = {
  setUserReportModal({ commit }, { isShow }) {
    commit(types.SET_USER_REPORT_MODAL, { isShow })
  },
  setUserReportSelectReasonModal({ commit }, { isShow }) {
    commit(types.SET_USER_REPORT_SELECT_REASON_MODAL, { isShow })
  },
  setUserReportSelectReasonReason({ commit }, { reason }) {
    commit(types.SET_USER_REPORT_SELECT_REASON_REASON, { reason })
  },
  showUserReportSelectReasonError({ commit }, { type }) {
    commit(types.SHOW_USER_REPORT_SELECT_REASON_ERROR, { type })
  },
  hideUserReportSelectReasonError({ commit }, { type }) {
    commit(types.HIDE_USER_REPORT_SELECT_REASON_ERROR, { type })
  },
  setUserReportInputFreeTextModal({ commit }, { isShow }) {
    commit(types.SET_USER_REPORT_INPUT_FREE_TEXT_MODAL, { isShow })
  },
  setUserReportInputFreeTextOriginURL({ commit }, { originURL }) {
    commit(types.SET_USER_REPORT_INPUT_FREE_TEXT_ORIGIN_URL, { originURL })
  },
  setUserReportInputFreeTextFreeText({ commit }, { freeText }) {
    commit(types.SET_USER_REPORT_INPUT_FREE_TEXT_FREE_TEXT, { freeText })
  },
  showUserReportInputFreeTextError({ commit }, { type }) {
    commit(types.SHOW_USER_REPORT_INPUT_FREE_TEXT_ERROR, { type })
  },
  hideUserReportInputFreeTextError({ commit }, { type }) {
    commit(types.HIDE_USER_REPORT_INPUT_FREE_TEXT_ERROR, { type })
  },
  setUserReportConfirmationModal({ commit }, { isShow }) {
    commit(types.SET_USER_REPORT_CONFIRMATION_MODAL, { isShow })
  },
  async postUserFraud({ commit }, { userId, reason, freeText, originURL }) {
    try {
      const params = {
        reason,
        free_text: freeText
      }
      if (originURL !== null) params.origin_url = originURL
      await this.$axios.$post(`/me/users/${userId}/fraud`, params)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  resetUserReportData({ commit }) {
    commit(types.RESET_USER_REPORT_DATA)
  },
  setArticleReportModal({ commit }, { isShow }) {
    commit(types.SET_ARTICLE_REPORT_MODAL, { isShow })
  },
  setArticleReportSelectReasonModal({ commit }, { isShow }) {
    commit(types.SET_ARTICLE_REPORT_SELECT_REASON_MODAL, { isShow })
  },
  setArticleReportSelectReasonReason({ commit }, { reason }) {
    commit(types.SET_ARTICLE_REPORT_SELECT_REASON_REASON, { reason })
  },
  showArticleReportSelectReasonError({ commit }, { type }) {
    commit(types.SHOW_ARTICLE_REPORT_SELECT_REASON_ERROR, { type })
  },
  hideArticleReportSelectReasonError({ commit }, { type }) {
    commit(types.HIDE_ARTICLE_REPORT_SELECT_REASON_ERROR, { type })
  },
  setArticleReportInputFreeTextModal({ commit }, { isShow }) {
    commit(types.SET_ARTICLE_REPORT_INPUT_FREE_TEXT_MODAL, { isShow })
  },
  setArticleReportInputFreeTextOriginURL({ commit }, { originURL }) {
    commit(types.SET_ARTICLE_REPORT_INPUT_FREE_TEXT_ORIGIN_URL, { originURL })
  },
  setArticleReportInputFreeTextFreeText({ commit }, { freeText }) {
    commit(types.SET_ARTICLE_REPORT_INPUT_FREE_TEXT_FREE_TEXT, { freeText })
  },
  showArticleReportInputFreeTextError({ commit }, { type }) {
    commit(types.SHOW_ARTICLE_REPORT_INPUT_FREE_TEXT_ERROR, { type })
  },
  hideArticleReportInputFreeTextError({ commit }, { type }) {
    commit(types.HIDE_ARTICLE_REPORT_INPUT_FREE_TEXT_ERROR, { type })
  },
  setArticleReportConfirmationModal({ commit }, { isShow }) {
    commit(types.SET_ARTICLE_REPORT_CONFIRMATION_MODAL, { isShow })
  },
  async postArticleFraud({ commit }, { articleId, reason, freeText, originURL }) {
    try {
      const params = {
        reason,
        free_text: freeText
      }
      if (originURL !== null) params.origin_url = originURL
      await this.$axios.$post(`/me/articles/${articleId}/fraud`, params)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  resetArticleReportData({ commit }) {
    commit(types.RESET_ARTICLE_REPORT_DATA)
  }
}

const mutations = {
  [types.SET_USER_REPORT_MODAL](state, { isShow }) {
    state.userReportModal.isShow = isShow
  },
  [types.SET_USER_REPORT_SELECT_REASON_MODAL](state, { isShow }) {
    state.userReportModal.isSelectReasonModal = isShow
  },
  [types.SET_USER_REPORT_SELECT_REASON_REASON](state, { reason }) {
    state.userReportModal.selectReason.formData.reason = reason
  },
  [types.SHOW_USER_REPORT_SELECT_REASON_ERROR](state, { type }) {
    state.userReportModal.selectReason.formError[type] = true
  },
  [types.HIDE_USER_REPORT_SELECT_REASON_ERROR](state, { type }) {
    state.userReportModal.selectReason.formError[type] = false
  },
  [types.SET_USER_REPORT_INPUT_FREE_TEXT_MODAL](state, { isShow }) {
    state.userReportModal.isInputFreeTextModal = isShow
  },
  [types.SET_USER_REPORT_INPUT_FREE_TEXT_ORIGIN_URL](state, { originURL }) {
    state.userReportModal.inputFreeText.formData.originURL = originURL
  },
  [types.SET_USER_REPORT_INPUT_FREE_TEXT_FREE_TEXT](state, { freeText }) {
    state.userReportModal.inputFreeText.formData.freeText = freeText
  },
  [types.SHOW_USER_REPORT_INPUT_FREE_TEXT_ERROR](state, { type }) {
    state.userReportModal.inputFreeText.formError[type] = true
  },
  [types.HIDE_USER_REPORT_INPUT_FREE_TEXT_ERROR](state, { type }) {
    state.userReportModal.inputFreeText.formError[type] = false
  },
  [types.SET_USER_REPORT_CONFIRMATION_MODAL](state, { isShow }) {
    state.userReportModal.isConfirmationModal = isShow
  },
  [types.RESET_USER_REPORT_DATA](state) {
    state.userReportModal.selectReason.formData.reason = ''
    state.userReportModal.inputFreeText.formData.originURL = null
    state.userReportModal.inputFreeText.formData.freeText = ''
    state.userReportModal.selectReason.formError.reason = false
    state.userReportModal.inputFreeText.formError.originURL = false
    state.userReportModal.inputFreeText.formError.freeText = false
  },
  [types.SET_ARTICLE_REPORT_MODAL](state, { isShow }) {
    state.articleReportModal.isShow = isShow
  },
  [types.SET_ARTICLE_REPORT_SELECT_REASON_MODAL](state, { isShow }) {
    state.articleReportModal.isSelectReasonModal = isShow
  },
  [types.SET_ARTICLE_REPORT_SELECT_REASON_REASON](state, { reason }) {
    state.articleReportModal.selectReason.formData.reason = reason
  },
  [types.SHOW_ARTICLE_REPORT_SELECT_REASON_ERROR](state, { type }) {
    state.articleReportModal.selectReason.formError[type] = true
  },
  [types.HIDE_ARTICLE_REPORT_SELECT_REASON_ERROR](state, { type }) {
    state.articleReportModal.selectReason.formError[type] = false
  },
  [types.SET_ARTICLE_REPORT_INPUT_FREE_TEXT_MODAL](state, { isShow }) {
    state.articleReportModal.isInputFreeTextModal = isShow
  },
  [types.SET_ARTICLE_REPORT_INPUT_FREE_TEXT_ORIGIN_URL](state, { originURL }) {
    state.articleReportModal.inputFreeText.formData.originURL = originURL
  },
  [types.SET_ARTICLE_REPORT_INPUT_FREE_TEXT_FREE_TEXT](state, { freeText }) {
    state.articleReportModal.inputFreeText.formData.freeText = freeText
  },
  [types.SHOW_ARTICLE_REPORT_INPUT_FREE_TEXT_ERROR](state, { type }) {
    state.articleReportModal.inputFreeText.formError[type] = true
  },
  [types.HIDE_ARTICLE_REPORT_INPUT_FREE_TEXT_ERROR](state, { type }) {
    state.articleReportModal.inputFreeText.formError[type] = false
  },
  [types.SET_ARTICLE_REPORT_CONFIRMATION_MODAL](state, { isShow }) {
    state.articleReportModal.isConfirmationModal = isShow
  },
  [types.RESET_ARTICLE_REPORT_DATA](state) {
    state.articleReportModal.selectReason.formData.reason = ''
    state.articleReportModal.inputFreeText.formData.originURL = null
    state.articleReportModal.inputFreeText.formData.freeText = ''
    state.articleReportModal.selectReason.formError.reason = false
    state.articleReportModal.inputFreeText.formError.originURL = false
    state.articleReportModal.inputFreeText.formError.freeText = false
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
