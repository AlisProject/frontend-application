<template>
  <div class="area-post-article">
    <app-button
      class="nav-link post-article"
      :class="{ disable: !publishable }"
      @click="togglePopup"
    >
      公開する
    </app-button>
    <div v-show="isPopupShown" class="popup">
      <h3 class="headline">
        1. サムネイルの選択
      </h3>
      <div class="thumbnails">
        <span v-if="suggestedThumbnails.length === 0" class="no-thumbnail-message">
          画像がありません
        </span>
        <div
          v-for="img in suggestedThumbnails"
          :key="img"
          class="thumbnail-box"
          :class="{ selected: img === thumbnail }"
          @click.prevent="selectThumbnail"
        >
          <img :src="img" class="thumbnail" alt="Thumbnail">
        </div>
      </div>
      <h3 class="headline">
        2. カテゴリの設定
      </h3>
      <div class="article-type-select-box">
        <no-ssr>
          <select
            required
            class="article-type-select"
            :value="topicType"
            @change="handleChangeTopicType"
          >
            <option value="" disabled selected class="placeholder">
              選択してください
            </option>
            <option v-for="topic in topics" :value="topic.name">
              {{ topic.display_name }}
            </option>
          </select>
        </no-ssr>
      </div>
      <h3 class="headline">
        3. タグの設定
      </h3>
      <tags-input-form @change-tag-validation-state="onChangeTagValidationState" />
      <h3 class="headline">
        4. 販売設定
      </h3>
      <div class="select-payment-box">
        <div class="payment-input-box">
          <input id="free" v-model="paymentType" class="payment-input" type="radio" value="free">
          <label class="payment-input-label" for="free">
            無料
          </label>
        </div>
        <div class="payment-input-box">
          <input id="pay" v-model="paymentType" class="payment-input" type="radio" value="pay">
          <label class="payment-input-label" for="pay">
            有料
          </label>
        </div>
      </div>
      <span v-if="paymentType === 'pay'" class="description">
        販売金額の10%が<a
          href="https://intercom.help/alismedia/%E3%81%9D%E3%81%AE%E4%BB%96-%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B/%E3%83%90%E3%83%BC%E3%83%B3%E3%81%A8%E3%81%AF"
          class="link"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >バーン</a>されます
      </span>
      <div v-if="paymentType === 'pay'" class="token-amount-input-box">
        <input
          :value="price"
          class="token-amount-input"
          type="number"
          min="1"
          max="10000"
          @input="onInput"
          @keydown.69.prevent
          @keydown.187.prevent
          @keydown.189.prevent
        >
        <span class="token-amount-input-unit">ALIS</span>
        <span class="error-message">
          {{ errorMessage }}
        </span>
      </div>
      <app-button
        class="submit"
        :class="{ pay: paymentType === 'pay' }"
        :disabled="!publishable || hasPriceError"
        @click="publish"
      >
        {{ paymentType === 'pay' ? '有料エリアを設定する' : '公開する' }}
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { BigNumber } from 'bignumber.js'
import AppButton from '../atoms/AppButton'
import TagsInputForm from '../molecules/TagsInputForm'
import { getThumbnails } from '~/utils/article'

const MAXIMUM_PRICE = '10000'
const MINIMUM_PRICE = '1'

