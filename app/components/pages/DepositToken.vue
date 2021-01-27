<template>
  <div class="deposit-token-container">
    <app-header />
    <wallet-nav selected="deposit" />
    <div class="area-deposit">
      <the-loader v-if="isLoading" :isLoading="isLoading" />
      <template v-else>
        <div v-if="!isMetaMaskInstalled" class="request-install-metamask">
          <h2 class="title">
            入金にはMETAMASKのインストールが必要です
          </h2>
          <p class="description">
            現在ALISへ入金を行うにはトランザクションの生成が必要なためMETAMASKが必要となります。METAMASKを利用可能なブラウザにインストールしてから入金を行ってください。
          </p>
          <img src="~assets/images/pc/common/metamask-fox.svg" alt="METAMASK" class="metamask">
          <span class="metamask-tm">METAMASK<sup class="sup">TM</sup></span>
          <app-button>
            <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
              METAMASKをインストールする
            </a>
          </app-button>
        </div>
        <p v-if="isMetaMaskInstalled && !relayPaused && !isTargetNetwork" class="title">
          Ethereumメインネットワークのみご利用できます。MetaMaskの設定をご確認ください。
        </p>
        <div v-if="isMetaMaskInstalled && !relayPaused && isTargetNetwork" class="deposit-box">
          <h2 class="title">
            入金額を入力してください
          </h2>
          <div class="token-amount-input-box">
            <div class="label">
              入金額
            </div>
            <input
              :value="amount"
              class="token-amount-input"
              :class="{ error: errorMessage }"
              type="number"
              placeholder="1000"
              min="1"
              @input="onInput"
              @keydown.69.prevent
              @keydown.187.prevent
              @keydown.189.prevent
            >
            <span class="token-amount-input-unit">ALIS</span>
            <span class="error-message">
              {{ errorMessage }}
            </span>
          </div>
          <p class="description">
            入金はMETAMASKで処理が行われます
          </p>
          <app-button
            class="deposit-button"
            :disabled="!isDepositable || isProcessing"
            @click="handleClickDeposit"
          >
            入金する
          </app-button>
        </div>
        <div v-if="isMetaMaskInstalled && relayPaused" class="relay-paused-box">
          <h2 class="title">
            現在、入金の機能を一時的に停止しております
          </h2>
          <p class="description">
            入金機能の再開までしばらくお待ち下さい
          </p>
        </div>
      </template>
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
import TheLoader from '../atoms/TheLoader'
import AppButton from '../atoms/AppButton'
import AppFooter from '../organisms/AppFooter'
import { addDigitSeparator, isOverDecimalPoint } from '~/utils/wallet'

const formatNumber = 10 ** 18
const GAS = 150000

