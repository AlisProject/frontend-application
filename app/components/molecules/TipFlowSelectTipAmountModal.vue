<template>
  <div class="tip-flow-select-tip-amount-modal">
    <h1 class="title">
      トークンを贈る
    </h1>
    <span class="description">
      お贈り先をご確認の上、贈る量を決めて確認画面へお進みください
    </span>
    <img
      class="author-icon"
      :src="article.userInfo.icon_image_url"
      :alt="imageCaption"
      v-if="article.userInfo.icon_image_url !== undefined">
    <img
      class="author-icon"
      src="~assets/images/pc/common/icon_user_noimg.png"
      :alt="imageCaption"
      v-else>
    <span class="user-display-name">
      {{ decodedUserDisplayName }}
    </span>
    <span class="user-id">
      @{{ article.userInfo.user_id }}
    </span>
    <div class="triangle-mark" />
    <div class="token-amount-input-box">
      <input
        class="token-amount-input"
        type="number"
        v-model="tipTokenAmount"
        @keydown.up.down.prevent>
      <span class="token-amount-input-unit">ALIS</span>
    </div>
    <div class="select-unit-box">
      <div
        v-for="unit in orderedUnitList"
        @click="addTipTokenAmount(unit.amount)"
        :data-token-amount="unit.amount"
        :class="`unit-item unit-${unit.name}`">
        {{ unit.amount }}
      </div>
    </div>
    <span class="error-message">
      {{ errorMessage }}
    </span>
    <app-button class="to-confirmation-page-button" @click="moveToConfirmationPage">
      確認画面へ進む
    </app-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { BigNumber } from 'bignumber.js'
import AppButton from '../atoms/AppButton'
import { htmlDecode } from '~/utils/article'

const FORMAT_NUMBER = 10 ** 18
const MAXIMUM_TIPPABLE_TOKEN_AMOUNT = '999.9999999999'
const MINIMUM_TIPPABLE_TOKEN_AMOUNT = '0.0000000001'

export default {
  components: {
    AppButton
  },
  data() {
    return {
      tipTokenAmount: 0,
      errorMessage: '',
      unitList: [
        { amount: 10, name: '10', order: 1 },
        { amount: 1, name: '1', order: 2 },
        { amount: 0.1, name: '01', order: 3 }
      ]
    }
  },
  mounted() {
    let lastTouch = 0
    // スマホでのダブルタップ時に拡大しない
    this.$el.addEventListener(
      'touchend',
      (event) => {
        const now = window.performance.now()
        if (now - lastTouch <= 500) {
          this.addTipTokenAmount(event.target.dataset.tokenAmount)
          event.preventDefault()
        }
        lastTouch = now
      },
      true
    )
    this.getUsersAlisToken()
  },
  computed: {
    tipTokenAmountForUser() {
      return new BigNumber(this.tipTokenAmount).div(FORMAT_NUMBER).toString(10)
    },
    imageCaption() {
      return `${this.article.userInfo.user_display_name}'s icon'`
    },
    orderedUnitList() {
      return this.unitList.sort((a, b) => a.order > b.order)
    },
    decodedUserDisplayName() {
      return htmlDecode(this.article.userInfo.user_display_name)
    },
    ...mapGetters('user', ['alisToken']),
    ...mapGetters('article', ['article'])
  },
  methods: {
    addTipTokenAmount(amount) {
      try {
        const formattedAmount = new BigNumber(amount)
        const formattedAlisTokenAmount = new BigNumber(this.alisToken)
        const formattedTipTokenAmount = new BigNumber(this.tipTokenAmount)
        const isAddableToken = formattedTipTokenAmount.isLessThanOrEqualTo(
          formattedAlisTokenAmount.minus(formattedAmount)
        )

        if (!isAddableToken) {
          this.errorMessage = 'トークンが不足しています'
          return
        }

        const formattedMaxTokenAmount = new BigNumber(MAXIMUM_TIPPABLE_TOKEN_AMOUNT)
        const hasExceededMaxTipToken = formattedTipTokenAmount.isGreaterThan(
          formattedMaxTokenAmount.minus(formattedAmount)
        )

        if (hasExceededMaxTipToken) {
          this.errorMessage = '一度に贈れるトークンは 1000 ALIS 未満となります'
          return
        }

        this.errorMessage = ''
        this.tipTokenAmount = formattedTipTokenAmount.plus(formattedAmount)
      } catch (error) {
        this.errorMessage = '数字でご入力ください'
      }
    },
    moveToConfirmationPage() {
      try {
        const formattedAlisTokenAmount = new BigNumber(this.alisToken)
        const formattedTipTokenAmount = new BigNumber(this.tipTokenAmount)
        const isAddableToken = formattedTipTokenAmount.isLessThanOrEqualTo(
          formattedAlisTokenAmount.minus(formattedTipTokenAmount)
        )
        if (!isAddableToken) {
          this.errorMessage = 'トークンが不足しています'
          return
        }

        if (formattedTipTokenAmount.isEqualTo(0)) {
          this.errorMessage = '贈るトークン量を選択してください'
          return
        }

        const formattedMaxTokenAmount = new BigNumber(MAXIMUM_TIPPABLE_TOKEN_AMOUNT)
        const hasExceededMaxTipToken = formattedTipTokenAmount.isGreaterThan(
          formattedMaxTokenAmount
        )

        if (hasExceededMaxTipToken) {
          this.errorMessage = '一度に贈れるトークンは 1000 ALIS 未満となります'
          return
        }

        const tipTokenAmountForUser = formattedTipTokenAmount.toString(10)

        // 小数点以下の桁数が10桁を超えているか確認
        const isNotInputablePlaceAfterDecimalPoint =
          tipTokenAmountForUser &&
          tipTokenAmountForUser.includes('.') &&
          tipTokenAmountForUser.split('.')[1].length > 10

        if (isNotInputablePlaceAfterDecimalPoint) {
          this.errorMessage = '小数点10桁までの範囲でご入力ください'
          return
        }

        const formattedMinTokenAmount = new BigNumber(MINIMUM_TIPPABLE_TOKEN_AMOUNT)
        const isLessThanMinTipToken = formattedTipTokenAmount.isLessThan(formattedMinTokenAmount)

        if (isLessThanMinTipToken) return

        this.setTipTokenAmount({
          tipTokenAmount: formattedTipTokenAmount.multipliedBy(FORMAT_NUMBER)
        })
        this.setTipFlowSelectTipAmountModal({ isShow: false })
        this.setTipFlowConfirmationModal({ isShow: true })
      } catch (error) {
        this.errorMessage = '数字でご入力ください'
      }
    },
    ...mapActions('user', [
      'getUsersAlisToken',
      'setTipFlowSelectTipAmountModal',
      'setTipFlowConfirmationModal',
      'setTipTokenAmount'
    ])
  }
}
</script>


