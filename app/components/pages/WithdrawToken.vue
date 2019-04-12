<template>
  <div class="withdraw-token-container">
    <app-header />
    <wallet-nav selected="withdraw" />
    <div class="area-withdraw">
      <div v-if="!isConfirmPage && !relayPaused" class="withdraw-box">
        <h2 class="title">
          出金内容を入力してください
        </h2>
        <div class="address-input-box">
          <div class="label">
            宛先
          </div>
          <input
            :value="address"
            class="address-input"
            :class="{ error: addressErrorMessage }"
            type="text"
            placeholder="0x98105Ee422f3d690C612..."
            @input="onInputAddress">
          <span class="error-message">
            {{ addressErrorMessage }}
          </span>
        </div>
        <div class="token-amount-input-box">
          <div class="label">
            出金額
          </div>
          <span class="ownwd-balance-box">
            保有ALIS：<span class="ownwd-balance">{{ formattedAlisToken }} ALIS</span>
          </span>
          <input
            :value="amount"
            class="token-amount-input"
            :class="{ error: amountErrorMessage }"
            type="number"
            placeholder="1000"
            min="1"
            max="10000"
            @input="onInputAmount"
          >
          <span class="token-amount-input-unit">ALIS</span>
          <span class="error-message">
            {{ amountErrorMessage }}
          </span>
        </div>
        <p class="description">
          上記の金額に加えて{{ commission }}ALISの手数料が発生します
        </p>
        <app-button
          class="withdraw-button"
          :disabled="!isWithdrawable"
          @click="handleClickConfirmWithdraw"
        >
          出金内容を確認する
        </app-button>
      </div>
      <div v-if="isConfirmPage && !relayPaused" class="confirm-withdraw-box">
        <h2 class="title mb20">
          出金内容を確認してください
        </h2>
        <p class="description">
          以下の内容で間違えがないか、必ずご確認ください※間違えて出金したALISは返還できかねます
        </p>
        <div class="label">
          宛先
        </div>
        <div class="confirm-input">
          {{ address }}
        </div>
        <div class="label">
          出金額
        </div>
        <div class="confirm-input">
          {{ amount }}
          <span class="unit">ALIS</span>
        </div>
        <div class="label">
          手数料
        </div>
        <div class="confirm-input">
          {{ commission }}
          <span class="unit">ALIS</span>
        </div>
        <div class="label">
          合計額（出金額+手数料）
        </div>
        <div class="confirm-input">
          {{ totalAmount }}
          <span class="unit">ALIS</span>
        </div>
        <app-button class="withdraw-button" @click="handleClickWithdraw">
          出金する※取り消し不可
        </app-button>
        <button class="back-button" @click="handleClickBack">
          戻る
        </button>
      </div>
      <div v-if="relayPaused" class="relay-paused-box">
        <h2 class="title">
          現在、出金の機能を一時的に停止しております
        </h2>
        <p class="description">
          出金機能の再開までしばらくお待ち下さい
        </p>
      </div>
    </div>
    <app-footer />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { BigNumber } from 'bignumber.js'
import AppHeader from '../organisms/AppHeader'
import WalletNav from '../organisms/WalletNav'
import AppButton from '../atoms/AppButton'
import AppFooter from '../organisms/AppFooter'

const MAXIMUM_WITHDRAWABLE_TOKEN_AMOUNT = '10000'
const MINIMUM_WITHDRAWABLE_TOKEN_AMOUNT = '0.001'

