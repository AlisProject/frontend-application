import { createContractObject } from '~/utils/web3'

import * as types from '../mutation-types'

const namespaced = true

const abi =
  '[{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"badgeTypeSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]'

const TYPE_ID_OFFSET = 100000000

const state = () => ({
  isLoading: true,
  badgeContractAddress: '',
  badges: [], // バッジ一覧
  walletAddress: '', // ウォレットアドレス
  badgeDescriptionModal: {
    isShow: false,
    tokenId: 0,
    badgeTypeSupply: 0,
    badgeContractAddress: '',
    metadata: {}
  }
})

const getters = {
  // バッジ一覧を取得
  badges: (state) => {
    return state.badges
  },
  // ウォレットアドレスを取得
  walletAddress: (state) => {
    return state.walletAddress
  },
  badgeDescriptionModal: (state) => {
    return state.badgeDescriptionModal
  }
}

const actions = {
  // バッジ一覧を取得する
  async fetchBadges({ commit }, { walletAddress }) {
    // バッジコントラクトのアドレスは動的に取得する
    const response = await this.$axios.$get(
      `${process.env.WEB3_SERVICE_BASE_URL}/api/badge/eth_address`
    )
    const badgeContract = createContractObject(JSON.parse(abi), response.badge_contract_address)
    // 所有するトークンの総数を取得
    const balanceOf = await badgeContract.methods.balanceOf(walletAddress).call()

    // 並列処理で所有するバッジの情報を取得
    const promises = []
    for (let i = 0; i < balanceOf; i++) {
      const promise = new Promise(async (resolve, reject) => {
        try {
          // トークンIDを取得
          const tokenId = await badgeContract.methods.tokenOfOwnerByIndex(walletAddress, i).call()

          // トークンのメタデータURIを取得
          const tokenUri = await badgeContract.methods.tokenURI(tokenId).call()

          // メタデータを取得
          const metadata = await this.$axios.$get(tokenUri)

          // バッジ情報を返す
          const badge = {
            tokenId: tokenId,
            metadata: metadata
          }
          resolve(badge)
        } catch (error) {
          reject(error)
        }
      })
      promises.push(promise)
    }
    const badges = await Promise.all(promises)

    // バッジ一覧をtokenIdでソート
    badges.sort(function(a, b) {
      return a.tokenId - b.tokenId
    })
    commit(types.SET_BADGES, {
      badges
    })
  },
  // ウォレットのアドレスを取得する
  async fetchWalletAddress({ commit }, { userId }) {
    const response = await this.$axios.$get(
      `${process.env.WEB3_SERVICE_BASE_URL}/api/users/${userId}/eth_address`
    )
    commit(types.SET_BADGES_WALLET_ADDRESS, {
      walletAddress: response.public_chain_address
    })
  },
  // ウォレットのアドレスを登録する
  async registerWalletAddress({ commit }, { signature }) {
    const response = await this.$axios.$post(
      `${process.env.WEB3_SERVICE_BASE_URL}/api/me/eth_address`,
      {
        signature
      }
    )
    commit(types.SET_BADGES_WALLET_ADDRESS, {
      walletAddress: response.public_chain_address
    })
  },
  // ウォレットのアドレス連携を解除する
  async unregisterWalletAddress({ commit }) {
    await this.$axios.$delete(`${process.env.WEB3_SERVICE_BASE_URL}/api/me/eth_address`)
    commit(types.SET_BADGES_WALLET_ADDRESS, {
      walletAddress: ''
    })
    commit(types.SET_BADGES, {
      badges: []
    })
  },
  // バッジの供給量を取得
  async fetchBadgeTypeSupply({ commit }, { tokenId }) {
    // バッジコントラクトのアドレスは動的に取得する
    const response = await this.$axios.$get(
      `${process.env.WEB3_SERVICE_BASE_URL}/api/badge/eth_address`
    )
    const badgeContractAddress = response.badge_contract_address
    const badgeContract = createContractObject(JSON.parse(abi), badgeContractAddress)
    // tokenId から typeId を取得
    const typeId = Math.floor(tokenId / TYPE_ID_OFFSET)
    const badgeTypeSupply = await badgeContract.methods.badgeTypeSupply(typeId).call()
    commit(types.SET_BADGE_TYPE_SUPPLY, {
      badgeTypeSupply,
      badgeContractAddress
    })
  },
  setBadgeDescriptionModal({ commit }, { isShow, tokenId, metadata }) {
    commit(types.SET_BADGE_DESCRIPTION_MODAL, { isShow, tokenId, metadata })
  },
  setIsLoading({ commit }, { isLoading }) {
    commit(types.SET_BADGE_DESCRIPTION_MODAL, { isLoading })
  },
  async removeBadgeInfo({ commit }) {
    commit(types.SET_BADGES_WALLET_ADDRESS, {
      walletAddress: ''
    })
    commit(types.SET_BADGES, {
      badges: []
    })
  }
}

const mutations = {
  [types.SET_BADGES](state, { badges }) {
    state.badges = badges
  },
  [types.SET_BADGES_WALLET_ADDRESS](state, { walletAddress }) {
    state.walletAddress = walletAddress
  },
  [types.SET_BADGE_DESCRIPTION_MODAL](state, { isShow, tokenId, metadata }) {
    state.badgeDescriptionModal.isShow = isShow
    state.badgeDescriptionModal.tokenId = tokenId
    state.badgeDescriptionModal.metadata = metadata
  },
  [types.SET_BADGE_TYPE_SUPPLY](state, { badgeTypeSupply, badgeContractAddress }) {
    state.badgeDescriptionModal.badgeTypeSupply = badgeTypeSupply
    state.badgeDescriptionModal.badgeContractAddress = badgeContractAddress
  },
  [types.SET_BADGES_WALLET_ADDRESS](state, { walletAddress }) {
    state.walletAddress = walletAddress
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
