import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  status: ''
})

const getters = {
  status: (state) => state.status
}

const mutations = {
  [types.SET_STATUS](state, { status }) {
    state.status = status
  }
}

export default {
  namespaced,
  state,
  getters,
  mutations
}
