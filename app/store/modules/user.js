import { uniqBy } from 'lodash'
import { BigNumber } from 'bignumber.js'
import * as types from '../mutation-types'
import CognitoSDK from '~/utils/cognito-sdk'
import CognitoAuthSDK from '~/utils/cognito-auth-sdk'

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
    isProfileSettingsModal: false,
    isInputUserIdModal: false,
    isCompletedPhoneNumberAuthModal: false,
    isNotCompletedPhoneNumberAuthModal: false,
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
    },
    inputUserId: {
      formData: {
        userId: ''
      },
      formError: {
        userId: false
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
      userDisplayName: false
    }
  },
  currentUserInfo: {},
  showRestrictEditArticleModal: false,
  userInfo: {},
  userArticles: [],
  userArticlesCurrentUserId: false,
  isFetchingUserArticles: false,
  userArticlesLastEvaluatedKey: {},
  requestLoginModal: {
    isShow: false,
    requestType: ''
  },
  alisToken: 0,
  notifications: [],
  notificationsLastEvaluatedKey: {},
  unreadNotification: false,
  searchUsers: {
    users: [],
    page: 1,
    isLastPage: false,
    isFetching: false
  },
  showTipModal: false,
  tipFlowModal: {
    isSelectTipAmountModal: false,
    isConfirmationModal: false,
    isCompletedModal: false
  },
  tipTokenAmount: 0,
  requestPhoneNumberVerifyModal: {
    isShow: false,
    requestType: '',
    isInputPhoneNumberModal: false,
    isInputAuthCodeModal: false,
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
    }
  },
  distributedTokens: {
    article: '0.000',
    like: '0.000',
    tip: '0.000',
    bonus: '0.000'
  },
  firstProcessModal: {
    isShow: false,
    isLikedArticleModal: false,
    isTippedArticleModal: false,
    isGotTokenModal: false,
    isCreatedArticleModal: false
  }
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
  showProfileSettingsModal: (state) => state.showProfileSettingsModal,
  profileSettingsModal: (state) => state.profileSettingsModal,
  currentUserInfo: (state) => state.currentUserInfo,
  showRestrictEditArticleModal: (state) => state.showRestrictEditArticleModal,
  userInfo: (state) => state.userInfo,
  userArticles: (state) => state.userArticles,
  userArticlesLastEvaluatedKey: (state) => state.userArticlesLastEvaluatedKey,
  hasUserArticlesLastEvaluatedKey: (state) => state.userArticlesLastEvaluatedKey !== null,
  requestLoginModal: (state) => state.requestLoginModal,
  alisToken: (state) => state.alisToken,
  notifications: (state) => uniqBy(state.notifications, 'notification_id'),
  notificationsLastEvaluatedKey: (state) => state.notificationsLastEvaluatedKey,
  unreadNotification: (state) => state.unreadNotification,
  hasNotificationsLastEvaluatedKey: (state) =>
    !!Object.keys(state.notificationsLastEvaluatedKey || {}).length,
  searchUsers: (state) => state.searchUsers,
  showTipModal: (state) => state.showTipModal,
  tipFlowModal: (state) => state.tipFlowModal,
  tipTokenAmount: (state) => state.tipTokenAmount,
  requestPhoneNumberVerifyModal: (state) => state.requestPhoneNumberVerifyModal,
  distributedTokens: (state) => state.distributedTokens,
  firstProcessModal: (state) => state.firstProcessModal
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
    commit(types.SET_SIGN_UP_AUTH_FLOW_INPUT_PHONE_NUMBER_MODAL, {
      isSignUpAuthFlowInputPhoneNumberModal
    })
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
    commit(types.SET_SIGN_UP_AUTH_FLOW_INPUT_AUTH_CODE_MODAL, {
      isSignUpAuthFlowInputAuthCodeModal
    })
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
    commit(types.SET_SIGN_UP_AUTH_FLOW_PROFILE_SETTINGS_MODAL, {
      isSignUpAuthFlowProfileSettingsModal
    })
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
      commit(types.SET_LOGGED_IN, { loggedIn: true })
      commit(types.SET_CURRENT_USER, { user: result })
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
  async logout({ commit }) {
    try {
      const userId = localStorage.getItem(
        `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.LastAuthUser`
      )
      const result = await this.cognito.logoutUser({ userId })
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
      if (userId === null) return
      await this.cognito.forgotPassword({ userId })
      alert('パスワードをリセットしました。')
    } catch (error) {
      Promise.reject(error)
    }
  },
  setLoggedIn({ commit }, { loggedIn }) {
    commit(types.SET_LOGGED_IN, { loggedIn })
  },
  async putUserInfo({ commit }, { userDisplayName, selfIntroduction }) {
    await this.$axios.$put('/me/info', {
      user_display_name: userDisplayName,
      self_introduction: selfIntroduction
    })
  },
  async postUserIcon({ commit }, { iconImage, imageContentType }) {
    try {
      const config = {
        headers: { 'content-type': imageContentType }
      }
      const result = await this.$axios.$post('/me/info/icon', { icon_image: iconImage }, config)
      return result
    } catch (error) {
      return Promise.reject(error)
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
  async getUserArticles({ commit, dispatch, state, getters }, { userId }) {
    if (!getters.hasUserArticlesLastEvaluatedKey || state.isFetchingUserArticles) return
    try {
      commit(types.SET_USER_ARTICLES_CURRENT_USER_ID, { userId })
      commit(types.SET_IS_FETCHING_USER_ARTICLES, { isFetching: true })
      const { article_id: articleId, sort_key: sortKey } = state.userArticlesLastEvaluatedKey
      await dispatch('setUserInfo', { userId })
      const { userInfo } = state
      const { Items: articles, LastEvaluatedKey } = await this.$axios.$get(
        `/users/${userInfo.user_id}/articles/public`,
        { params: { limit: 12, article_id: articleId, sort_key: sortKey } }
      )
      commit(types.SET_USER_ARTICLES_LAST_EVALUATED_KEY, {
        lastEvaluatedKey: LastEvaluatedKey || null
      })
      const articlesWithData = await Promise.all(
        articles.map(async (article) => {
          const { alis_token: alisToken } = await this.$axios.$get(
            `/articles/${article.article_id}/alistoken`
          )
          return { ...article, userInfo, alisToken }
        })
      )
      commit(types.SET_USER_ARTICLES, { articles: articlesWithData })
    } catch (error) {
      Promise.reject(error)
    } finally {
      commit(types.SET_IS_FETCHING_USER_ARTICLES, { isFetching: false })
    }
  },
  async getNotifications({ commit, dispatch, state }) {
    try {
      const {
        notification_id: notificationId,
        sort_key: sortKey
      } = state.notificationsLastEvaluatedKey

      const { Items: notifications, LastEvaluatedKey } = await this.$axios.$get(
        '/me/notifications',
        { params: { limit: 10, notification_id: notificationId, sort_key: sortKey } }
      )

      const notificationsWithData = await Promise.all(
        notifications.map(async (notification) => {
          let userInfo
          if (
            notification.type === 'comment' ||
            notification.type === 'tip' ||
            notification.type === 'reply' ||
            notification.type === 'thread'
          ) {
            userInfo = await this.$axios.$get(`/users/${notification.acted_user_id}/info`)
          } else if (notification.type === 'tip_error') {
            userInfo = await this.$axios.$get(`/users/${notification.article_user_id}/info`)
          }
          return { ...notification, userInfo }
        })
      )

      commit(types.SET_NOTIFICATIONS_LAST_EVALUATED_KEY, { lastEvaluatedKey: LastEvaluatedKey })
      commit(types.SET_NOTIFICATIONS, { notifications: notificationsWithData })
    } catch (error) {
      return Promise.reject(error)
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
  setRequestLoginModal({ commit }, { isShow, requestType }) {
    commit(types.SET_REQUEST_LOGIN_MODAL, { isShow, requestType })
  },
  async getUsersAlisToken({ commit }) {
    try {
      const { result } = await this.$axios.$get('/me/wallet/balance')
      const formatNumber = 10 ** 18
      const alisToken = new BigNumber(result, 16).div(formatNumber).toString(10)
      commit(types.SET_USERS_ALIS_TOKEN, { alisToken })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getUnreadNotification({ commit }) {
    try {
      const { unread } = await this.$axios.$get('/me/unread_notification_managers')
      commit(types.SET_UNREAD_NOTIFICATION, { unread })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async putUnreadNotification({ commit }) {
    try {
      const result = await this.$axios.$put('/me/unread_notification_managers')
      const unread = false
      commit(types.SET_UNREAD_NOTIFICATION, { unread })
      return result
    } catch (error) {
      Promise.reject(error)
    }
  },
  async getSearchUsers({ commit, state }, { query }) {
    if (state.searchUsers.isFetching) return
    commit(types.SET_SEARCH_USERS_IS_FETCHING, { isFetching: true })
    const limit = 10
    const users = await this.$axios.$get('/search/users', {
      params: { limit, query, page: state.searchUsers.page }
    })
    commit(types.SET_SEARCH_USERS_IS_FETCHING, { isFetching: false })
    commit(types.SET_SEARCH_USERS, { users })
    commit(types.SET_SEARCH_USERS_PAGE, { page: state.searchUsers.page + 1 })
    if (users.length < limit) {
      commit(types.SET_SEARCH_USERS_IS_LAST_PAGE, { isLastPage: true })
    }
  },
  resetSearchUsers({ commit }) {
    commit(types.RESET_SEARCH_USERS)
  },
  resetSearchUsersPage({ commit }) {
    commit(types.RESET_SEARCH_USERS_PAGE)
  },
  resetSearchUsersIsLastPage({ commit }) {
    commit(types.RESET_SEARCH_USERS_IS_LAST_PAGE)
  },
  setTipModal({ commit }, { showTipModal }) {
    commit(types.SET_TIP_MODAL, { showTipModal })
  },
  setTipFlowSelectTipAmountModal({ commit }, { isShow }) {
    commit(types.SET_TIP_FLOW_SELECT_TIP_AMOUNT_MODAL, { isShow })
  },
  setTipFlowConfirmationModal({ commit }, { isShow }) {
    commit(types.SET_TIP_FLOW_CONFIRMATION_MODAL, { isShow })
  },
  hideTipFlowModalContent({ commit }) {
    commit(types.HIDE_TIP_FLOW_MODAL_CONTENT)
  },
  setTipTokenAmount({ commit }, { tipTokenAmount }) {
    commit(types.SET_TIP_TOKEN_AMOUNT, { tipTokenAmount })
  },
  setTipFlowCompletedModal({ commit }, { isShow }) {
    commit(types.SET_TIP_FLOW_COMPLETED_MODAL, { isShow })
  },
  async postTipToken({ commit }, { tipValue, articleId }) {
    try {
      await this.$axios.$post('/me/wallet/tip', { tip_value: tipValue, article_id: articleId })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  resetNotificationData({ commit }) {
    commit(types.RESET_NOTIFICATION_DATA)
  },
  initCognitoAuth({ state }) {
    this.cognitoAuth = new CognitoAuthSDK()
  },
  async checkAuthByLine({ commit, dispatch }, { code }) {
    dispatch('initCognitoAuth')

    const result = await this.$axios.$post('/login/line', { code })
    this.cognitoAuth.setTokens(result)

    const hasUserId = result.has_user_id
    const status = result.status

    return { hasUserId, status }
  },
  setSignUpAuthFlowInputUserIdModal({ commit }, { isShow }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_INPUT_USER_ID_MODAL, { isShow })
  },
  setSignUpAuthFlowUserId({ commit }, { userId }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_USER_ID, { userId })
  },
  showSignUpAuthFlowInputUserIdError({ commit }, { type }) {
    commit(types.SHOW_SIGN_UP_AUTH_FLOW_INPUT_USER_ID_ERROR, { type })
  },
  hideSignUpAuthFlowInputUserIdError({ commit }, { type }) {
    commit(types.HIDE_SIGN_UP_AUTH_FLOW_INPUT_USER_ID_ERROR, { type })
  },
  async postUserId({ state, dispatch }, { userId }) {
    try {
      const externalProviderUserId = localStorage.getItem(
        `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.LastAuthUser`
      )
      const result = await this.$axios.$post('/me/external_provider_user', {
        user_id: userId
      })

      if (!this.cognitoAuth) {
        dispatch('initCognitoAuth')
      }

      this.cognitoAuth.removeTokens({ lastAuthUser: externalProviderUserId })
      this.cognitoAuth.setTokens(result)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  setRequestPhoneNumberVerifyModal({ commit }, { isShow, requestType }) {
    commit(types.SET_REQUEST_PHONE_NUMBER_VERIFY_MODAL, { isShow, requestType })
  },
  setRequestPhoneNumberVerifyInputPhoneNumberModal({ commit }, { isShow }) {
    commit(types.SET_REQUEST_PHONE_NUMBER_VERIFY_INPUT_PHONE_NUMBER_MODAL, { isShow })
  },
  setRequestPhoneNumberVerifyInputPhoneNumberPhoneNumber({ commit }, { phoneNumber }) {
    commit(types.SET_REQUEST_PHONE_NUMBER_VERIFY_INPUT_PHONE_NUMBER_PHONE_NUMBER, { phoneNumber })
  },
  showRequestPhoneNumberVerifyInputPhoneNumberError({ commit }, { type }) {
    commit(types.SHOW_REQUEST_PHONE_NUMBER_VERIFY_INPUT_PHONE_NUMBER_ERROR, { type })
  },
  hideRequestPhoneNumberVerifyInputPhoneNumberError({ commit }, { type }) {
    commit(types.HIDE_REQUEST_PHONE_NUMBER_VERIFY_INPUT_PHONE_NUMBER_ERROR, { type })
  },
  setRequestPhoneNumberVerifyInputAuthCodeModal({ commit }, { isShow }) {
    commit(types.SET_REQUEST_PHONE_NUMBER_VERIFY_INPUT_AUTH_CODE_MODAL, { isShow })
  },
  setRequestPhoneNumberVerifyInputAuthCodeAuthCode({ commit }, { authCode }) {
    commit(types.SET_REQUEST_PHONE_NUMBER_VERIFY_INPUT_AUTH_CODE_AUTH_CODE, { authCode })
  },
  showRequestPhoneNumberVerifyInputAuthCodeError({ commit }, { type }) {
    commit(types.SHOW_REQUEST_PHONE_NUMBER_VERIFY_INPUT_AUTH_CODE_ERROR, { type })
  },
  hideRequestPhoneNumberVerifyInputAuthCodeError({ commit }, { type }) {
    commit(types.HIDE_REQUEST_PHONE_NUMBER_VERIFY_INPUT_AUTH_CODE_ERROR, { type })
  },
  async getLineLoginAuthorizeURL() {
    try {
      const { callback_url: callbackUrl } = await this.$axios.$get('/login/line/authorization_url')
      return callbackUrl
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getTwitterLoginAuthorizeURL() {
    try {
      const { url } = await this.$axios.$get('/login/twitter/authorization_url')
      return url
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async checkAuthByTwitter({ commit, dispatch }, { oauthToken, oauthVerifier }) {
    dispatch('initCognitoAuth')

    const result = await this.$axios.$post('/login/twitter', {
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier
    })
    this.cognitoAuth.setTokens(result)

    const hasUserId = result.has_user_id
    const status = result.status

    return { hasUserId, status }
  },
  async getLineSignUpAuthorizeURL() {
    try {
      const { callback_url: callbackUrl } = await this.$axios.$get(
        '/sign_up/line/authorization_url'
      )
      return callbackUrl
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getTwitterSignUpAuthorizeURL() {
    try {
      const { url } = await this.$axios.$get('/login/twitter/authorization_url')
      return url
    } catch (error) {
      return Promise.reject(error)
    }
  },
  setSignUpAuthFlowCompletedPhoneNumberAuthModal({ commit }, { isShow }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_COMPLETED_PHONE_NUMBER_AUTH_MODAL, { isShow })
  },
  setSignUpAuthFlowNotCompletedPhoneNumberAuthModal({ commit }, { isShow }) {
    commit(types.SET_SIGN_UP_AUTH_FLOW_NOT_COMPLETED_PHONE_NUMBER_AUTH_MODAL, { isShow })
  },
  async getDistributedTokens({ commit }) {
    try {
      let distributedTokens = {}
      const result = await this.$axios.$get('/me/wallet/distributed_tokens')
      const formatNumber = 10 ** 18
      Object.keys(result).forEach((key) => {
        distributedTokens[key] = new BigNumber(result[key], 10)
          .div(formatNumber)
          .toFixed(3, 1)
          .toString(10)
      })
      commit(types.SET_DISTRIBUTED_TOKENS, { distributedTokens })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  setFirstProcessModal({ commit }, { isShow }) {
    commit(types.SET_FIRST_PROCESS_MODAL, { isShow })
  },
  setFirstProcessLikedArticleModal({ commit }, { isShow }) {
    commit(types.SET_FIRST_PROCESS_LIKED_ARTICLE_MODAL, { isShow })
  },
  async putFirstProcessLikedArticle({ commit, state }) {
    try {
      await this.$axios.$put('/me/info/first_experiences', {
        user_first_experience: 'is_liked_article'
      })
      const currentUserInfo = { ...state.currentUserInfo, is_liked_article: true }
      commit(types.SET_CURRENT_USER_INFO, { currentUserInfo })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  setFirstProcessTippedArticleModal({ commit }, { isShow }) {
    commit(types.SET_FIRST_PROCESS_TIPPED_ARTICLE_MODAL, { isShow })
  },
  async putFirstProcessTippedArticle({ commit, state }) {
    try {
      await this.$axios.$put('/me/info/first_experiences', {
        user_first_experience: 'is_tipped_article'
      })
      const currentUserInfo = { ...state.currentUserInfo, is_tipped_article: true }
      commit(types.SET_CURRENT_USER_INFO, { currentUserInfo })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  setFirstProcessGotTokeneModal({ commit }, { isShow }) {
    commit(types.SET_FIRST_PROCESS_GOT_TOKEN_MODAL, { isShow })
  },
  async putFirstProcessGotToken({ commit, state }) {
    try {
      await this.$axios.$put('/me/info/first_experiences', {
        user_first_experience: 'is_got_token'
      })
      const currentUserInfo = { ...state.currentUserInfo, is_got_token: true }
      commit(types.SET_CURRENT_USER_INFO, { currentUserInfo })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  setFirstProcessCreatedArticleModal({ commit }, { isShow }) {
    commit(types.SET_FIRST_PROCESS_CREATED_ARTICLE_MODAL, { isShow })
  },
  async putFirstProcessCreatedArticle({ commit, state }) {
    try {
      await this.$axios.$put('/me/info/first_experiences', {
        user_first_experience: 'is_created_article'
      })
      const currentUserInfo = { ...state.currentUserInfo, is_created_article: true }
      commit(types.SET_CURRENT_USER_INFO, { currentUserInfo })
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
    Object.keys(formError).forEach((key) => {
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
  [types.SET_SIGN_UP_AUTH_FLOW_INPUT_PHONE_NUMBER_MODAL](
    state,
    { isSignUpAuthFlowInputPhoneNumberModal }
  ) {
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
  [types.SET_SIGN_UP_AUTH_FLOW_INPUT_AUTH_CODE_MODAL](
    state,
    { isSignUpAuthFlowInputAuthCodeModal }
  ) {
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
    Object.keys(formError).forEach((key) => {
      formError[key] = false
    })
  },
  [types.SET_SIGN_UP_AUTH_FLOW_PROFILE_SETTINGS_MODAL](
    state,
    { isSignUpAuthFlowProfileSettingsModal }
  ) {
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
  [types.SET_CURRENT_USER](state, { user }) {
    state.currentUser = user
  },
  [types.SET_PROFILE_SETTINGS_MODAL](state, { showProfileSettingsModal }) {
    state.showProfileSettingsModal = showProfileSettingsModal
  },
  [types.HIDE_PROFILE_SETTINGS_ERRORS]({ profileSettingsModal: { formError } }) {
    Object.keys(formError).forEach((key) => {
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
  [types.SET_REQUEST_LOGIN_MODAL](state, { isShow, requestType }) {
    state.requestLoginModal.isShow = isShow
    state.requestLoginModal.requestType = requestType
  },
  [types.SET_USERS_ALIS_TOKEN](state, { alisToken }) {
    state.alisToken = alisToken
  },
  [types.SET_NOTIFICATIONS](state, { notifications }) {
    state.notifications.push(...notifications)
  },
  [types.SET_NOTIFICATIONS_LAST_EVALUATED_KEY](state, { lastEvaluatedKey }) {
    state.notificationsLastEvaluatedKey = lastEvaluatedKey
  },
  [types.SET_UNREAD_NOTIFICATION](state, { unread }) {
    state.unreadNotification = unread
  },
  [types.SET_SEARCH_USERS](state, { users }) {
    state.searchUsers.users.push(...users)
  },
  [types.SET_SEARCH_USERS_IS_LAST_PAGE](state, { isLastPage }) {
    state.searchUsers.isLastPage = isLastPage
  },
  [types.SET_SEARCH_USERS_PAGE](state, { page }) {
    state.searchUsers.page = page
  },
  [types.RESET_SEARCH_USERS](state) {
    state.searchUsers.users = []
  },
  [types.RESET_SEARCH_USERS_PAGE](state) {
    state.searchUsers.page = 1
  },
  [types.SET_SEARCH_USERS_IS_FETCHING](state, { isFetching }) {
    state.searchUsers.isFetching = isFetching
  },
  [types.RESET_SEARCH_USERS_IS_LAST_PAGE](state) {
    state.searchUsers.isLastPage = false
  },
  [types.SET_TIP_MODAL](state, { showTipModal }) {
    state.showTipModal = showTipModal
  },
  [types.SET_TIP_FLOW_SELECT_TIP_AMOUNT_MODAL](state, { isShow }) {
    state.tipFlowModal.isSelectTipAmountModal = isShow
  },
  [types.SET_TIP_FLOW_CONFIRMATION_MODAL](state, { isShow }) {
    state.tipFlowModal.isConfirmationModal = isShow
  },
  [types.HIDE_TIP_FLOW_MODAL_CONTENT](state) {
    state.tipFlowModal.isSelectTipAmountModal = false
    state.tipFlowModal.isConfirmationModal = false
    state.tipFlowModal.isCompletedModal = false
  },
  [types.SET_TIP_TOKEN_AMOUNT](state, { tipTokenAmount }) {
    state.tipTokenAmount = tipTokenAmount
  },
  [types.SET_TIP_FLOW_COMPLETED_MODAL](state, { isShow }) {
    state.tipFlowModal.isCompletedModal = isShow
  },
  [types.RESET_NOTIFICATION_DATA](state) {
    state.notifications = []
    state.notificationsLastEvaluatedKey = {}
  },
  [types.SET_SIGN_UP_AUTH_FLOW_INPUT_USER_ID_MODAL](state, { isShow }) {
    state.signUpAuthFlowModal.isInputUserIdModal = isShow
  },
  [types.SET_SIGN_UP_AUTH_FLOW_USER_ID](state, { userId }) {
    state.signUpAuthFlowModal.inputUserId.formData.userId = userId
  },
  [types.SHOW_SIGN_UP_AUTH_FLOW_INPUT_USER_ID_ERROR](state, { type }) {
    state.signUpAuthFlowModal.inputUserId.formError[type] = true
  },
  [types.HIDE_SIGN_UP_AUTH_FLOW_INPUT_USER_ID_ERROR](state, { type }) {
    state.signUpAuthFlowModal.inputUserId.formError[type] = false
  },
  [types.SET_REQUEST_PHONE_NUMBER_VERIFY_MODAL](state, { isShow, requestType }) {
    state.requestPhoneNumberVerifyModal.isShow = isShow
    state.requestPhoneNumberVerifyModal.requestType = requestType
  },
  [types.SET_REQUEST_PHONE_NUMBER_VERIFY_INPUT_PHONE_NUMBER_MODAL](state, { isShow }) {
    state.requestPhoneNumberVerifyModal.isInputPhoneNumberModal = isShow
  },
  [types.SET_REQUEST_PHONE_NUMBER_VERIFY_INPUT_PHONE_NUMBER_PHONE_NUMBER](state, { phoneNumber }) {
    state.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.phoneNumber = phoneNumber
  },
  [types.SHOW_REQUEST_PHONE_NUMBER_VERIFY_INPUT_PHONE_NUMBER_ERROR](state, { type }) {
    state.requestPhoneNumberVerifyModal.inputPhoneNumber.formError[type] = true
  },
  [types.HIDE_REQUEST_PHONE_NUMBER_VERIFY_INPUT_PHONE_NUMBER_ERROR](state, { type }) {
    state.requestPhoneNumberVerifyModal.inputPhoneNumber.formError[type] = false
  },
  [types.SET_REQUEST_PHONE_NUMBER_VERIFY_INPUT_AUTH_CODE_MODAL](state, { isShow }) {
    state.requestPhoneNumberVerifyModal.isInputAuthCodeModal = isShow
  },
  [types.SET_REQUEST_PHONE_NUMBER_VERIFY_INPUT_AUTH_CODE_AUTH_CODE](state, { authCode }) {
    state.requestPhoneNumberVerifyModal.inputAuthCode.formData.authCode = authCode
  },
  [types.SHOW_REQUEST_PHONE_NUMBER_VERIFY_INPUT_AUTH_CODE_ERROR](state, { type }) {
    state.requestPhoneNumberVerifyModal.inputAuthCode.formError[type] = true
  },
  [types.HIDE_REQUEST_PHONE_NUMBER_VERIFY_INPUT_AUTH_CODE_ERROR](state, { type }) {
    state.requestPhoneNumberVerifyModal.inputAuthCode.formError[type] = false
  },
  [types.SET_SIGN_UP_AUTH_FLOW_COMPLETED_PHONE_NUMBER_AUTH_MODAL](state, { isShow }) {
    state.signUpAuthFlowModal.isCompletedPhoneNumberAuthModal = isShow
  },
  [types.SET_SIGN_UP_AUTH_FLOW_NOT_COMPLETED_PHONE_NUMBER_AUTH_MODAL](state, { isShow }) {
    state.signUpAuthFlowModal.isNotCompletedPhoneNumberAuthModal = isShow
  },
  [types.SET_DISTRIBUTED_TOKENS](state, { distributedTokens }) {
    state.distributedTokens = distributedTokens
  },
  [types.SET_FIRST_PROCESS_MODAL](state, { isShow }) {
    state.firstProcessModal.isShow = isShow
  },
  [types.SET_FIRST_PROCESS_LIKED_ARTICLE_MODAL](state, { isShow }) {
    state.firstProcessModal.isLikedArticleModal = isShow
  },
  [types.SET_FIRST_PROCESS_TIPPED_ARTICLE_MODAL](state, { isShow }) {
    state.firstProcessModal.isTippedArticleModal = isShow
  },
  [types.SET_FIRST_PROCESS_GOT_TOKEN_MODAL](state, { isShow }) {
    state.firstProcessModal.isGotTokenModal = isShow
  },
  [types.SET_FIRST_PROCESS_CREATED_ARTICLE_MODAL](state, { isShow }) {
    state.firstProcessModal.isCreatedArticleModal = isShow
  },
  [types.SET_IS_FETCHING_USER_ARTICLES](state, { isFetching }) {
    state.isFetchingUserArticles = isFetching
  },
  [types.SET_USER_ARTICLES_CURRENT_USER_ID](state, { userId }) {
    state.userArticlesCurrentUserId = userId
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
