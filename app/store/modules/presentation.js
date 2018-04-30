/* eslint-disable space-before-function-paren */
import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  topPageScroll: 0
})

const getters = {
  topPageScroll: (state) => state.topPageScroll
}

const actions = {
  setTopPageScroll({ commit }, { scroll }) {
    commit(types.SET_TOP_PAGE_SCROLL, { scroll })
  }
}

const mutations = {
  [types.SET_TOP_PAGE_SCROLL](state, { scroll }) {
    state.topPageScroll = scroll
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
