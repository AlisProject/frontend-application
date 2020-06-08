<template>
  <div class="area-article-detail-paypart-container">
    <div class="paywall-line">
      この続きを読むには<span class="br" />記事を購入してください
    </div>
    <div class="purchase-article-card">
      <div class="eye-catch-image-box">
        <img
          v-if="article.eye_catch_url === null || article.eye_catch_url === undefined"
          class="eye-catch-image"
          src="~assets/images/pc/common/thumbnail_noimg.png"
          alt="Eye catch"
        >
        <img
          v-else
          class="eye-catch-image"
          :src="`${article.eye_catch_url}?d=592x296`"
          alt="Eye catch"
        >
      </div>
      <h2 class="title">
        {{ decodedTitle }}
      </h2>
      <div class="price-label">
        有料：{{ formattedPrice }}ALIS
      </div>
      <app-button class="purchase-button" @click="showModal">
        記事を購入する
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppButton from '../atoms/AppButton'
import { BigNumber } from 'bignumber.js'
import { htmlDecode } from '~/utils/article'

export default {
  components: {
    AppButton
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    decodedTitle() {
      return htmlDecode(this.article.title)
    },
    formattedPrice() {
      const formatNumber = 10 ** 18
      const price = new BigNumber(this.article.price).div(formatNumber).toString(10)
      return price
    },
    ...mapGetters('user', ['loggedIn', 'currentUser'])
  },
  methods: {
    async showModal() {
      if (!this.loggedIn) {
        this.setRequestLoginModal({ isShow: true, requestType: 'purchaseArticle' })
        return
      }
      if (!this.currentUser.phoneNumberVerified) {
        this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'purchaseArticle' })
        this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
        return
      }
      const encryptInfo = await this.getWalletEncryptInfo()
      if (!encryptInfo.encrypted_secret_key) {
        this.setRequestWalletPasswordModal({ isShow: true })
        this.setRequestInputWalletPasswordModal({ isShow: true })
        return
      }
      this.setConfirmPurchaseArticleModal({ isShow: true })
    },
    ...mapActions('user', [
      'setConfirmPurchaseArticleModal',
      'setRequestLoginModal',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal',
      'getWalletEncryptInfo',
      'setRequestWalletPasswordModal',
      'setRequestInputWalletPasswordModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.area-article-detail-paypart-container {
  display: grid;
  grid-area: paypart;

  .paywall-line {
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.8px;
    line-height: 1.5;
    margin-bottom: 30px;
    padding: 0 120px;
    position: relative;
    text-align: center;

    &:before,
    &:after {
      content: '...........';
      display: inline-block;
      font-size: 14px;
      height: 2px;
      letter-spacing: 8px;
      position: absolute;
      top: -5px;
      width: 120px;
    }

    &:before {
      left: 0;
    }

    &:after {
      right: 0;
    }
  }

  .purchase-article-card {
    border-radius: 4px;
    border: 1px solid #e3e3e3;
    box-sizing: border-box;
    height: 332px;
    padding: 20px 21px;
    text-decoration: none;
    width: 340px;
    margin: 0 auto 10px;

    .eye-catch-image-box {
      background: #fff;
      overflow: hidden;
      width: 296px;
      height: 148px;
      margin-bottom: 12px;

      .eye-catch-image {
        max-width: 100%;
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }

    .title {
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      color: #555;
      display: -webkit-box;
      font-size: 14px;
      font-weight: bold;
      height: 48px;
      letter-spacing: 0.8px;
      line-height: 1.714;
      margin: 0;
      overflow: hidden;
      text-decoration: none;
      text-overflow: ellipsis;
      margin-bottom: 6px;
    }

    .price-label {
      align-items: center;
      border-radius: 2px;
      border: 1px solid #0086cc;
      box-sizing: border-box;
      color: #0086cc;
      display: flex;
      display: inline-block;
      font-size: 12px;
      font-weight: bold;
      height: 24px;
      line-height: 1.8;
      margin: 0 0 0 auto;
      padding: 0 6px;
      margin-bottom: 18px;
    }

    .purchase-button {
      margin: 0 auto;
    }
  }
}

@media screen and (max-width: 640px) {
  .area-article-detail-paypart-container {
    .br {
      &:before {
        content: '\A';
        white-space: pre;
      }
    }

    .paywall-line {
      padding: 0;
      margin-bottom: 20px;

      &:before,
      &:after {
        content: '......';
        top: 2px;
        width: 110px;
      }
    }
  }
}

@media screen and (max-width: 320px) {
  .area-article-detail-paypart-container {
    .purchase-article-card {
      width: 300px;

      .eye-catch-image-box {
        width: 256px;
      }
    }
  }
}
</style>