<style lang="scss" scoped>
.tip-flow-select-tip-amount-modal {
  align-items: center;
  display: flex;
  flex-flow: column nowrap;

  .title {
    color: #030303;
    font-size: 20px;
    letter-spacing: 4px;
    margin: 10px 0 0;
  }

  .description {
    color: #030303;
    font-size: 14px;
    margin-top: 60px;
  }

  .author-icon {
    border-radius: 50%;
    height: 80px;
    margin-top: 40px;
    width: 80px;
  }

  .user-display-name {
    color: #030303;
    font-size: 14px;
    letter-spacing: 0.8px;
    margin-top: 16px;
  }

  .user-id {
    color: #6e6e6e;
    font-size: 12px;
    letter-spacing: 0.8px;
    margin-top: 4px;
  }

  .triangle-mark {
    border-color: transparent transparent rgb(218, 220, 243) transparent;
    border-style: solid;
    border-width: 0 16px 20px 16px;
    height: 0;
    margin-top: 20px;
    width: 0;
  }

  .token-amount-input-box {
    position: relative;

    .token-amount-input {
      appearance: none;
      border: 0;
      padding: 10px 40px 10px 10px;
      color: #858dda;
      font-size: 24px;
      font-weight: bold;
      line-height: 28px;
      box-shadow: 0 0 8px 0 rgba(133, 141, 218, 0.5);
      text-align: right;
      margin-top: 20px;
      width: 255px;
      box-sizing: border-box;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &:after {
        content: 'ALIS';
      }

      &:focus {
        outline: 0;
        box-shadow: none;
      }
    }

    .token-amount-input-unit {
      position: absolute;
      color: #858dda;
      font-size: 10px;
      font-weight: bold;
      top: 39px;
      right: 10px;
    }
  }

  .select-unit-box {
    display: flex;
    justify-content: space-around;
    margin: 24px auto 0;
    text-align: center;
    width: 220px;

    .unit-item {
      border-radius: 50%;
      box-shadow: 0 0 16px 0 rgba(133, 141, 218, 0.8);
      box-sizing: border-box;
      color: #858dda;
      cursor: pointer;
      font-size: 10px;
      height: 40px;
      padding-top: 24px;
      user-select: none;
      width: 40px;

      &.unit-10 {
        background: #fff url('~assets/images/pc/article/icon_chip_10.png') no-repeat;
        background-size: 16px;
        background-position-x: 12px;
        background-position-y: 5px;
      }

      &.unit-1 {
        background: #fff url('~assets/images/pc/article/icon_chip_1.png') no-repeat;
        background-size: 16px;
        background-position-x: 12px;
        background-position-y: 5px;
      }

      &.unit-01 {
        background: #fff url('~assets/images/pc/article/icon_chip_01.png') no-repeat;
        background-size: 16px;
        background-position-x: 12px;
        background-position-y: 5px;
      }
    }
  }

  .error-message {
    color: #f06273;
    font-size: 12px;
    margin-top: 34px;
    min-height: 14px;
  }

  .to-confirmation-page-button {
    margin: 8px 0 40px;
  }
}

@media screen and (max-width: 550px) {
  .tip-flow-select-tip-amount-modal {
    .title {
      font-size: 14px;
      font-weight: normal;
      letter-spacing: 4px;
      margin: 20px 0 0;
    }

    .description {
      color: #6e6e6e;
      font-size: 12px;
      margin-top: 30px;
    }
  }
}

@media screen and (max-width: 320px) {
  .tip-flow-select-tip-amount-modal {
    .title {
      margin: 0;
    }

    .description {
      margin-top: 12px;
    }

    .error-message {
      margin-top: 24px;
    }
  }
}
</style>
