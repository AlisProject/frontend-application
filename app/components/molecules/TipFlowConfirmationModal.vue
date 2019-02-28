<template>
  <div class="tip-flow-confirmation-modal">
    <h1 class="title">
      贈る量の確認
    </h1>
    <span class="description">
      以下の内容をご確認の上、ALISを贈るボタンを押してください
      ※操作の取り消しはできませんのでご注意ください
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
      <span class="token-amount-input">{{ tipTokenAmountForUser }}</span>
      <span class="token-amount-input-unit">ALIS</span>
    </div>
    <span class="error-message">
      {{ errorMessage }}
    </span>
    <app-button class="send-token-button" @click="moveToCompletedPage">
      ALISを贈る
    </app-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { BigNumber } from 'bignumber.js'
import AppButton from '../atoms/AppButton'
import { htmlDecode } from '~/utils/article'

export default {
  components: {
    AppButton
  },
  data() {
    return {
      errorMessage: ''
    }
  },
  computed: {
    tipTokenAmountForUser() {
      const formatNumber = 10 ** 18
      return new BigNumber(this.tipTokenAmount).div(formatNumber).toString(10)
    },
    imageCaption() {
      return `${this.article.userInfo.user_display_name}'s icon'`
    },
    decodedUserDisplayName() {
      return htmlDecode(this.article.userInfo.user_display_name)
    },
    ...mapGetters('user', ['tipTokenAmount', 'alisToken']),
    ...mapGetters('article', ['article'])
  },
  methods: {
    async moveToCompletedPage() {
      try {
        await this.getUsersAlisToken()

        const formattedTipTokenAmount = new BigNumber(this.tipTokenAmountForUser)
        const formattedAlisToken = new BigNumber(this.alisToken)

        if (formattedAlisToken.isLessThan(formattedTipTokenAmount)) {
          this.errorMessage = 'ALISが不足しています'
          return
        }

        const tipValue = new BigNumber(this.tipTokenAmount).toString()

        await this.postTipToken({ tipValue, articleId: this.article.article_id })
      } catch (error) {
        this.errorMessage = 'エラーが発生しました。しばらく時間を置いて再度お試しください'
        return
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
    margin-top: 22px;
    width: 254px;
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
    margin-top: 20px;
    display: flex;
    align-items: center;

    .token-amount-input {
      color: #0086cc;
      font-size: 24px;
      font-weight: bold;
      text-align: right;
      margin-right: 4px;
    }

    .token-amount-input-unit {
      color: #0086cc;
      font-size: 10px;
      font-weight: bold;
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
      margin-top: 30px;
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
