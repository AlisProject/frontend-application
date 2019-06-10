<template>
  <div class="tip-flow-confirmation-modal">
    <h1 class="title">
      贈る量の確認
    </h1>
    <span class="description">
      以下の内容をご確認の上、ALISを贈るボタンを押してください
      ※操作の取り消しはできませんのでご注意ください
    </span>
    <div class="label" v-text="'贈る量'" />
    <div class="confirm-input">
      {{ tipTokenAmountForUser }}
      <span class="unit">ALIS</span>
    </div>
    <div class="label" v-text="'バーンされる量'" />
    <div class="confirm-input">
      {{ tipTokenAmountFeeForUser }}
      <span class="unit">ALIS</span>
    </div>
    <div class="label" v-text="'総ALIS'" />
    <div class="confirm-input">
      {{ totalTokenAmount }}
      <span class="unit">ALIS</span>
    </div>
    <span class="error-message">
      {{ errorMessage }}
    </span>
    <app-button
      class="send-token-button"
      :disabled="isProcessing"
      :isLoading="isProcessing"
      @click="moveToCompletedPage"
    >
      ALISを贈る
    </app-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { BigNumber } from 'bignumber.js'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  data() {
    return {
      errorMessage: '',
      isProcessing: false
    }
  },
  computed: {
    tipTokenAmountForUser() {
      const formatNumber = 10 ** 18
      return new BigNumber(this.tipTokenAmount).div(formatNumber).toString(10)
    },
    tipTokenAmountFeeForUser() {
      return new BigNumber(this.tipTokenAmountForUser).multipliedBy(0.1).toString(10)
    },
    totalTokenAmount() {
      return new BigNumber(this.tipTokenAmountForUser)
        .plus(this.tipTokenAmountFeeForUser)
        .toString(10)
    },
    ...mapGetters('user', ['tipTokenAmount', 'alisToken']),
    ...mapGetters('article', ['article'])
  },
  methods: {
    async moveToCompletedPage() {
      try {
        if (this.isProcessing) return
        this.isProcessing = true

        await this.getUsersAlisToken()

        const formattedTipTokenAmount = new BigNumber(this.tipTokenAmountForUser)
        const formattedAlisToken = new BigNumber(this.alisToken)
        const fee = formattedTipTokenAmount.multipliedBy(0.1)
        const isShortOfToken = formattedAlisToken.plus(fee).isLessThan(formattedTipTokenAmount)
        if (isShortOfToken) {
          this.errorMessage = 'ALISが不足しています'
          return
        }

        const tipValue = new BigNumber(this.tipTokenAmount).toString()

        await this.postTipToken({ tipValue, articleId: this.article.article_id })
      } catch (error) {
        this.errorMessage = 'エラーが発生しました。しばらく時間を置いて再度お試しください'
        return
      } finally {
        this.isProcessing = false
      }
      this.setTipFlowConfirmationModal({ isShow: false })
      this.setTipFlowCompletedModal({ isShow: true })
    },
    ...mapActions('user', [
      'setTipFlowConfirmationModal',
      'setTipFlowCompletedModal',
      'getUsersAlisToken',
      'postTipToken'
    ])
  }
}
</script>

<style lang="scss" scoped>
.tip-flow-confirmation-modal {
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
    margin: 22px 0 30px;
    width: 254px;
  }

  .label {
    color: #030303;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.8px;
    margin: 20px 0 10px;
    width: 400px;
  }

  .confirm-input {
    border-radius: 4px;
    background-color: rgba(0, 134, 204, 0.05);
    padding: 12px;
    color: #030303;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    width: 400px;
    box-sizing: border-box;

    .unit {
      float: right;
    }
  }

  .error-message {
    color: #f06273;
    font-size: 12px;
    margin-top: 34px;
    min-height: 14px;
  }

  .send-token-button {
    margin: 8px 0 40px;
  }
}

@media screen and (max-width: 550px) {
  .tip-flow-confirmation-modal {
    .title {
      font-size: 14px;
      letter-spacing: 4px;
      margin: 20px 0 0;
    }

    .description {
      color: #6e6e6e;
      font-size: 12px;
      margin: 30px 0;
    }

    .label,
    .confirm-input {
      width: 300px;
    }
  }
}

@media screen and (max-width: 320px) {
  .tip-flow-confirmation-modal {
    .title {
      margin: 0;
    }

    .description {
      margin-top: 12px;
    }
  }
}
</style>
