import { BigNumber } from 'bignumber.js'
import * as types from '../mutation-types'
import CognitoSDK from '~/utils/cognito-sdk'

const namespaced = true

const state = () => ({
  currentUser: null,
  loggedIn: false,
  showSignUpModal: false,
  showSignUpAuthFlowModal: false,
  showLoginModal: false,
  showProfileSettingsModal: false,
  sentMail: false,
  signUpModal: {
    formData: {
      userId: '',
      email: '',
      password: ''
    },
    formError: {
      userId: false,
      email: false,
      password: false
    }
  },
  signUpAuthFlowModal: {
    isLoginModal: false,
    isInputPhoneNumberModal: false,
    isInputAuthCodeModal: false,
    isCompletedPhoneNumberAuthModal: false,
    isProfileSettingsModal: false,
    login: {
      formData: {
        userIdOrEmail: '',
        password: ''
      },
      formError: {
        userIdOrEmail: false,
        password: false
      }
    },
    inputPhoneNumber: {
      formData: {
        phoneNumber: ''
      },
      formError: {
        phoneNumber: false
      }
    },
    inputAuthCode: {
      formData: {
        authCode: ''
      },
      formError: {
        authCode: false
      }
    },
    profileSettings: {
      formData: {
        userDisplayName: '',
        selfIntroduction: ''
      },
      formError: {
        userDisplayName: false,
        selfIntroduction: false
      }
    }
  },
  loginModal: {
    formData: {
      userIdOrEmail: '',
      password: ''
    },
    formError: {
      userIdOrEmail: false,
      password: false
    }
  },
  profileSettingsModal: {
    formData: {
      userDisplayName: '',
      selfIntroduction: ''
    },
    formError: {
      userDisplayName: false,
      selfIntroduction: false
    }
  },
  showReportModal: false,
  currentUserInfo: {},
  showRestrictEditArticleModal: false,
  userInfo: {},
  userArticles: [],
  userArticlesLastEvaluatedKey: {},
  hasUserArticlesLastEvaluatedKey: false,
  showRequestLoginModal: false,
  alisToken: 0
})

const getters = {
  currentUser: (state) => state.currentUser,
  loggedIn: (state) => state.loggedIn,
  showSignUpModal: (state) => state.showSignUpModal,
  sentMail: (state) => state.sentMail,
  signUpModal: (state) => state.signUpModal,
  showSignUpAuthFlowModal: (state) => state.showSignUpAuthFlowModal,
  signUpAuthFlowModal: (state) => state.signUpAuthFlowModal,
  showLoginModal: (state) => state.showLoginModal,
  loginModal: (state) => state.loginModal,
  showReportModal: (state) => state.showReportModal,
  showProfileSettingsModal: (state) => state.showProfileSettingsModal,
  profileSettingsModal: (state) => state.profileSettingsModal,
  currentUserInfo: (state) => state.currentUserInfo,
  showRestrictEditArticleModal: (state) => state.showRestrictEditArticleModal,
  userInfo: (state) => state.userInfo,
  userArticles: (state) => state.userArticles,
  userArticlesLastEvaluatedKey: (state) => state.userArticlesLastEvaluatedKey,
  showRequestLoginModal: (state) => state.showRequestLoginModal,
  alisToken: (state) => state.alisToken
}

