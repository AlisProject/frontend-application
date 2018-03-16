const namespaced = true

const state = () => ({
  loggedIn: false
})

const getters = {
  loggedIn: (state) => state.loggedIn
}

const actions = {}

const mutations = {}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
