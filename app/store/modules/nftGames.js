import * as types from '../mutation-types'

const namespaced = true

const state = () => ({
  nftGamesRanking: {
    rankingInfo: [],
    isFetching: false
  },
  nftGameInfo: {
    gameInfo: {},
    isFetching: false
  }
})

const getters = {
  nftGamesRankingInfo: (state) => state.nftGamesRanking.rankingInfo,
  nftGameInfo: (state) => state.nftGameInfo.gameInfo
}

const actions = {

  async getNftGameInfo({ commit, state }, { tag }) {
    try {
      if (state.nftGameInfo.isFetching) return
      commit(types.SET_NFT_GAME_INFO_IS_FETCHING, { isFetching: true })
      const gameInfo = await this.$axios.$get('/api/topics/game/nft_games', { params: { tag } })
      commit(types.SET_NFT_GAME_INFO, { gameInfo })
    } catch (error) {
      return Promise.reject(error)
    } finally {
      commit(types.SET_NFT_GAME_INFO_IS_FETCHING, { isFetching: false })
    }
  },
  async getNftGamesRanking({ commit, state }) {
    try {
      if (state.nftGamesRanking.isFetching) return
      commit(types.SET_NFT_GAMES_RANKING_IS_FETCHING, { isFetching: true })
      const ranking = await this.$axios.$get('/api/topics/game/nft_games/ranking')
      commit(types.SET_NFT_GAMES_RANKING, { ranking })
    } catch (error) {
      return Promise.reject(error)
    } finally {
      commit(types.SET_NFT_GAMES_RANKING_IS_FETCHING, { isFetching: false })
    }
  }
}

const mutations = {
  [types.SET_NFT_GAME_INFO](state, { gameInfo }) {
    state.nftGameInfo.gameInfo = gameInfo
  },
  [types.SET_NFT_GAME_INFO_IS_FETCHING](state, { isFetching }) {
    state.nftGameInfo.isFetching = isFetching
  },
  [types.SET_NFT_GAMES_RANKING](state, { ranking }) {
    state.nftGamesRanking.rankingInfo = ranking
  },
  [types.SET_NFT_GAMES_RANKING_IS_FETCHING](state, { isFetching }) {
    state.nftGamesRanking.isFetching = isFetching
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