const actions = {
  initCognito() {
    this.cognito = new CognitoSDK()
  },
  setSignUpModal({ commit }, { showSignUpModal }) {
    commit(types.SET_SIGN_UP_MODAL, { showSignUpModal })
  },
  setSentMail({ commit }, { sentMail }) {
    commit(types.SET_SENT_MAIL, { sentMail })
  },
  setSignUpUserId({ commit }, { userId }) {
    commit(types.SET_SIGN_UP_USER_ID, { userId })
  },
  setSignUpEmail({ commit }, { email }) {
    commit(types.SET_SIGN_UP_EMAIL, { email })
  },
  setSignUpPassword({ commit }, { password }) {
    commit(types.SET_SIGN_UP_PASSWORD, { password })
  },
  showSignUpError({ commit }, { type }) {
    commit(types.SHOW_SIGN_UP_ERROR, { type })
  },
  hideSignUpError({ commit }, { type }) {
    commit(types.HIDE_SIGN_UP_ERROR, { type })
  },
  hideSignUpErrors({ commit }) {
    commit(types.HIDE_SIGN_UP_ERRORS)
  },
  setSignUpAuthFlowModal({ commit }, { showSignUpAuthFlowModal }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_MODAL, { showSignUpAuthFlowModal })
  },
  setSignUpAuthFlowLoginModal({ commit }, { isSignUpAuthFlowLoginModal }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_LOGIN_MODAL, { isSignUpAuthFlowLoginModal })
  },
  setSignUpAuthFlowLoginUserIdOrEmail({ commit }, { userIdOrEmail }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_LOGIN_USER_ID_OR_EMAIL, { userIdOrEmail })
  },
  setSignUpAuthFlowLoginPassword({ commit }, { password }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_LOGIN_PASSWORD, { password })
  },
  showSignUpAuthFlowLoginError({ commit }, { type }) {
    commit(types.SHOW_SIGN_UP_AUTH_FLOW_LOGIN_ERROR, { type })
  },
  hideSignUpAuthFlowLoginError({ commit }, { type }) {
    commit(types.HIDE_SIGN_UP_AUTH_FLOW_LOGIN_ERROR, { type })
  },
  setSignUpAuthFlowInputPhoneNumberModal({ commit }, { isSignUpAuthFlowInputPhoneNumberModal }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_INPUT_PHONE_NUMBER_MODAL, { isSignUpAuthFlowInputPhoneNumberModal })
  },
  setSignUpAuthFlowInputPhoneNumberPhoneNumber({ commit }, { phoneNumber }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_INPUT_PHONE_NUMBER_PHONE_NUMBER, { phoneNumber })
  },
  showSignUpAuthFlowInputPhoneNumberError({ commit }, { type }) {
    commit(types.SHOW_SIGN_UP_AUTH_FLOW_INPUT_PHONE_NUMBER_ERROR, { type })
  },
  hideSignUpAuthFlowInputPhoneNumberError({ commit }, { type }) {
    commit(types.HIDE_SIGN_UP_AUTH_FLOW_INPUT_PHONE_NUMBER_ERROR, { type })
  },
  setSignUpAuthFlowInputAuthCodeModal({ commit }, { isSignUpAuthFlowInputAuthCodeModal }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_INPUT_AUTH_CODE_MODAL, { isSignUpAuthFlowInputAuthCodeModal })
  },
  setSignUpAuthFlowInputAuthCodeAuthCode({ commit }, { authCode }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_INPUT_AUTH_CODE_AUTH_CODE, { authCode })
  },
  showSignUpAuthFlowInputAuthCodeError({ commit }, { type }) {
    commit(types.SHOW_SIGN_UP_AUTH_FLOW_INPUT_AUTH_CODE_ERROR, { type })
  },
  hideSignUpAuthFlowInputAuthCodeError({ commit }, { type }) {
    commit(types.HIDE_SIGN_UP_AUTH_FLOW_INPUT_AUTH_CODE_ERROR, { type })
  },
  setSignUpAuthFlowCompletedPhoneNumberAuthModal({ commit }, { isSignUpAuthFlowCompletedPhoneNumberAuthModal }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_COMPLETED_PHONE_NUMBER_AUTH_MODAL, { isSignUpAuthFlowCompletedPhoneNumberAuthModal })
  },
  setLoginModal({ commit }, { showLoginModal }) {
    commit(types.SET_LOGIN_MODAL, { showLoginModal })
  },
  setLoginUserIdOrEmail({ commit }, { userIdOrEmail }) {
    commit(types.SET_LOGIN_USER_ID_OR_EMAIL, { userIdOrEmail })
  },
  setLoginPassword({ commit }, { password }) {
    commit(types.SET_LOGIN_PASSWORD, { password })
  },
  showLoginError({ commit }, { type }) {
    commit(types.SHOW_LOGIN_ERROR, { type })
  },
  hideLoginError({ commit }, { type }) {
    commit(types.HIDE_LOGIN_ERROR, { type })
  },
  hideLoginErrors({ commit }) {
    commit(types.HIDE_LOGIN_ERRORS)
  },
  setSignUpAuthFlowProfileSettingsModal({ commit }, { isSignUpAuthFlowProfileSettingsModal }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_PROFILE_SETTINGS_MODAL, { isSignUpAuthFlowProfileSettingsModal })
  },
  setProfileSettingsUserDisplayName({ commit }, { userDisplayName }) {
    commit(types.SET_PROFILE_SETTINGS_USER_DISPLAY_NAME, { userDisplayName })
  },
  setProfileSettingsSelfIntroduction({ commit }, { selfIntroduction }) {
    commit(types.SET_PROFILE_SETTINGS_SELF_INDRODUCTION, { selfIntroduction })
  },
  showProfileSettingsError({ commit }, { type }) {
    commit(types.SHOW_PROFILE_SETTINGS_ERROR, { type })
  },
  hideProfileSettingsError({ commit }, { type }) {
    commit(types.HIDE_PROFILE_SETTINGS_ERROR, { type })
  },
  setReportModal({ commit }, { showReportModal }) {
    commit(types.SET_REPORT_MODAL, { showReportModal })
  },
  async register({ commit }, { userId, email, password }) {
    try {
      const result = await this.cognito.register({ email, password, userId })
      return result.userConfirmed
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async confirmEmail({ commit }, { user, code }) {
    try {
      const result = await this.cognito.confirmEmail({ user, code })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async signUpLogin({ commit }, { userId, password }) {
    try {
      const result = await this.cognito.login({ userId, password })
      commit(types.SET_LOGGED_IN, { loggedIn: true })
      commit(types.SET_CURRENT_USER, { user: result })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async updatePhoneNumber({ commit }, { userId, phoneNumber }) {
    try {
      const result = await this.cognito.updatePhoneNumber({ userId, phoneNumber })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async sendConfirm() {
    try {
      const result = await this.cognito.sendConfirm()
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async verifySMSCode({ commit }, { code }) {
    try {
      const result = await this.cognito.verifySMSCode({ code })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async login({ commit }, { userId, password }) {
    try {
      const result = await this.cognito.login({ userId, password })
      if (!result.phoneNumberVerified) {
        commit(types.SET_LOGGED_IN, { loggedIn: true })
        commit(types.SET_CURRENT_USER, { user: result })
      }
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getUserSession({ commit, dispatch }) {
    try {
      const result = await this.cognito.getUserSession()
      commit(types.SET_LOGGED_IN, { loggedIn: true })
      commit(types.SET_CURRENT_USER, { user: result })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async refreshUserSession({ commit }) {
    try {
      const result = await this.cognito.refreshUserSession()
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async logout({ commit, state }) {
    try {
      const result = await this.cognito.logoutUser({ userId: state.currentUser.userId })
      commit(types.SET_LOGGED_IN, { loggedIn: false })
      commit(types.SET_CURRENT_USER, { user: null })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async forgotPassword({ commit }) {
    try {
      const userId = prompt('登録したメールアドレスもしくはユーザーIDを入力してください', '')
      await this.cognito.forgotPassword({ userId })
      alert('パスワードをリセットしました。')
    } catch (error) {
      alert(error.message)
      Promise.reject(error)
    }
  },
  setLoggedIn({ commit }, { loggedIn }) {
    commit(types.SET_LOGGED_IN, { loggedIn })
  },
  async putUserInfo({ commit }, { userDisplayName, selfIntroduction }) {
    await this.$axios.$put('/me/info', { user_display_name: userDisplayName, self_introduction: selfIntroduction })
  },
  async postUserIcon({ commit }, { iconImage, imageContentType }) {
    try {
      const config = {
        headers: { 'content-type': imageContentType }
      }
      const result = await this.$axios.$post('/me/info/icon', { icon_image: iconImage }, config)
      return result
    } catch (error) {
      Promise.reject(error)
    }
  },
  setProfileSettingsModal({ commit }, { showProfileSettingsModal }) {
    commit(types.SET_PROFILE_SETTINGS_MODAL, { showProfileSettingsModal })
  },
  hideProfileSettingsErrors({ commit }) {
    commit(types.HIDE_PROFILE_SETTINGS_ERRORS)
  },
  async setCurrentUserInfo({ commit }) {
    try {
      const result = await this.$axios.$get('/me/info')
      commit(types.SET_CURRENT_USER_INFO, { currentUserInfo: result })
    } catch (error) {
      Promise.reject(error)
    }
  },
  setRestrictEditArticleModal({ commit }, { showRestrictEditArticleModal }) {
    commit(types.SET_RESTRICT_EDIT_ARTICLE_MODAL, { showRestrictEditArticleModal })
  },
  async setUserInfo({ commit }, { userId }) {
    try {
      const result = await this.$axios.$get(`/users/${userId}/info`)
      commit(types.SET_USER_INFO, { userInfo: result })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getUserArticles({ commit, dispatch, state }, { userId }) {
    if (!state.hasUserArticlesLastEvaluatedKey) {
      try {
        commit(types.SET_HAS_USER_ARTICLES_LAST_EVALUATED_KEY, { hasLastEvaluatedKey: true })
        const { article_id: articleId, sort_key: sortKey } = state.userArticlesLastEvaluatedKey
        await dispatch('setUserInfo', { userId })
        const { userInfo } = state
        const {
          Items: articles, LastEvaluatedKey
        } = await this.$axios.$get(
          `/users/${userInfo.user_id}/articles/public`,
          { params: { limit: 10, article_id: articleId, sort_key: sortKey } }
        )
        commit(types.SET_USER_ARTICLES_LAST_EVALUATED_KEY, { lastEvaluatedKey: LastEvaluatedKey })
        const articlesWithData = await Promise.all(
          articles.map(async (article) => {
            const { alis_token: alisToken } = await this.$axios.$get(`/articles/${article.article_id}/alistoken`)
            return { ...article, userInfo, alisToken }
          })
        )
        commit(types.SET_USER_ARTICLES, { articles: articlesWithData })
      } catch (error) {
        Promise.reject(error)
      } finally {
        commit(types.SET_HAS_USER_ARTICLES_LAST_EVALUATED_KEY, { hasLastEvaluatedKey: false })
      }
    }
  },
  resetUserArticles({ commit }) {
    commit(types.RESET_USER_ARTICLES)
  },
  resetUserArticlesLastEvaluatedKey({ commit }) {
    commit(types.RESET_USER_ARTICLES_LAST_EVALUATED_KEY)
  },
  resetPassword({ commit }) {
    commit(types.RESET_PASSWORD)
  },
  setRequestLoginModal({ commit }, { showRequestLoginModal }) {
    commit(types.SET_REQUEST_LOGIN_MODAL, { showRequestLoginModal })
  },
  async getUsersAlisToken({ commit }) {
    try {
      const { result } = await this.$axios.$get('/me/wallet/balance')
      const formatNumber = 10 ** 18
      const alisToken = new BigNumber(result, 16).div(formatNumber).toFixed(3, 1)
      commit(types.SET_USERS_ALIS_TOKEN, { alisToken })
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const mutations = {
  [types.SET_LOGGED_IN](state, { loggedIn }) {
    state.loggedIn = loggedIn
  },
  [types.SET_SIGN_UP_MODAL](state, { showSignUpModal }) {
    state.showSignUpModal = showSignUpModal
  },
  [types.SET_SENT_MAIL](state, { sentMail }) {
    state.sentMail = sentMail
  },
  [types.SET_SIGN_UP_USER_ID](state, { userId }) {
    state.signUpModal.formData.userId = userId
  },
  [types.SET_SIGN_UP_EMAIL](state, { email }) {
    state.signUpModal.formData.email = email
  },
  [types.SET_SIGN_UP_PASSWORD](state, { password }) {
    state.signUpModal.formData.password = password
  },
  [types.SHOW_SIGN_UP_ERROR](state, { type }) {
    state.signUpModal.formError[type] = true
  },
  [types.HIDE_SIGN_UP_ERROR](state, { type }) {
    state.signUpModal.formError[type] = false
  },
  [types.HIDE_SIGN_UP_ERRORS]({ signUpModal: { formError } }) {
    Object.keys(formError).forEach(key => {
      formError[key] = false
    })
  },
  [types.SET_SIGN_UP_AUTH_FLOW_MODAL](state, { showSignUpAuthFlowModal }) {
    state.showSignUpAuthFlowModal = showSignUpAuthFlowModal
  },
  [types.SET_SIGN_UP_AUTH_FLOW_LOGIN_MODAL](state, { isSignUpAuthFlowLoginModal }) {
    state.signUpAuthFlowModal.isLoginModal = isSignUpAuthFlowLoginModal
  },
  [types.SET_SIGN_UP_AUTH_FLOW_LOGIN_USER_ID_OR_EMAIL](state, { userIdOrEmail }) {
    state.signUpAuthFlowModal.login.formData.userIdOrEmail = userIdOrEmail
  },
  [types.SET_SIGN_UP_AUTH_FLOW_LOGIN_PASSWORD](state, { password }) {
    state.signUpAuthFlowModal.login.formData.password = password
  },
  [types.SHOW_SIGN_UP_AUTH_FLOW_LOGIN_ERROR](state, { type }) {
    state.signUpAuthFlowModal.login.formError[type] = true
  },
  [types.HIDE_SIGN_UP_AUTH_FLOW_LOGIN_ERROR](state, { type }) {
    state.signUpAuthFlowModal.login.formError[type] = false
  },
  [types.SET_SIGN_UP_AUTH_FLOW_INPUT_PHONE_NUMBER_MODAL](state, { isSignUpAuthFlowInputPhoneNumberModal }) {
    state.signUpAuthFlowModal.isInputPhoneNumberModal = isSignUpAuthFlowInputPhoneNumberModal
  },
  [types.SET_SIGN_UP_AUTH_FLOW_INPUT_PHONE_NUMBER_PHONE_NUMBER](state, { phoneNumber }) {
    state.signUpAuthFlowModal.inputPhoneNumber.formData.phoneNumber = phoneNumber
  },
  [types.SHOW_SIGN_UP_AUTH_FLOW_INPUT_PHONE_NUMBER_ERROR](state, { type }) {
    state.signUpAuthFlowModal.inputPhoneNumber.formError[type] = true
  },
  [types.HIDE_SIGN_UP_AUTH_FLOW_INPUT_PHONE_NUMBER_ERROR](state, { type }) {
    state.signUpAuthFlowModal.inputPhoneNumber.formError[type] = false
  },
  [types.SET_SIGN_UP_AUTH_FLOW_INPUT_AUTH_CODE_MODAL](state, { isSignUpAuthFlowInputAuthCodeModal }) {
    state.signUpAuthFlowModal.isInputAuthCodeModal = isSignUpAuthFlowInputAuthCodeModal
  },
  [types.SET_SIGN_UP_AUTH_FLOW_INPUT_AUTH_CODE_AUTH_CODE](state, { authCode }) {
    state.signUpAuthFlowModal.inputAuthCode.formData.authCode = authCode
  },
  [types.SHOW_SIGN_UP_AUTH_FLOW_INPUT_AUTH_CODE_ERROR](state, { type }) {
    state.signUpAuthFlowModal.inputAuthCode.formError[type] = true
  },
  [types.HIDE_SIGN_UP_AUTH_FLOW_INPUT_AUTH_CODE_ERROR](state, { type }) {
    state.signUpAuthFlowModal.inputAuthCode.formError[type] = false
  },
  [types.SET_SIGN_UP_AUTH_FLOW_COMPLETED_PHONE_NUMBER_AUTH_MODAL](state, { isSignUpAuthFlowCompletedPhoneNumberAuthModal }) {
    state.signUpAuthFlowModal.isCompletedPhoneNumberAuthModal = isSignUpAuthFlowCompletedPhoneNumberAuthModal
  },
  [types.SET_LOGIN_MODAL](state, { showLoginModal }) {
    state.showLoginModal = showLoginModal
  },
  [types.SET_LOGIN_USER_ID_OR_EMAIL](state, { userIdOrEmail }) {
    state.loginModal.formData.userIdOrEmail = userIdOrEmail
  },
  [types.SET_LOGIN_PASSWORD](state, { password }) {
    state.loginModal.formData.password = password
  },
  [types.SHOW_LOGIN_ERROR](state, { type }) {
    state.loginModal.formError[type] = true
  },
  [types.HIDE_LOGIN_ERROR](state, { type }) {
    state.loginModal.formError[type] = false
  },
  [types.HIDE_LOGIN_ERRORS]({ loginModal: { formError } }) {
    Object.keys(formError).forEach(key => {
      formError[key] = false
    })
  },
  [types.SET_SIGN_UP_AUTH_FLOW_PROFILE_SETTINGS_MODAL](state, { isSignUpAuthFlowProfileSettingsModal }) {
    state.signUpAuthFlowModal.isProfileSettingsModal = isSignUpAuthFlowProfileSettingsModal
  },
  [types.SET_PROFILE_SETTINGS_USER_DISPLAY_NAME](state, { userDisplayName }) {
    state.profileSettingsModal.formData.userDisplayName = userDisplayName
  },
  [types.SET_PROFILE_SETTINGS_SELF_INDRODUCTION](state, { selfIntroduction }) {
    state.profileSettingsModal.formData.selfIntroduction = selfIntroduction
  },
  [types.SHOW_PROFILE_SETTINGS_ERROR](state, { type }) {
    state.profileSettingsModal.formError[type] = true
  },
  [types.HIDE_PROFILE_SETTINGS_ERROR](state, { type }) {
    state.profileSettingsModal.formError[type] = false
  },
  [types.SET_REPORT_MODAL](state, { showReportModal }) {
    state.showReportModal = showReportModal
  },
  [types.SET_CURRENT_USER](state, { user }) {
    state.currentUser = user
  },
  [types.SET_PROFILE_SETTINGS_MODAL](state, { showProfileSettingsModal }) {
    state.showProfileSettingsModal = showProfileSettingsModal
  },
  [types.HIDE_PROFILE_SETTINGS_ERRORS]({ profileSettingsModal: { formError } }) {
    Object.keys(formError).forEach(key => {
      formError[key] = false
    })
  },
  [types.SET_CURRENT_USER_INFO](state, { currentUserInfo }) {
    state.currentUserInfo = currentUserInfo
  },
  [types.SET_RESTRICT_EDIT_ARTICLE_MODAL](state, { showRestrictEditArticleModal }) {
    state.showRestrictEditArticleModal = showRestrictEditArticleModal
  },
  [types.SET_USER_INFO](state, { userInfo }) {
    state.userInfo = userInfo
  },
  [types.SET_USER_ARTICLES](state, { articles }) {
    state.userArticles.push(...articles)
  },
  [types.SET_USER_ARTICLES_LAST_EVALUATED_KEY](state, { lastEvaluatedKey }) {
    state.userArticlesLastEvaluatedKey = lastEvaluatedKey
  },
  [types.RESET_USER_ARTICLES](state) {
    state.userArticles = []
  },
  [types.RESET_USER_ARTICLES_LAST_EVALUATED_KEY](state) {
    state.userArticlesLastEvaluatedKey = {}
  },
  [types.RESET_PASSWORD](state) {
    state.signUpModal.formData.password = ''
    state.signUpAuthFlowModal.login.formData.password = ''
    state.loginModal.formData.password = ''
  },
  [types.SET_HAS_USER_ARTICLES_LAST_EVALUATED_KEY](state, { hasLastEvaluatedKey }) {
    state.hasUserArticlesLastEvaluatedKey = hasLastEvaluatedKey
  },
  [types.SET_REQUEST_LOGIN_MODAL](state, { showRequestLoginModal }) {
    state.showRequestLoginModal = showRequestLoginModal
  },
  [types.SET_USERS_ALIS_TOKEN](state, { alisToken }) {
    state.alisToken = alisToken
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
