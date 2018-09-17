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
    if (state.searchTags.isFetching) return
    commit(types.SET_SEARCH_TAGS_IS_FETCHING, { isFetching: true })
    const limit = 10
    const tags = await this.$axios.$get('/search/tags', {
      params: { limit, query, page: state.searchTags.page }
    })
    commit(types.SET_SEARCH_TAGS_IS_FETCHING, { isFetching: false })
    commit(types.SET_SEARCH_TAGS, { tags: tags.map((tag) => tag.name) })
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
