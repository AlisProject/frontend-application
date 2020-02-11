<template>
  <div class="withdrawal-details-container">
    <app-header />
    <wallet-nav selected="history" />
    <div class="area-history">
      <div v-if="hasWithdrawalDetails" class="history">
        <p class="description">
          入出金履歴では直近の入金と出金の履歴をご覧いただけます
        </p>
        <div class="withdrawal-details">
          <the-loader :isLoading="isLoading" />
          <div
            v-for="(withdrawalDetail, i) in withdrawalDetails"
            :key="withdrawalDetail.txHash"
            class="withdrawal-detail"
            @click="showWithdrawalDetailModal(i)"
          >
            <div class="timestamp">
              {{ withdrawalDetail.timestamp | formatDateWithTime }}
            </div>
            <div class="payment-type">
              {{ withdrawalDetail.isDeposit | showPaymentType
              }}{{ withdrawalDetail.finished | showProcessType }}
            </div>
            <div class="amount" :class="{ 'is-deposit': withdrawalDetail.isDeposit }">
              <template v-if="withdrawalDetail.isDeposit">
                +{{ withdrawalDetail.amount | showFormattedAmount }}
              </template>
              <template v-else>
                -{{ withdrawalDetail.amount | addFee(withdrawalDetail.fee) | showFormattedAmount }}
              </template>
            </div>
            <div class="unit">
              ALIS
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-withdrawal-details">
        直近の入出金履歴はありません
      </div>
    </div>
    <app-footer />
  </div>
</template>

<script>
/* global Web3 */
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { BigNumber } from 'bignumber.js'
import AppHeader from '../organisms/AppHeader'
import WalletNav from '../organisms/WalletNav'
import AppFooter from '../organisms/AppFooter'
import TheLoader from '../atoms/TheLoader'
import { formatDateWithTime } from '~/utils/format'
import { showPaymentType, showProcessType, showFormattedAmount } from '~/utils/wallet'

const HISTORY_DAYS = 30
const PUBLIC_CHAIN_AVERAGE_BLOCK_TIME = 13

