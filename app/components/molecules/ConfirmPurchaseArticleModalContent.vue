<template>
  <div class="wrapper">
    <no-ssr>
      <div class="eye-catch-image-box">
        <img
          v-if="article.eye_catch_url === null || article.eye_catch_url === undefined"
          class="eye-catch-image"
          src="~assets/images/pc/common/thumbnail_noimg.png"
        >
        <img v-else class="eye-catch-image" :src="`${article.eye_catch_url}?d=592x296`">
      </div>
      <h2 class="title" :class="{ withWalletPassword: !localStoragePbkdf2Key }">
        {{ decodedTitle }}
      </h2>
      <span class="label" :class="{ withWalletPassword: !localStoragePbkdf2Key }">支払い金額</span>
      <div class="price-box" :class="{ withWalletPassword: !localStoragePbkdf2Key }">
        {{ formattedPrice }}
        <span class="unit">ALIS</span>
      </div>
      <div
        v-if="!localStoragePbkdf2Key"
        class="label"
        :class="{ withWalletPassword: !localStoragePbkdf2Key }"
      >
        ウォレットパスワード
      </div>
      <div v-if="!localStoragePbkdf2Key" class="wallet-password-input-box">
        <input
          v-model="walletPassword"
          class="wallet-password-input"
          type="password"
          placeholder=""
        >
      </div>
      <div class="confirm-text">
        記事作成者の意思により事前の予告なく、記事の編集ならびに削除が行われる可能性があります
      </div>
      <span class="error-message" :class="{ withWalletPassword: !localStoragePbkdf2Key }">
        {{ errorMessage }}
      </span>
      <app-button
        class="purchase-button"
        :isLoading="isProcessing"
        :disabled="!isPurchasable || isProcessing"
        @click="purchase"
      >
        購入する※取り消し不可
      </app-button>
    </no-ssr>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppButton from '../atoms/AppButton'
import { BigNumber } from 'bignumber.js'
import { htmlDecode, showEmbed } from '~/utils/article'
import {
  getLocalStoragePbkdf2Key,
  getPbkdf2,
  decryptSecretKey,
  setLocalStoragePbkdf2Key
} from '~/utils/wallet'
import { getErc20TransferData, getSignedRawTransaction } from '~/utils/web3'

export default {
  components: {
    AppButton
  },
  data() {
    return {
      walletPassword: '',
      localStoragePbkdf2Key: true,
      errorMessage: '',
      isPurchasable: true,
      isProcessing: false
    }
  },
  async mounted() {
    await this.getArticlePrice({ articleId: this.article.article_id })
    this.isPurchasable = await this.checkIsPurchasable()
    if (!this.isPurchasable) this.errorMessage = 'ALISが不足しています'
    const modalTitle = document.querySelector('.modal-body .title')
    this.localStoragePbkdf2Key = getLocalStoragePbkdf2Key()
    if (window.innerWidth <= 320 && modalTitle) modalTitle.style.marginTop = '40px'
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
    ...mapGetters('article', ['article'])
  },
  methods: {
    async purchase() {
      try {
        if (this.isProcessing) return
        this.isProcessing = true
        this.isPurchasable = await this.checkIsPurchasable()
        if (!this.isPurchasable) {
          this.errorMessage = 'ALISが不足しています'
          this.isProcessing = false
          return
        }

        if (!this.localStoragePbkdf2Key && this.walletPassword.length < 8) {
          this.errorMessage = 'ウォレットパスワードを8文字以上で入力してください'
          return
        }

        // get private key
        const walletEncryptInfo = await this.getWalletEncryptInfo()
        const pbkdf2Key = this.localStoragePbkdf2Key
          ? this.localStoragePbkdf2Key
          : getPbkdf2(this.walletPassword, walletEncryptInfo.salt)
        const privateKey = decryptSecretKey(walletEncryptInfo.encrypted_secret_key, pbkdf2Key)
        // create purchase transaction
        const articlePrice = new BigNumber(this.article.price)
        const nonce = await this.getWalletNonce()
        const sendAddress = await this.getWalletAddress({ userId: this.article.userInfo.user_id })
        const purchaseTokenAmount = articlePrice.div(10).multipliedBy(9)
        const burnTokenAmount = articlePrice.div(10)
        const purchaseData = getErc20TransferData(sendAddress, purchaseTokenAmount)
        const purchaseTransaction = await getSignedRawTransaction(
          nonce,
          process.env.PRIVATE_CHAIN_ALIS_TOKEN_ADDRESS,
          purchaseData,
          privateKey
        )
        // create burn transaction
        const burnData = getErc20TransferData(process.env.BURN_ADDRESS, burnTokenAmount)
        const burnTransaction = await getSignedRawTransaction(
          nonce + 1,
          process.env.PRIVATE_CHAIN_ALIS_TOKEN_ADDRESS,
          burnData,
          privateKey
        )

        const status = await this.purchaseArticle({
          articleId: this.article.article_id,
          purchaseTransaction,
          burnTransaction
        })

        // error が発生しなければ pbkdf2key を localStorage に保存
        if (!this.localStoragePbkdf2Key) {
          setLocalStoragePbkdf2Key(this.pbkdf2Key)
        }

        if (status === 'done') {
          this.sendNotification({ text: '記事を購入しました' })
          // 記事取得
          await this.getPurchaedArticleDetail({ articleId: this.article.article_id })
          // コメント取得
          await this.setArticleComments({ articleId: this.article.article_id })
          window.scrollTo({
            top: 0
          })
          showEmbed()
          const paywallLine = document.querySelector('.paywall-line')
          if (paywallLine) paywallLine.remove()
          this.setConfirmPurchaseArticleModal({ isShow: false })
        } else if (status === 'doing') {
          this.sendNotification({
            text: '記事を購入しました。購入処理の完了までしばらくお待ち下さい'
          })
          this.setConfirmPurchaseArticleModal({ isShow: false })
        } else if (status === 'fail') {
          this.errorMessage = '記事の購入に失敗しました'
        }
      } catch (error) {
        if (error.response.data.message === 'Price was changed') {
          this.errorMessage = '記事の価格が変更されました'
        } else {
          this.errorMessage = 'エラーが発生しました。しばらく時間を置いて再度お試しください'
        }
      } finally {
        this.isProcessing = false
      }
    },
    async checkIsPurchasable() {
      const { result } = await this.getBalance()
      const myBalance = new BigNumber(result, 16)
      const articlePrice = new BigNumber(this.article.price)
      return myBalance.isGreaterThanOrEqualTo(articlePrice)
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', [
      'getArticlePrice',
      'purchaseArticle',
      'getPurchaedArticleDetail',
      'setArticleComments'
    ]),
    ...mapActions('user', [
      'setConfirmPurchaseArticleModal',
      'getBalance',
      'getWalletAddress',
      'getWalletNonce',
      'getWalletEncryptInfo'
    ])
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 0 auto;
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  width: 296px;
}

