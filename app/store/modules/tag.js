import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  searchTags: {
    tags: [],
    page: 1,
    isLastPage: false,
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
    commit(types.SET_SEARCH_TAGS_PAGE, { page: state.searchTags.page + 1 })
    if (tags.length < limit) {
      commit(types.SET_SEARCH_TAGS_IS_LAST_PAGE, { isLastPage: true })
    }
  },
  resetSearchTags({ commit }) {
    commit(types.RESET_SEARCH_TAGS)
  },
  resetSearchTagsPage({ commit }) {
    commit(types.SET_SEARCH_TAGS_PAGE, { page: 1 })
  },
  resetSearchTagsIsLastPage({ commit }) {
    commit(types.SET_SEARCH_TAGS_IS_LAST_PAGE, { isLastPage: false })
  }
}

const mutations = {
  [types.SET_SEARCH_TAGS_IS_FETCHING](state, { isFetching }) {
    state.searchTags.isFetching = isFetching
  },
  [types.SET_SEARCH_TAGS](state, { tags }) {
    state.searchTags.tags = tags
  },
  [types.SET_SEARCH_TAGS_PAGE](state, { page }) {
    state.searchTags.page = page
  },
  [types.SET_SEARCH_TAGS_IS_LAST_PAGE](state, { isLastPage }) {
    state.searchTags.isLastPage = isLastPage
  },
  [types.RESET_SEARCH_TAGS](state) {
    state.searchTags.tags = []
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