export default {
  components: {
    AppHeader,
    WalletNav,
    AppFooter,
    TheLoader
  },
  data() {
    return {
      timestamp: null,
      relayEvents: null,
      applyRelayEvents: null,
      hasWithdrawalDetails: true,
      isLoading: true
    }
  },
  async mounted() {
    try {
      // 未ログインユーザーにはログインを促すモーダルを表示するため後続の処理を行わない
      if (!this.loggedIn) return
      const isMetaMaskInstalled = this.checkIsMetaMaskInstalled()
      if (isMetaMaskInstalled) window.web3 = new Web3(window.ethereum)
      // すでに入出金履歴を取得している場合はローディングアイコンを表示しない
      if (this.withdrawalDetails.length > 0) this.isLoading = false
      const { privateEthAddress } = this.currentUser
      const result = await this.getTokenHistories()
      this.timestamp = result.timestamp
      this.relayEvents = result.relay_events
      this.applyRelayEvents = result.apply_relay_events
      const [depositHistory, withdrawHistory] = await Promise.all([
        this.getDepositHistory(privateEthAddress),
        this.getWithdrawHistory(privateEthAddress)
      ])
      const withdrawalDetails = [...depositHistory, ...withdrawHistory]
      this.setWithdrawalDetails({ withdrawalDetails })
      this.hasWithdrawalDetails = withdrawalDetails.length > 0
    } catch (error) {
      this.sendNotification({
        text: 'エラーが発生しました。しばらく時間を置いて再度お試しください',
        type: 'warning'
      })
    } finally {
      this.isLoading = false
    }
  },
  computed: {
    ...mapGetters('user', ['loggedIn', 'currentUser', 'withdrawalDetails'])
  },
  methods: {
    checkIsMetaMaskInstalled() {
      return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
    },
    async getDepositHistory(privateChainUserAddress) {
      let web3js = window.web3
      if (!web3js) {
        web3js = new Web3(new Web3.providers.HttpProvider(process.env.PUBLIC_CHAIN_OPERATION_URL))
      }
      // パブリックチェーン側のRelayイベントを取得
      const relayBlockDiff = Math.ceil(
        (HISTORY_DAYS * 24 * 60 * 60) / PUBLIC_CHAIN_AVERAGE_BLOCK_TIME
      )
      const relayBlockNum = await web3js.eth.getBlockNumber()
      const relayFromBlockNum = relayBlockNum - relayBlockDiff
      const relayEvents = await web3js.eth.getPastLogs({
        topics: [
          web3js.utils.sha3('Relay(address,address,uint256,uint256,uint256)'),
          null,
          '0x' + '0'.repeat(24) + privateChainUserAddress.slice(2, 42).toLowerCase()
        ],
        address: process.env.PUBLIC_CHAIN_BRIDGE_ADDRESS,
        fromBlock: '0x' + Math.max(relayFromBlockNum, 1).toString(16),
        toBlock: 'latest'
      })

      // API経由でプライベートチェーン側のApplyRelayイベントとタイムスタンプを取得
      const applyRelayEvents = this.applyRelayEvents
      const applyRelayTimestamp = this.timestamp

      return this._createHistory(relayEvents, applyRelayEvents, applyRelayTimestamp, true)
    },
    async getWithdrawHistory(privateChainUserAddress) {
      let web3js = window.web3
      if (!web3js) {
        web3js = new Web3(new Web3.providers.HttpProvider(process.env.PUBLIC_CHAIN_OPERATION_URL))
      }
      // API経由でプライベートチェーン側のRelayイベントを取得
      const relayEvents = this.relayEvents

      // パブリックチェーン側のApplyRelayイベントの取得
      const applyRelayBlockDiff = Math.ceil(
        (HISTORY_DAYS * 24 * 60 * 60) / PUBLIC_CHAIN_AVERAGE_BLOCK_TIME
      )
      const applyRelayBlockNum = await web3js.eth.getBlockNumber()
      const applyRelayFromBlockNum = applyRelayBlockNum - applyRelayBlockDiff
      const applyRelayEvents = await web3js.eth.getPastLogs({
        topics: [
          web3js.utils.sha3('ApplyRelay(address,address,uint256,bytes32)'),
          '0x' + '0'.repeat(24) + privateChainUserAddress.slice(2, 42).toLowerCase()
        ],
        address: process.env.PUBLIC_CHAIN_BRIDGE_ADDRESS,
        fromBlock: '0x' + Math.max(applyRelayFromBlockNum, 1).toString(16),
        toBlock: 'latest'
      })
      const applyRelayFromBlock = await web3js.eth.getBlock(applyRelayFromBlockNum)

      return this._createHistory(
        relayEvents,
        applyRelayEvents,
        applyRelayFromBlock.timestamp,
        false
      )
    },
    _createHistory(relayEvents, applyRelayEvents, applyRelayTimestamp, isDeposit) {
      // 完了済みのRelayトランザクションのハッシュ値をセットに保持
      const completedRelayTxHashs = new Set()
      for (const applyRelayEvent of applyRelayEvents) {
        const parsedApplyRelayEvent = this._parseApplyRelayEvent(applyRelayEvent)
        completedRelayTxHashs.add(parsedApplyRelayEvent.relayTxHash)
      }

      // 履歴の生成
      const history = []
      for (const relayEvent of relayEvents) {
        const parsedRelayEvent = this._parseRelayEvent(relayEvent)

        // ApplyRelayイベントを取得した開始ブロックの日時より古いRelayイベントは無視する
        if (parsedRelayEvent.timestamp < applyRelayTimestamp) {
          continue
        }

        const finished = completedRelayTxHashs.has(parsedRelayEvent.txHash)

        history.push({ ...parsedRelayEvent, finished, isDeposit })
      }

      return history
    },
    _parseRelayEvent(relayEvent) {
      return {
        sender: '0x' + relayEvent.topics[1].slice(-40),
        recipient: '0x' + relayEvent.topics[2].slice(-40),
        amount: parseInt(relayEvent.data.slice(2, 66), 16),
        fee: parseInt(relayEvent.data.slice(66, 130), 16),
        timestamp: parseInt(relayEvent.data.slice(130, 194), 16),
        txHash: relayEvent.transactionHash
      }
    },
    _parseApplyRelayEvent(applyRelayEvent) {
      return {
        relayTxHash: '0x' + applyRelayEvent.data.slice(66, 66 + 64)
      }
    },
    showWithdrawalDetailModal(index) {
      this.setWithdrawalDetailModal({ isShow: true, index })
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', ['setWithdrawalDetails', 'setWithdrawalDetailModal', 'getTokenHistories'])
  },
  filters: {
    formatDateWithTime,
    showPaymentType,
    showProcessType,
    showFormattedAmount,
    addFee(amount, fee) {
      return new BigNumber(amount).plus(new BigNumber(fee))
    }
  }
}
</script>

<style lang="scss" scoped>
.withdrawal-details-container {
  display: grid;
  grid-row-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header app-header"
    "...        nav        ...       "
    "...        history    ...       "
    "app-footer app-footer app-footer";
  grid-template-columns: minmax(0, 1fr) 400px minmax(0, 1fr);
  grid-template-rows: 100px 22px auto 75px;
  min-height: 100vh;
}

.area-history {
  grid-area: history;
}

.history {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.description {
  color: #000;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.8px;
  text-align: center;
  margin: 0 0 40px;
}

.withdrawal-detail {
  height: 56px;
  width: 400px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);
  margin-bottom: 8px;
  position: relative;
  cursor: pointer;

  .timestamp,
  .payment-type,
  .amount,
  .unit {
    position: absolute;
  }

  .timestamp {
    top: 8px;
    left: 12px;
    color: #6e6e6e;
    font-size: 14px;
    font-weight: 500;
  }

  .payment-type {
    bottom: 8px;
    left: 12px;
    color: #000;
    font-size: 14px;
    font-weight: 500;
  }

  .amount {
    bottom: 8px;
    right: 38px;
    color: #f06273;
    font-size: 14px;
    font-weight: bold;

    &.is-deposit {
      color: #0086cc;
    }
  }

  .unit {
    bottom: 10px;
    right: 12px;
    color: #6e6e6e;
    font-size: 10px;
    font-weight: 500;
  }
}

.no-withdrawal-details {
  color: #030303;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-top: 50px;
}
</style>
