import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  searchTags: {
    tags: [],
    page: 1,
    isFetching: false
  }
})

const getters = {
  searchTags: (state) => state.searchTags
}

const actions = {
  async getSearchTags({ commit, state }, { query }) {
    try {
      if (state.searchTags.isFetching) return
      commit(types.SET_SEARCH_TAGS_IS_FETCHING, { isFetching: true })
      const limit = 5
      const tags = await this.$axios.$get('/api/search/tags', {
        params: { limit, query, page: state.searchTags.page }
      })
      commit(types.SET_SEARCH_TAGS, { tags })
    } catch (error) {
      return Promise.reject(error)
    } finally {
      commit(types.SET_SEARCH_TAGS_IS_FETCHING, { isFetching: false })
    }
  },
  resetSearchTags({ commit }) {
    commit(types.SET_SEARCH_TAGS, { tags: [] })
  }
}

const mutations = {
  [types.SET_SEARCH_TAGS](state, { tags }) {
    state.searchTags.tags = tags
  },
  [types.SET_SEARCH_TAGS_IS_FETCHING](state, { isFetching }) {
    state.searchTags.isFetching = isFetching
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