export default {
  components: {
    AppHeader,
    WalletNav,
    TheLoader,
    AppButton,
    AppFooter
  },
  data() {
    return {
      isLoading: true,
      isMetaMaskInstalled: true,
      isApprovedOfMetaMask: false,
      errorMessage: '',
      amount: null,
      bridgeInfo: null,
      relayPaused: false,
      isProcessing: false,
      networkType: 'main'
    }
  },
  async mounted() {
    // 未ログインユーザーにはログインを促すモーダルを表示するため後続の処理を行わない
    if (!this.loggedIn) return
    this.isMetaMaskInstalled = this.checkIsMetaMaskInstalled()
    if (this.isMetaMaskInstalled) {
      try {
        await this.initMetaMaskAndBridge()
        this.networkType = await window.web3.eth.net.getNetworkType()
      } catch (error) {
        console.error(error)
      }
    }
    this.isLoading = false
  },
  computed: {
    isTargetNetwork() {
      const targetNetworkType = this.isProduction ? 'main' : 'ropsten'
      return this.networkType === targetNetworkType
    },
    isProduction() {
      return process.env.ALIS_APP_ID === 'alis'
    },
    isDepositable() {
      return this.amount !== null && this.amount !== '' && this.errorMessage === ''
    },
    ...mapGetters('user', ['loggedIn', 'currentUser'])
  },
  methods: {
    checkIsMetaMaskInstalled() {
      return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
    },
    async initMetaMaskAndBridge() {
      await this.approveOfMetaMask()
        .then(() => (this.isApprovedOfMetaMask = true))
        .catch((e) => {
          this.sendNotification({
            text: 'MetaMaskの承認に失敗しました',
            type: 'warning'
          })
        })
      this.bridgeInfo = await this.getBridgeInformation().catch((e) =>
        this.sendNotification({
          text: 'エラーが発生しました。しばらく時間を置いて再度お試しください',
          type: 'warning'
        })
      )
      this.relayPaused = this.bridgeInfo.relayPaused
    },
    async approveOfMetaMask() {
      if (!this.isMetaMaskInstalled) {
        throw new Error('MetaMask is not installed.')
      }
      window.web3 = new Web3(window.ethereum)
      const accounts = await window.ethereum.enable()
      return accounts[0]
    },
    async getBridgeInformation() {
      try {
        let web3js = window.web3
        if (!web3js) {
          web3js = new Web3(new Web3.providers.HttpProvider(process.env.PUBLIC_CHAIN_OPERATION_URL))
        }
        const minSingleRelayAmountPromise = web3js.eth.call({
          to: process.env.PUBLIC_CHAIN_BRIDGE_ADDRESS,
          data: '0x9f29ffdf'
        })
        const maxSingleRelayAmountPromise = web3js.eth.call({
          to: process.env.PUBLIC_CHAIN_BRIDGE_ADDRESS,
          data: '0x34f89513'
        })
        const relayPausedPromise = web3js.eth.call({
          to: process.env.PUBLIC_CHAIN_BRIDGE_ADDRESS,
          data: '0x69a08a26'
        })
        const [minSingleRelayAmount, maxSingleRelayAmount, relayPaused] = await Promise.all([
          minSingleRelayAmountPromise,
          maxSingleRelayAmountPromise,
          relayPausedPromise
        ])
        return {
          minSingleRelayAmount,
          maxSingleRelayAmount,
          relayPaused: parseInt(relayPaused, 16) > 0
        }
      } catch (error) {
        console.error(error)
      }
    },
    async deposit(recipient, amount) {
      // 入金額
      let hexAmount = amount.toString(16)
      hexAmount = '0'.repeat(64 - hexAmount.length) + hexAmount

      // トランザクション一覧
      const transactions = []

      // MetaMaskで選択中のアカウント
      const account = window.ethereum.selectedAddress

      // allowanceの取得
      const allowance = await this._getAllowance(account)
      if (allowance < amount) {
        // approveの仕様上、allowanceが0以外でかつamountより小さい場合は、一度allowanceを0にセットする必要がある
        if (allowance !== 0) {
          transactions.push({
            // Approve
            method: 'eth_sendTransaction',
            params: [
              {
                from: account,
                to: process.env.PUBLIC_CHAIN_ALIS_TOKEN_ADDRESS,
                gas: '0x' + GAS.toString(16),
                data:
                  '0x095ea7b3' +
                  '0'.repeat(24) +
                  process.env.PUBLIC_CHAIN_BRIDGE_ADDRESS.slice(2) +
                  '0'.repeat(64)
              }
            ],
            from: account
          })
        }

        // 必要トークン数をApprove
        transactions.push({
          // Approve
          method: 'eth_sendTransaction',
          params: [
            {
              from: account,
              to: process.env.PUBLIC_CHAIN_ALIS_TOKEN_ADDRESS,
              gas: '0x' + GAS.toString(16),
              data:
                '0x095ea7b3' +
                '0'.repeat(24) +
                process.env.PUBLIC_CHAIN_BRIDGE_ADDRESS.slice(2) +
                hexAmount
            }
          ],
          from: account
        })
      }

      transactions.push({
        // Relay
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: process.env.PUBLIC_CHAIN_BRIDGE_ADDRESS,
            gas: '0x' + GAS.toString(16),
            data: '0xeeec0e24' + '0'.repeat(24) + recipient.slice(2) + hexAmount
          }
        ],
        from: account
      })

      // トランザクションの送信
      await this._sendTransactions(transactions)
    },
    async _getAllowance(account) {
      const amountHex = await window.web3.eth.call({
        to: process.env.PUBLIC_CHAIN_ALIS_TOKEN_ADDRESS,
        data:
          '0xdd62ed3e' +
          '0'.repeat(24) +
          account.slice(2) +
          '0'.repeat(24) +
          process.env.PUBLIC_CHAIN_BRIDGE_ADDRESS.slice(2)
      })

      return Number(amountHex)
    },
    async _sendTransactions(transactions) {
      for (const transaction of transactions) {
        await window.ethereum.request(transaction)
      }
    },
    onInput(event) {
      try {
        this.amount = event.target.value
        if (this.amount === '') {
          this.errorMessage = ''
          return
        }
        const formattedAmount = new BigNumber(this.amount)
        const isLessThanOrEqualToZero = formattedAmount.isLessThanOrEqualTo(0)
        if (isLessThanOrEqualToZero) {
          this.errorMessage = '入力内容を確認してください'
          return
        }
        // 小数点以下の桁数が3桁を超えているか確認
        const isNotInputablePlaceAfterDecimalPoint = isOverDecimalPoint(this.amount, 3)
        if (isNotInputablePlaceAfterDecimalPoint) {
          this.errorMessage = '小数点3桁までの範囲で入力してください'
          return
        }
        const formattedMaxSingleRelayAmount = new BigNumber(
          this.bridgeInfo.maxSingleRelayAmount,
          16
        ).div(formatNumber)
        const hasExceededMaxSingleRelayAmount = formattedAmount.isGreaterThan(
          formattedMaxSingleRelayAmount
        )
        const formattedMinSingleRelayAmount = new BigNumber(
          this.bridgeInfo.minSingleRelayAmount,
          16
        ).div(formatNumber)
        const isLessThanMinSingleRelayAmount = formattedAmount.isLessThan(
          formattedMinSingleRelayAmount
        )
        const maxSingleRelayAmountForUser = addDigitSeparator(
          formattedMaxSingleRelayAmount.toString()
        )
        if (hasExceededMaxSingleRelayAmount || isLessThanMinSingleRelayAmount) {
          this.errorMessage = `${maxSingleRelayAmountForUser}ALIS以内の有効な数値で入力してください`
          return
        }
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = '数値で入力してください'
      }
    },
    async handleClickDeposit() {
      try {
        if (!this.isApprovedOfMetaMask) await this.initMetaMaskAndBridge()
        if (this.isProcessing || this.errorMessage !== '') return
        this.isProcessing = true
        const amountWei = window.web3.utils.toBN(window.web3.utils.toWei(this.amount))
        const recipient = this.currentUser.privateEthAddress
        await this.deposit(recipient, amountWei)
        this.sendNotification({
          text: '入金のトランザクションを発行しました。詳細はMETAMASKでご確認ください'
        })
      } catch (error) {
        this.sendNotification({
          text: '入金のトランザクション発行に失敗しました',
          type: 'warning'
        })
      } finally {
        this.isProcessing = false
      }
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    })
  }
}
</script>

