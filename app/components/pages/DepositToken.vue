<template>
  <div class="deposit-token-container">
    <app-header />
    <wallet-nav selected="deposit" />
    <div class="area-deposit">
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
      <div v-if="isMetaMaskInstalled && !relayPaused" class="deposit-box">
        <h2 class="title">
          入金額を入力してください
        </h2>
        <div class="token-amount-input-box">
          <div class="label">
            入金額
          </div>
          <input
            :value="balance"
            class="token-amount-input"
            type="number"
            min="1"
            max="10000"
            @input="onInput"
          >
          <span class="token-amount-input-unit">ALIS</span>
          <span class="error-message">
            {{ errorMessage }}
          </span>
        </div>
        <p class="description">
          入金はMETAMASKで処理が行われます
        </p>
        <app-button class="deposit-button" @click="handleClickDeposit">
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
    </div>
    <app-footer />
  </div>
</template>

<script>
import Web3 from 'web3'
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppHeader from '../organisms/AppHeader'
import WalletNav from '../organisms/WalletNav'
import AppButton from '../atoms/AppButton'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    WalletNav,
    AppButton,
    AppFooter
  },
  data() {
    return {
      isMetaMaskInstalled: false,
      isLoggedInToMetaMask: false,
      errorMessage: '',
      balance: null,
      bridgeInfo: null,
      relayPaused: false
    }
  },
  async mounted() {
    this.isMetaMaskInstalled = this.checkIsMetaMaskInstalled()
    if (this.isMetaMaskInstalled) await this.initMetaMaskAndBridge()
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
  },
  methods: {
    checkIsMetaMaskInstalled() {
      return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
    },
    async initMetaMaskAndBridge() {
      await this.loginToMetaMask().catch((e) => {
        this.sendNotification({
          text: 'MetaMaskのログインに失敗しました',
          type: 'warning'
        })
      })
      this.bridgeInfo = await this.getBridgeInformation().catch((e) =>
        this.sendNotification({
          text: 'ブリッジ情報の取得に失敗しました',
          type: 'warning'
        })
      )
      this.relayPaused = this.bridgeInfo.relayPaused
    },
    async loginToMetaMask() {
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
          web3js = new Web3(new Web3.providers.HttpProvider(process.env.PUBLIC_CHAIN_END_POINT))
        }
        const data = await web3js.eth.call({
          to: process.env.PUBLIC_CHAIN_BRIDGE_ADDRESS,
          data: '0xc0da1e68'
        })
        return {
          relayPaused: parseInt(data.slice(-256, -192), 16) > 0,
          minSingleRelayAmount: web3js.utils.toBN('0x' + data.slice(-192, -128)),
          maxSingleRelayAmount: web3js.utils.toBN('0x' + data.slice(-128, -64))
          // relayFee: web3js.utils.toBN('0x' + data.slice(-64))
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
                to: process.env.PUBLIC_CHAIN_TOKEN_ADDRESS,
                gas: '0x' + (5500000).toString(16),
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
              to: process.env.PUBLIC_CHAIN_TOKEN_ADDRESS,
              gas: '0x' + (5500000).toString(16),
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
            gas: '0x' + (5500000).toString(16),
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
        to: process.env.PUBLIC_CHAIN_TOKEN_ADDRESS,
        data:
          '0xdd62ed3e' +
          '0'.repeat(24) +
          account.slice(2) +
          '0'.repeat(24) +
          process.env.PUBLIC_CHAIN_BRIDGE_ADDRESS.slice(2)
      })

      return Number(amountHex)
    },
    _sendTransactions(transactions) {
      return new Promise((resolve, reject) => {
        const totalCount = transactions.length // 総トランザクション数
        let finishCount = 0 // 完了トランザクション数
        let successCount = 0 // 成功トランザクション数

        // NOTICE MetaMask上ではトランザクションの順序が逆に表示されるため、reverse処理を入れている
        for (const transaction of transactions.reverse()) {
          window.ethereum.sendAsync(transaction, (err, result) => {
            if (!err && !result.error) {
              successCount++
            }
            finishCount++

            if (finishCount < totalCount) return

            if (successCount >= totalCount) {
              resolve()
            } else {
              reject()
            }
          })
        }
      })
    },
    onInput(event) {
      try {
        this.balance = event.target.value
        if (this.balance === '') {
          this.errorMessage = ''
          return
        }
        const amountWei = window.web3.utils.toBN(window.web3.utils.toWei(this.balance))
        if (
          amountWei < this.bridgeInfo.minSingleRelayAmount ||
          amountWei > this.bridgeInfo.maxSingleRelayAmount
        ) {
          this.errorMessage = '10,000ALIS以内で設定してください'
          return
        }
        if (amountWei.mod(window.web3.utils.toBN(window.web3.utils.toWei('0.001'))) > 0) {
          this.errorMessage = '入金額は小数点第3桁まで入力可能です'
          return
        }
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = '数値で入力してください'
      }
    },
    async handleClickDeposit() {
      if (!this.isLoggedInToMetaMask) await this.initMetaMaskAndBridge()
      if (this.errorMessage !== '') return
      if (this.balance === '' || this.balance === null) {
        this.errorMessage = '数値で入力してください'
        return
      }
      const amountWei = window.web3.utils.toBN(window.web3.utils.toWei(this.balance))
      const recipient = this.currentUser.privateEthAddress
      this.deposit(recipient, amountWei)
        .then(() => {
          this.sendNotification({
            text: '入金のトランザクションを発行しました。詳細はMETAMASKでご確認ください。'
          })
        })
        .catch((e) => {
          this.sendNotification({
            text: 'トランザクション発行に失敗しました',
            type: 'warning'
          })
        })
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
  grid-template-columns: 1fr 400px 1fr;
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
    margin-bottom: 4px;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:focus {
      outline: 0;
    }
  }

  .token-amount-input-unit {
    position: absolute;
    color: #030303;
    font-size: 10px;
    font-weight: bold;
    bottom: 48px;
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
