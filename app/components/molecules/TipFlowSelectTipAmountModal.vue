<template>
  <div class="tip-flow-select-tip-amount-modal">
    <h1 class="title">
      ALISを贈る
    </h1>
    <span class="description">
      お贈り先をご確認の上、贈る量を決めて確認画面へお進みください
    </span>
    <img
      v-if="article.userInfo.icon_image_url !== undefined"
      class="author-icon"
      :src="article.userInfo.icon_image_url"
      :alt="imageCaption"
    >
    <img
      v-else
      class="author-icon"
      src="~assets/images/pc/common/icon_user_noimg.png"
      :alt="imageCaption"
    >
    <span class="user-display-name">
      {{ decodedUserDisplayName }}
    </span>
    <span class="user-id"> @{{ article.userInfo.user_id }} </span>
    <div class="triangle-mark" />
    <div class="token-amount-input-box">
      <input
        v-model="tipTokenAmount"
        class="token-amount-input"
        type="number"
        @keydown.up.down.prevent
      >
      <span class="token-amount-input-unit">ALIS</span>
    </div>
    <div class="burn-description">
      ※贈ったALISの10%が<a
        href="https://intercom.help/alismedia/%E3%81%9D%E3%81%AE%E4%BB%96-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B/%E3%83%90%E3%83%BC%E3%83%B3%E3%81%A8%E3%81%AF"
        class="link"
        target="_blank"
        rel="noopener noreferrer nofollow"
      >バーン</a>されます
    </div>
    <div class="select-unit-box">
      <div
        v-for="unit in orderedUnitList"
        :data-token-amount="unit.amount"
        :class="`unit-item unit-${unit.name}`"
        @click="addTipTokenAmount(unit.amount)"
      >
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
import { isOverDecimalPoint } from '~/utils/wallet'

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
    Array.from(this.$el.querySelectorAll('.unit-item')).forEach((unitItem) => {
      unitItem.addEventListener(
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
    })
    this.getUsersAlisToken()
  },
  computed: {
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
        if (this.tipTokenAmount === '') this.tipTokenAmount = 0
        const formattedAmount = new BigNumber(amount)
        const formattedAlisTokenAmount = new BigNumber(this.alisToken)
        const formattedTipTokenAmount = new BigNumber(this.tipTokenAmount)
        const fee = formattedTipTokenAmount.multipliedBy(0.1)
        const isAddableToken = formattedTipTokenAmount
          .plus(fee)
          .isLessThanOrEqualTo(formattedAlisTokenAmount.minus(formattedAmount))

        if (!isAddableToken) {
          this.errorMessage = 'ALISが不足しています'
          return
        }

        const formattedMaxTokenAmount = new BigNumber(MAXIMUM_TIPPABLE_TOKEN_AMOUNT)
        const hasExceededMaxTipToken = formattedTipTokenAmount.isGreaterThan(
          formattedMaxTokenAmount.minus(formattedAmount)
        )

        if (hasExceededMaxTipToken) {
          this.errorMessage = '一度に贈れるALISは1000 ALIS未満となります'
          return
        }

        this.errorMessage = ''
        this.tipTokenAmount = formattedTipTokenAmount.plus(formattedAmount)
      } catch (error) {
        this.errorMessage = '数字で入力してください'
      }
    },
    moveToConfirmationPage() {
      try {
        const formattedAlisTokenAmount = new BigNumber(this.alisToken)
        const formattedTipTokenAmount = new BigNumber(this.tipTokenAmount)
        const fee = formattedTipTokenAmount.multipliedBy(0.1)
        const isAddableToken = formattedTipTokenAmount
          .plus(fee)
          .isLessThanOrEqualTo(formattedAlisTokenAmount)
        if (!isAddableToken) {
          this.errorMessage = 'ALISが不足しています'
          return
        }

        if (formattedTipTokenAmount.isEqualTo(0)) {
          this.errorMessage = '贈るALISを選択してください'
          return
        }

        const formattedMaxTokenAmount = new BigNumber(MAXIMUM_TIPPABLE_TOKEN_AMOUNT)
        const hasExceededMaxTipToken = formattedTipTokenAmount.isGreaterThan(
          formattedMaxTokenAmount
        )

        if (hasExceededMaxTipToken) {
          this.errorMessage = '一度に贈れるALISは1000 ALIS未満となります'
          return
        }

        const tipTokenAmountForUser = formattedTipTokenAmount.toString(10)

        // 小数点以下の桁数が10桁を超えているか確認
        const isNotInputablePlaceAfterDecimalPoint = isOverDecimalPoint(tipTokenAmountForUser, 10)

        if (isNotInputablePlaceAfterDecimalPoint) {
          this.errorMessage = '小数点10桁までの範囲で入力してください'
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
        this.errorMessage = '数字で入力してください'
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
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.8px;
    text-align: center;
    margin: 30px 0 0;
  }

  .description {
    color: #6e6e6e;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.8px;
    line-height: 1.5;
    margin-top: 22px;
    width: 256px;
  }

  .author-icon {
    border-radius: 50%;
    height: 80px;
    margin-top: 40px;
    width: 80px;
    object-fit: cover;
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
    border-color: transparent transparent rgb(178, 218, 239) transparent;
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
      box-shadow: 0 0 16px 0 rgba(0, 134, 204, 0.5);
      box-sizing: border-box;
      color: #0086cc;
      font-size: 24px;
      font-weight: bold;
      line-height: 28px;
      margin-top: 20px;
      padding: 10px 40px;
      text-align: center;
      width: 400px;

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
      color: #0086cc;
      font-size: 10px;
      font-weight: bold;
      top: 39px;
      right: 10px;
    }
  }

  .burn-description {
    color: #6e6e6e;
    font-size: 12px;
    width: 400px;
    text-align: right;
    margin: 10px 0 0;

    .link {
      color: #0086cc;
      font-size: 12px;
      text-decoration: none;
    }
  }

  .select-unit-box {
    display: flex;
    justify-content: space-around;
    margin: 40px auto 0;
    text-align: center;
    width: 220px;

    .unit-item {
      border-radius: 50%;
      box-shadow: 0 0 16px 0 rgba(0, 134, 204, 0.5);
      box-sizing: border-box;
      color: #0086cc;
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
      letter-spacing: 4px;
      margin: 20px 0 0;
    }

    .description {
      color: #6e6e6e;
      font-size: 12px;
      margin-top: 30px;
    }

    .burn-description {
      width: 255px;
    }

    .select-unit-box {
      margin: 30px auto 0;
    }

    .token-amount-input-box {
      .token-amount-input {
        width: 255px;
      }
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