<style lang="scss" scoped>
.deposit-token-container {
  display: grid;
  grid-row-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header app-header"
    "...        nav        ...       "
    "...        deposit    ..."
    "app-footer app-footer app-footer";
  grid-template-columns: minmax(0, 1fr) 400px minmax(0, 1fr);
  grid-template-rows: 100px 22px auto 75px;
  min-height: 100vh;
}

.area-deposit {
  grid-area: deposit;
}

.request-install-metamask {
  display: flex;
  flex-direction: column;
  align-items: center;

  .metamask {
    width: 130px;
    margin: 10px 0 0;
  }

  .metamask-tm {
    color: #75787b;
    font-family: Helvetica;
    font-size: 16px;
    letter-spacing: 0.38px;
    margin-bottom: 30px;
    text-align: center;

    .sup {
      font-size: 10px;
      top: -0.8em;
    }
  }
}

.title {
  color: #030303;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.8px;
  line-height: 21px;
  text-align: center;
}

.description {
  color: #6e6e6e;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.8px;
  line-height: 1.5;
}

.deposit-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.token-amount-input-box {
  position: relative;

  .label {
    color: #030303;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.8px;
    margin: 30px 0 10px;
    width: 100%;
  }

  .token-amount-input {
    appearance: none;
    border: 0;
    box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);
    box-sizing: border-box;
    color: #030303;
    font-size: 14px;
    line-height: 28px;
    padding: 10px 40px 10px 12px;
    width: 400px;
    margin-bottom: 8px;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &::-webkit-input-placeholder {
      color: #cecece;
    }

    &:focus {
      outline: 0;
    }

    &.error {
      box-shadow: 0 0 8px 0 rgba(240, 98, 115, 0.5);
    }
  }

  .token-amount-input-unit {
    position: absolute;
    color: #030303;
    font-size: 10px;
    font-weight: bold;
    bottom: 52px;
    right: 10px;
  }

  .error-message {
    color: #f06273;
    display: block;
    font-size: 12px;
    margin-bottom: 2px;
    min-height: 26px;
    text-align: right;
    width: 100%;
  }
}

.deposit-button {
  margin-top: 44px;
}

.relay-paused-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
}
</style>
