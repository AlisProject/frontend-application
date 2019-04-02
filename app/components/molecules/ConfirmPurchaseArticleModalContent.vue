<template>
  <div class="wrapper">
    <div class="eye-catch-image-box">
      <img
        v-if="article.eye_catch_url === null || article.eye_catch_url === undefined"
        class="eye-catch-image"
        src="~assets/images/pc/common/thumbnail_noimg.png"
      >
      <img v-else class="eye-catch-image" :src="`${article.eye_catch_url}?d=592x296`">
    </div>
    <h2 class="title">
      {{ decodedTitle }}
    </h2>
    <span class="label">支払い金額</span>
    <div class="price-box">
      {{ formattedPrice }}
      <span class="unit">ALIS</span>
    </div>
    <div class="confirm-text">
      記事作成者の意思により事前の予告なく、記事の編集ならびに削除が行われる可能性があります
    </div>
    <span class="error-message">
      {{ errorMessage }}
    </span>
    <app-button class="purchase-button" @click="purchase">
      購入する※取り消し不可
    </app-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppButton from '../atoms/AppButton'
import { BigNumber } from 'bignumber.js'
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
  async mounted() {
    await this.getArticlePrice({ articleId: this.article.article_id })
    const modalTitle = document.querySelector('.modal-body .title')
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
        const status = await this.purchaseArticle({
          articleId: this.article.article_id,
          price: this.article.price
        })
        await this.getPurchaedArticleDetail({ articleId: this.article.article_id })
        window.scrollTo({
          top: 0
        })
        if (status === 'done' || status === 'doing') {
          this.sendNotification({
            text: `記事を購入しました${
              status === 'doing' ? '。購入処理が完了するまで今しばらくお待ち下さい' : ''
            }`
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
      }
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', ['getArticlePrice', 'purchaseArticle', 'getPurchaedArticleDetail']),
    ...mapActions('user', ['setConfirmPurchaseArticleModal'])
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
  }

  .price-box {
    width: 260px;
  }

  .confirm-text {
    font-size: 11px;
  }

  .error-message {
    margin-top: 20px;
    min-height: 14px;
    margin-bottom: 10px;
  }
}
</style>
