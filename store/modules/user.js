import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  loggedIn: false,
  showSignUpModal: false,
  sentMail: false,
  signUp: {
    userId: '',
    email: '',
    password: ''
  },
  signUpError: {
    userId: false,
    email: false,
    password: false
  }
})

const getters = {
  showSignUpModal: (state) => state.showSignUpModal,
  sentMail: (state) => state.sentMail,
  signUp: (state) => state.signUp,
  signUpError: (state) => state.signUpError
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
    state.signUp.userId = userId
  },
  [types.SET_SIGN_UP_EMAIL](state, { email }) {
    state.signUp.email = email
  },
  [types.SET_SIGN_UP_PASSWORD](state, { password }) {
    state.signUp.password = password
  },
  [types.SHOW_SIGN_UP_ERROR](state, { type }) {
    state.signUpError[type] = true
  },
  [types.HIDE_SIGN_UP_ERROR](state, { type }) {
    state.signUpError[type] = false
  },
  [types.HIDE_SIGN_UP_ERRORS]({ signUpError }) {
    Object.keys(signUpError).forEach(key => {
      signUpError[key] = false
    })
  }

}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
