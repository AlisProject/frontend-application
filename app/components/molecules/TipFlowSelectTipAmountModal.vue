<template>
  <div class="tip-flow-select-tip-amount-modal">
    <h1 class="title">
      トークンの送付
    </h1>
    <span class="description">
      お送り先をご確認の上、送付量を決めて確認画面へお進みください
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
      {{ article.userInfo.user_display_name }}
    </span>
    <span class="user-id">
      @{{ article.userInfo.user_id }}
    </span>
    <div class="triangle-mark" />
    <div class="token-amount-box">
      <span class="token-amount">{{ tipTokenAmount }}</span>
      <span class="unit">ALIS</span>
    </div>
    <div class="select-unit-box">
      <img
        @click="addTipTokenAmount(10)"
        class="unit-item"
        src="~assets/images/pc/article/btn_etc.png"
        alt="10ALIS">
      <img
        @click="addTipTokenAmount(1)"
        class="unit-item"
        src="~assets/images/pc/article/btn_etc.png"
        alt="1ALIS">
      <img
        @click="addTipTokenAmount(0.1)"
        class="unit-item"
        src="~assets/images/pc/article/btn_etc.png"
        alt="0.1ALIS">
    </div>
    <span class="error-message">
      {{ errorMessage }}
    </span>
    <app-button class="to-next-page-button" @click="moveToConfirmationPage">
      確認画面へ進む
    </app-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  data() {
    return {
      tipTokenAmount: 0,
      errorMessage: ''
    }
  },
  computed: {
    imageCaption() {
      return `${this.article.userInfo.user_display_name}'s icon'`
    },
    ...mapGetters('user', ['alisToken']),
    ...mapGetters('article', ['article'])
  },
  methods: {
    addTipTokenAmount(amount) {
      // TODO: BigNumber等のライブラリを使う
      const isAddableToken = this.tipTokenAmount <= 10.5 - amount
      // const isAddableToken = this.tipTokenAmount <= this.alisToken - amount
      if (!isAddableToken) return
      this.tipTokenAmount += amount
    },
    moveToConfirmationPage() {
      if (this.tipTokenAmount === 0) {
        this.errorMessage = '送付するトークン量を選択してください'
        return
      }
      this.setTipTokenAmount({ tipTokenAmount: this.tipTokenAmount })
      this.setTipFlowSelectTipAmountModal({ isShow: false })
      this.setTipFlowConfirmationModal({ isShow: true })
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
.title {
  color: #030303;
  margin: 60px 0 0;
  font-size: 20px;
  text-align: center;
  letter-spacing: 4px;
}

.description {
  text-align: center;
  color: #030303;
  font-size: 14px;
  display: block;
  margin-top: 60px;
}

.author-icon {
  border-radius: 50%;
  display: block;
  height: 80px;
  margin: 40px auto 0;
  width: 80px;
}

.user-display-name {
  display: block;
  text-align: center;
  font-size: 14px;
  margin-top: 16px;
  color: #030303;
  letter-spacing: 0.8px;
}

.user-id {
  display: block;
  text-align: center;
  font-size: 12px;
  margin-top: 4px;
  color: #6e6e6e;
  letter-spacing: 0.8px;
}

.triangle-mark {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 16px 20px 16px;
  border-color: transparent transparent rgb(218, 220, 243) transparent;
  margin: 20px auto 0;
}

.token-amount-box {
  height: 80px;
  width: 80px;
  border: 2px solid #858dda;
  background-color: #ffffff;
  border-radius: 50%;
  margin: 20px auto 0;

  .token-amount {
    color: #858dda;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    display: block;
    margin-top: 22px;
  }

  .unit {
    color: #858dda;
    font-size: 14px;
    text-align: center;
    display: block;
    margin-top: 2px;
  }
}

.select-unit-box {
  display: flex;
  margin: 24px auto 0;
  text-align: center;
  justify-content: space-around;
  width: 180px;

  .unit-item {
    height: 60px;
    width: 60px;
  }
}

.error-message {
  color: #f06273;
  display: block;
  font-size: 12px;
  margin-top: 34px;
  min-height: 14px;
  text-align: center;
}

.to-next-page-button {
  text-align: center;
  display: block;
  margin: 8px auto 60px;
}
</style>