export default {
  components: {
    AppButton,
    TagsInputForm
  },
  data() {
    return {
      publishingArticle: false,
      isPopupShown: false,
      isThumbnailSelected: false,
      isInvalidTag: false,
      paymentType: 'free',
      price: '1',
      errorMessage: ''
    }
  },
  async created() {
    try {
      await this.getTopics()
    } catch (error) {
      this.sendNotification({
        text: 'エラーが発生しました。しばらく時間を置いて再度お試しください',
        type: 'warning'
      })
    }
  },
  mounted() {
    if (this.currentPrice) {
      this.paymentType = 'pay'
      const formatNumber = 10 ** 18
      const currentPrice = new BigNumber(this.currentPrice).div(formatNumber).toString(10)
      this.price = currentPrice
    }
    this.listen(window, 'click', (event) => {
      const target = event.target
      // タグの ☓ ボタンやオートコンプリートのタグを押したときにはポップアップを非表示にしない。
      const isClickedTagRemoveButton = target.classList.contains('ti-icon-close')
      const isClickedAutocompletedTag =
        target.classList.value === '' && target.dataset && target.dataset.count
      if (!this.$el.contains(target) && !isClickedTagRemoveButton && !isClickedAutocompletedTag) {
        this.closePopup()
      }
    })
  },
  destroyed() {
    this.resetCurrentPrice()
    if (this._eventRemovers) {
      this._eventRemovers.forEach((eventRemover) => {
        eventRemover.remove()
      })
    }
  },
  methods: {
    async publish() {
      try {
        // 「公開する」ボタンを押した瞬間はisInvalidTagの値が更新されないため、
        // isInvalidTagの状態が更新されるまで待つ
        await this.$nextTick()

        if (!this.publishable || this.isInvalidTag) return
        this.publishingArticle = true
        const { articleId, title, body, topicType, price } = this
        const hasTitle = title !== undefined && title !== null && title !== ''
        const hasBody = body !== '<p>&nbsp;</p>'
        if (!hasTitle) this.sendNotification({ text: 'タイトルを入力してください' })
        if (!hasBody) this.sendNotification({ text: '本文にテキストを入力してください' })
        if (topicType === null) this.sendNotification({ text: 'カテゴリを選択してください' })
        if (!hasTitle || !hasBody || topicType === null) {
          this.publishingArticle = false
          return
        }

        if (this.paymentType === 'pay') {
          this.setSelectPayment({ title, body, price })
          if (location.href.includes('/me/articles/draft')) {
            this.$router.push(`/me/articles/draft/${this.articleId}/paypart`)
          } else if (location.href.includes('/me/articles/public')) {
            this.$router.push(`/me/articles/public/${this.$route.params.articleId}/paypart`)
          }
          this.publishingArticle = false
          return
        }

        const articleTitle = { title }
        const articleBody = { body }
        // タグのデータ形式をAPIに適するように整形
        const tags = this.tags.map((tag) => tag.text)

        if (
          location.href.includes('/me/articles/draft') ||
          location.href.includes('/me/articles/new')
        ) {
          await this.putDraftArticleTitle({ articleTitle, articleId })
          await this.putDraftArticleBody({ articleBody, articleId })
          await this.publishDraftArticleWithHeader({
            articleId,
            topic: topicType,
            tags,
            eyeCatchUrl: this.thumbnail
          })
        } else if (location.href.includes('/me/articles/public')) {
          await this.putPublicArticleTitle({ articleTitle, articleId })
          await this.putPublicArticleBody({ articleBody, articleId })
          await this.republishPublicArticleWithHeader({
            articleId,
            topic: topicType,
            tags,
            eyeCatchUrl: this.thumbnail
          })
        }
        this.$router.push(`/${this.currentUserInfo.user_id}/articles/${articleId}`)
        this.sendNotification({ text: '記事を公開しました' })
        this.resetArticleTopic()

        if (!this.currentUserInfo.is_created_article) {
          this.setFirstProcessModal({ isShow: true })
          this.setFirstProcessCreatedArticleModal({ isShow: true })
        }
      } catch (e) {
        this.publishingArticle = false
        this.sendNotification({ text: '記事の公開に失敗しました', type: 'warning' })
        console.error(e)
      }
    },
    togglePopup() {
      if (!this.publishable) return
      this.setThumbnails()
      this.isPopupShown = !this.isPopupShown
    },
    closePopup() {
      this.isPopupShown = false
    },
    selectThumbnail({ target }) {
      this.isThumbnailSelected = true
      this.updateThumbnail({ thumbnail: target.src === this.thumbnail ? '' : target.src })
    },
    listen(target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove: function() {
          target.removeEventListener(eventType, callback)
        }
      })
    },
    handleChangeTopicType(event) {
      this.topic = event.target.value
      this.setArticleTopic({ topicType: this.topic })
    },
    onChangeTagValidationState(isInvalid) {
      this.isInvalidTag = isInvalid
    },
    setThumbnails() {
      const images = Array.from(document.querySelectorAll('figure img'))
      const thumbnails = getThumbnails(images)
      this.updateSuggestedThumbnails({ thumbnails })
      if (!thumbnails.includes(this.thumbnail)) {
        this.updateThumbnail({ thumbnail: '' })
      }
    },
    onInput(event) {
      try {
        this.price = event.target.value

        const formattedPrice = new BigNumber(this.price)
        const formattedMaxPrice = new BigNumber(MAXIMUM_PRICE)
        const formattedMinPrice = new BigNumber(MINIMUM_PRICE)
        const hasExceededMaxPrice = formattedPrice.isGreaterThan(formattedMaxPrice)
        const hasNotExceededMinPrice = formattedPrice.isLessThan(formattedMinPrice)

        if (!formattedPrice.isInteger()) {
          this.errorMessage = '整数で入力してください'
          return
        }
        if (hasExceededMaxPrice || hasNotExceededMinPrice) {
          this.errorMessage = '10,000ALIS以内で入力してください'
          return
        }
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = '数字で入力してください'
      }
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', [
      'updateThumbnail',
      'publishDraftArticleWithHeader',
      'republishPublicArticleWithHeader',
      'putDraftArticleTitle',
      'putDraftArticleBody',
      'putPublicArticleTitle',
      'putPublicArticleBody',
      'updateSuggestedThumbnails',
      'postArticleImage',
      'updateBody',
      'setIsSaving',
      'getTopics',
      'resetArticleTopic',
      'setArticleTopic',
      'resetCurrentPrice'
    ]),
    ...mapActions('user', [
      'setFirstProcessModal',
      'setFirstProcessCreatedArticleModal',
      'setSelectPayment'
    ])
  },
  computed: {
    publishable() {
      return (
        (!this.isEditedTitle || !this.isEditedBody) &&
        !this.isSaving &&
        !this.isInvalidTag &&
        !this.publishingArticle
      )
    },
    hasPriceError() {
      return this.paymentType === 'pay' && this.errorMessage !== ''
    },
    ...mapGetters('article', [
      'articleId',
      'title',
      'body',
      'thumbnail',
      'suggestedThumbnails',
      'isSaving',
      'isEditedTitle',
      'isEditedBody',
      'topics',
      'topicType',
      'tags',
      'currentPrice'
    ]),
    ...mapGetters('user', ['currentUserInfo', 'selectPayment'])
  },
  watch: {
    suggestedThumbnails() {
      if (this.thumbnail !== '') return
      if (!this.isThumbnailSelected) {
        this.updateThumbnail({ thumbnail: this.suggestedThumbnails[0] })
        return
      }
      if (
        this.isThumbnailSelected &&
        Array.from(document.querySelectorAll('.thumbnails img')).filter(
          (img) => img.classList.contains('selected').length !== 0
        )
      ) {
        this.updateThumbnail({ thumbnail: this.suggestedThumbnails[0] })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #929292;
}

.area-post-article {
  grid-area: post-article;
  position: relative;
  display: flex;
  align-self: center;
  justify-content: center;

  .post-article {
    border-radius: 4px;
    border-radius: 4px;
    box-shadow: none;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 100;
    height: 34px;
    line-height: 2.5;
    text-align: center;
    width: 96px;

    &:hover,
    &:focus {
      background: #0086cc;
    }

    &.disable {
      cursor: not-allowed;
    }
  }

  .popup {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.5);
    box-sizing: border-box;
    padding: 40px;
    position: absolute;
    top: 50px;
    width: 340px;
    z-index: 1;

    .headline {
      color: #000000;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.8px;
      margin: 0 0 10px;
      text-align: left;
    }

    .thumbnails {
      overflow-x: scroll;
      overflow-y: hidden;
      white-space: nowrap;
      margin-bottom: 10px;
      user-select: none;
      height: 100px;

      &::-webkit-scrollbar {
        height: 20px;
      }

      &::-webkit-scrollbar-thumb {
        /* スクロールバーをドラッグしやすくするため、スクロールバー領域を広めにとる */
        background: linear-gradient(
          0deg,
          transparent 0%,
          transparent 70%,
          #0086cc 70%,
          #0086cc 80%,
          transparent 80%,
          transparent 100%
        );
      }

      .no-thumbnail-message {
        font-size: 14px;
        margin-top: 40px;
        display: block;
      }

      .thumbnail-box {
        display: inline-block;
        box-sizing: border-box;
        width: 80px;
        margin-right: 20px;
        height: 80px;

        .thumbnail {
          box-sizing: border-box;
          cursor: pointer;
          height: 80px;
          width: 80px;
          object-fit: cover;
        }

        &:last-child {
          margin-right: 0;
        }
      }

      .selected {
        position: relative;

        &:before {
          background-color: rgba(2, 134, 204, 0.5);
          content: ' ';
          cursor: pointer;
          display: block;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 80px;
          z-index: 0;
        }

        &:after {
          bottom: 8px;
          color: #fff;
          content: '選択中';
          font-size: 14px;
          font-weight: bold;
          left: 0;
          letter-spacing: 0.8px;
          position: absolute;
          right: 0;
        }
      }
    }

    .article-type-select-box {
      box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);
      margin-bottom: 30px;
      padding: 6px 8px;
      position: relative;

      &::after,
      &::before {
        position: absolute;
        right: 8px;
        width: 0;
        height: 0;
        padding: 0;
        content: '';
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        pointer-events: none;
      }

      &::after {
        top: 7px;
        border-bottom: 8px solid #0086cc;
      }

      &::before {
        top: 17px;
        border-top: 8px solid #0086cc;
      }

      .article-type-select {
        appearance: none;
        background-image: none;
        background: transparent;
        border: none;
        box-shadow: none;
        color: #000;
        cursor: pointer;
        font-size: 14px;
        outline: none;
        padding-right: 1em;
        text-indent: 0.01px;
        text-overflow: ellipsis;
        width: 100%;

        .placeholder {
          display: none;
        }

        &::-ms-expand {
          display: none;
        }
      }
    }

    .select-payment-box {
      display: flex;
      flex-direction: row;

      .payment-input-box {
        color: #030303;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 14px;
        min-height: 20px;

        .payment-input {
          opacity: 0;
          position: absolute;

          & + .payment-input-label {
            cursor: pointer;
            padding: 0 20px 0 30px;
            position: relative;
            line-height: 20px;
            display: block;
            width: 28px;

            &::before {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              width: 20px;
              height: 20px;
              border: 1px solid #0086cc;
              border-radius: 50%;
              box-sizing: border-box;
            }
          }

          &:checked + .payment-input-label {
            &::after {
              content: '';
              display: block;
              position: absolute;
              top: 4px;
              left: 4px;
              width: 12px;
              height: 12px;
              background: #0086cc;
              border-radius: 50%;
            }
          }
        }
      }
    }

    .description {
      color: #6e6e6e;
      display: block;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.8px;
      margin-bottom: 10px;
      text-align: left;

      .link {
        color: #0086cc;
        font-size: 12px;
        text-decoration: none;
      }
    }

    .token-amount-input-box {
      position: relative;

      .token-amount-input {
        appearance: none;
        border: 0;
        box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);
        box-sizing: border-box;
        color: #030303;
        font-size: 14px;
        line-height: 28px;
        padding: 10px 40px 10px 12px;
        width: 256px;
        margin-bottom: 4px;

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
        }
      }

      .token-amount-input-unit {
        position: absolute;
        color: #030303;
        font-size: 10px;
        font-weight: bold;
        top: 19px;
        right: 10px;
      }
    }

    .error-message {
      color: #f06273;
      display: block;
      font-size: 12px;
      margin-bottom: 2px;
      min-height: 38px;
      text-align: left;
    }

    .submit {
      margin: 26px auto 0;

      &.pay {
        margin-top: 0;
      }
    }
  }
}

@-moz-document url-prefix() {
  .article-type-select-box {
    &::after {
      top: 15px !important;
    }

    &::before {
      top: 25px !important;
    }
  }
}

@media screen and (max-width: 550px) {
  .nav-link {
    font-size: 12px;
    line-height: 30px;
    text-align: center;
  }
}
</style>
