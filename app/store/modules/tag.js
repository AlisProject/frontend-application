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
  async getSearchTags({ commit, getters }, { query }) {
    if (getters.searchTags.isFetching) return
    commit(types.SET_SEARCH_TAGS_IS_FETCHING, { isFetching: true })
    const limit = 10
    const tags = [
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      'bbb',
      'ccc',
      'ラーメン',
      'aaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaabbbbbbbbbbbbbb'
    ]
    // const tags = await this.$axios.$get('/search/tags', {
    //   params: { limit, query, page: getters.searchTags.page }
    // })
    commit(types.SET_SEARCH_TAGS_IS_FETCHING, { isFetching: false })
    commit(types.SET_SEARCH_TAGS, { tags })
    commit(types.SET_SEARCH_TAGS_PAGE, { page: getters.searchTags.page + 1 })
    if (tags.length < limit) {
      commit(types.SET_SEARCH_TAGS_IS_LAST_PAGE, { isLastPage: true })
    }
  },
  resetSearchTags({ commit }) {
    commit(types.RESET_SEARCH_TAGS)
  },
  resetSearchTagsPage({ commit }) {
    commit(types.SET_SEARCH_TAGS_PAGE, { page: 0 })
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