export default {
  components: {
    AppHeader,
    WalletNav,
    AppButton,
    AppFooter
  },
  data() {
    return {
      address: '',
      amount: null,
      addressErrorMessage: '',
      amountErrorMessage: '',
      isConfirmPage: false,
      commission: 100,
      relayPaused: false
    }
  },
  mounted() {
    // TODO: APIコールによる確認を追加
    // this.relayPaused = true
  },
  computed: {
    formattedAlisToken() {
      return new BigNumber(this.alisToken).toFixed(3, 1)
    },
    isWithdrawable() {
      return (
        this.address !== '' &&
        this.addressErrorMessage === '' &&
        this.amount !== null &&
        this.amount !== '' &&
        this.amountErrorMessage === ''
      )
    },
    totalAmount() {
      // TODO: より厳密に価格の加算を行う
      return this.commission + Number(this.amount)
    },
    ...mapGetters('user', ['alisToken'])
  },
  methods: {
    onInputAddress(event) {
      this.address = event.target.value
      if (this.address === '') {
        this.addressErrorMessage = ''
        return
      }
      const addressPattern = /^0x[0-9a-fA-F]{40}$/
      if (!addressPattern.test(this.address)) {
        this.addressErrorMessage = '不正なアドレスです'
        return
      }
      this.addressErrorMessage = ''
    },
    onInputAmount(event) {
      try {
        this.amount = event.target.value
        if (this.amount === '') {
          this.amountErrorMessage = ''
          return
        }
        const formattedAlisTokenAmount = new BigNumber(this.alisToken)
        const formattedTipTokenAmount = new BigNumber(this.amount)
        if (formattedTipTokenAmount.isEqualTo(0)) {
          this.amountErrorMessage = '出金するALISを入力してください'
          return
        }
        const tipTokenAmountForUser = formattedTipTokenAmount.toString(10)
        // 小数点以下の桁数が10桁を超えているか確認
        const isNotInputablePlaceAfterDecimalPoint =
          tipTokenAmountForUser &&
          tipTokenAmountForUser.includes('.') &&
          tipTokenAmountForUser.split('.')[1].length > 3

        if (isNotInputablePlaceAfterDecimalPoint) {
          this.amountErrorMessage = '小数点3桁までの範囲で入力してください'
          return
        }
        const formattedMaxTokenAmount = new BigNumber(MAXIMUM_WITHDRAWABLE_TOKEN_AMOUNT)
        const hasExceededMaxTipToken = formattedTipTokenAmount.isGreaterThanOrEqualTo(
          formattedMaxTokenAmount
        )
        const formattedMinTokenAmount = new BigNumber(MINIMUM_WITHDRAWABLE_TOKEN_AMOUNT)
        const isLessThanMinTipToken = formattedTipTokenAmount.isLessThanOrEqualTo(
          formattedMinTokenAmount
        )
        if (hasExceededMaxTipToken || isLessThanMinTipToken) {
          this.amountErrorMessage = '一度に出金できるALISは10,000ALIS以下となります'
          return
        }
        const isAddableToken = formattedTipTokenAmount.isLessThanOrEqualTo(formattedAlisTokenAmount)
        if (!isAddableToken) {
          this.amountErrorMessage = 'ALISが不足しています'
          return
        }

        this.amountErrorMessage = ''
      } catch (error) {
        this.amountErrorMessage = '数字で入力してください'
      }
    },
    handleClickConfirmWithdraw() {
      if (!this.isWithdrawable) return
      this.isConfirmPage = true
    },
    handleClickWithdraw() {
      this.sendNotification({
        text: '出金を受け付けました'
      })
      this.amount = null
      this.address = ''
      this.isConfirmPage = false
    },
    handleClickBack() {
      // TODO: APIコールによる出金処理を追加
      this.isConfirmPage = false
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    })
  }
}
</script>

<style lang="scss" scoped>
.withdraw-token-container {
  display: grid;
  grid-row-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header app-header"
    "...        nav        ...       "
    "...        withdraw   ..."
    "app-footer app-footer app-footer";
  grid-template-columns: 1fr 400px 1fr;
  grid-template-rows: 100px 22px auto 75px;
  min-height: 100vh;
}

.area-withdraw {
  grid-area: withdraw;
}

.withdraw-box,
.confirm-withdraw-box {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.token-amount-input-box {
  position: relative;

  .ownwd-balance-box {
    position: absolute;
    right: 0;
    bottom: 84px;
    font-size: 12px;
    color: #6e6e6e;

    .ownwd-balance {
      color: #030303;
    }
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
    bottom: 43px;
    right: 10px;
  }
}

.label {
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.8px;
  margin: 20px 0 10px;
  width: 100%;
}

.address-input {
  appearance: none;
  border: 0;
  box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);
  box-sizing: border-box;
  color: #030303;
  font-size: 14px;
  line-height: 28px;
  padding: 10px 12px;
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

.error-message {
  color: #f06273;
  display: block;
  font-size: 12px;
  margin-bottom: 2px;
  min-height: 16px;
  text-align: right;
  width: 100%;
}

.withdraw-button {
  margin-top: 50px;
}

.mb20 {
  margin-bottom: 20px;
}

.confirm-input {
  border-radius: 4px;
  background-color: rgba(0, 134, 204, 0.05);
  padding: 12px;
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  width: 100%;
  box-sizing: border-box;

  .unit {
    float: right;
  }
}

.back-button {
  background-color: #fff;
  border-radius: 30px;
  border: 1px solid #0086cc;
  box-shadow: none;
  color: #0086cc;
  cursor: pointer;
  display: block;
  height: 37px;
  margin: 20px auto;
  width: 256px;
}

.relay-paused-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
}
</style>
