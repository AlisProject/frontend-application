import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  loggedIn: false,
  showSignUpModal: false
})

const getters = {
  showSignUpModal: (state) => state.showSignUpModal
}

const actions = {
  setSignUpModal({ commit }, { showSignUpModal }) {
    commit(types.SET_SIGN_UP_MODAL, { showSignUpModal })
  }
}

const mutations = {
  [types.SET_SIGN_UP_MODAL](state, { showSignUpModal }) {
    state.showSignUpModal = showSignUpModal
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
