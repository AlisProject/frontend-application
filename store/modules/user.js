import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  loggedIn: false,
  showSignUpModal: false,
  showSignUpAuthFlowModal: false,
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
    }
  }
})

const getters = {
  loggedIn: (state) => state.loggedIn,
  showSignUpModal: (state) => state.showSignUpModal,
  sentMail: (state) => state.sentMail,
  signUpModal: (state) => state.signUpModal,
  showSignUpAuthFlowModal: (state) => state.showSignUpAuthFlowModal,
  signUpAuthFlowModal: (state) => state.signUpAuthFlowModal
}

const actions = {
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
  }
}

const mutations = {
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
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