.eye-catch-image-box {
  background: #fff;
  overflow: hidden;
  width: 296px;
  height: 148px;
  margin: 40px 0 12px;

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
  margin-bottom: 40px;
}

.label {
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.8px;
  margin-bottom: 10px;
  text-align: left;
  width: 100%;
}

.price-box {
  align-items: center;
  background-color: rgba(0, 134, 204, 0.05);
  border-radius: 4px;
  box-sizing: border-box;
  color: #030303;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  height: 45px;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 12px;
  width: 296px;
}

.wallet-password-input-box {
  position: relative;

  .wallet-password-input {
    appearance: none;
    border: 4px;

    //background-color: rgba(0, 134, 204, 0.05);
    box-shadow: 0 0 16px 0 rgba(0, 134, 204, 0.5);
    border-radius: 4px;
    box-sizing: border-box;
    color: #030303;
    font-size: 14px;
    height: 45px;
    /*line-height: 20px;*/
    margin-bottom: 20px;
    padding: 0 12px;
    text-align: left;
    width: 296px;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:focus {
      outline: 0;
    }
  }
}

.confirm-text {
  color: #6e6e6e;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
}

.error-message {
  color: #f06273;
  font-size: 12px;
  margin-top: 40px;
  min-height: 14px;
  margin-bottom: 10px;
}

.purchase-button {
  margin-bottom: 40px;
}

@media screen and (max-width: 320px) {
  .wrapper {
    width: 260px;
  }

  .eye-catch-image-box {
    width: 260px;
    margin: 20px 0 12px;
  }

  .title {
    margin-bottom: 20px;

    &.withWalletPassword {
      margin-bottom: 10px;
    }
  }

  .label {
    &.withWalletPassword {
      font-size: 13px;
    }
  }

  .price-box {
    width: 260px;
    &.withWalletPassword {
      height: 40px;
      margin-bottom: 10px;
    }
  }

  .wallet-password-input-box {
    .wallet-password-input {
      width: 260px;
      height: 40px;
      margin-bottom: 10px;
    }
  }

  .confirm-text {
    font-size: 11px;
  }

  .error-message {
    margin-top: 20px;
    min-height: 14px;
    margin-bottom: 10px;

    &.withWalletPassword {
      margin-top: 10px;
    }
  }
}
</style>
