<template>
  <div class="area-header" :class="{ 'is-sticky': isCurrentUser }">
    <span class="topic">{{ topic }}</span>
    <template v-if="isCurrentUser">
      <span class="article-status">(公開中)</span>
      <div v-if="isPaidArticle" class="price-label">
        有料：{{ formattedPrice }}ALIS
      </div>
      <div class="article-button" @click="toggleArticlePopup">
        <div v-show="isArticlePopupShown" class="article-popup">
          <nuxt-link
            v-if="isV2Article"
            class="article-popup-content"
            :to="`/me/articles/public/v2/${article.article_id}/edit`"
          >
            編集する
          </nuxt-link>
          <a
            v-else
            class="article-popup-content"
            :class="{ 'hide-article-popup-content': !isV2Article }"
            :href="`/me/articles/public/${article.article_id}/edit`"
          >
            編集する
          </a>
          <span
            class="article-popup-content unpublish-button"
            :class="{ 'show-unpublish-button': isV2Article }"
            @click="unpublish"
          >
            下書きに戻す
          </span>
          <hr v-if="isV2Article" class="separate-line">
          <a
            class="article-popup-content"
            :href="twitterShareUrl"
            target="_blank"
          >Twitterでシェアする</a>
          <a
            class="article-popup-content"
            :href="facebookShareUrl"
            target="_blank"
          >Facebookでシェアする</a>
          <span class="article-popup-content" @click="execCopyUrl">シェア用のURLをコピーする</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="isPaidArticle && !isPurchased" class="price-label">
        有料：{{ formattedPrice }}ALIS
      </div>
      <div v-else class="purchased-label">
        購入済
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { BigNumber } from 'bignumber.js'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { isV2 } from '~/utils/article'

export default {
  props: {
    article: {
      type: Object,
      required: true
    },
    topic: {
      type: String,
      required: false
    },
    isCurrentUser: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isArticlePopupShown: false
    }
  },
  computed: {
    shareUrl() {
      return `https://${process.env.DOMAIN}/${this.article.user_id}/articles/${
        this.article.article_id
      }`
    },
    twitterShareUrl() {
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        this.shareUrl
      )}&text=${encodeURIComponent(`${this.article.title} | ALIS`)}`
    },
    facebookShareUrl() {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.shareUrl)}`
    },
    isV2Article() {
      return isV2(this.article)
    },
    isPaidArticle() {
      return !!this.article.price
    },
    isPurchased() {
      return this.purchasedArticleIds.includes(this.article.article_id)
    },
    formattedPrice() {
      const formatNumber = 10 ** 18
      const price = new BigNumber(this.article.price).div(formatNumber).toString(10)
      return price
    },
    ...mapGetters('article', ['purchasedArticleIds'])
  },
  mounted() {
    this.listen(window, 'click', (event) => {
      if (
        this.$el.querySelector('.article-button') &&
        !this.$el.querySelector('.article-button').contains(event.target)
      ) {
        this.closeEtcPopup()
      }
    })
    this.listen(window, 'touchstart', (event) => {
      if (
        this.$el.querySelector('.article-button') &&
        !this.$el.querySelector('.article-button').contains(event.target)
      ) {
        this.closeEtcPopup()
      }
    })
  },
  destroyed() {
    if (this._eventRemovers) {
      this._eventRemovers.forEach((eventRemover) => {
        eventRemover.remove()
      })
    }
  },
  methods: {
    toggleArticlePopup() {
      this.isArticlePopupShown = !this.isArticlePopupShown
    },
    closeEtcPopup() {
      this.isArticlePopupShown = false
    },
    async unpublish() {
      const articleId = this.article.article_id
      try {
        await this.unpublishPublicArticle({ articleId })
        // 下書きに戻した後に下書き記事ページの記事情報を更新するために location.href を使う
        location.href = `/users/${this.article.user_id}/drafts`
        this.sendNotification({ text: '記事を下書きに戻しました' })
      } catch (e) {
        this.sendNotification({ text: '記事を下書きに戻せませんでした', type: 'warning' })
      }
    },
    execCopyUrl() {
      const copied = this.execCopy(this.shareUrl)
      if (copied) {
        this.sendNotification({ text: 'URLをコピーしました' })
      } else {
        this.sendNotification({ text: 'コピーができませんでした', type: 'warning' })
      }
    },
    execCopy(string) {
      const temp = document.createElement('div')
      temp.appendChild(document.createElement('pre')).textContent = string
      const s = temp.style
      s.position = 'fixed'
      s.left = '-100%'
      document.body.appendChild(temp)
      document.getSelection().selectAllChildren(temp)
      const result = document.execCommand('copy')
      document.body.removeChild(temp)
      return result
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
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', ['unpublishPublicArticle'])
  }
}
</script>

<style lang="scss" scoped>
.area-header {
  grid-area: header;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  height: 31px;
  margin-bottom: -20px;
  z-index: 2;

  .topic {
    color: #5e5e5e;
    font-size: 14px;
    letter-spacing: 0.3px;
    margin-right: 8px;
    word-break: break-all;
  }

  .article-status {
    color: #6e6e6e;
    font-size: 12px;
    font-weight: bold;
    margin-right: auto;
  }

  .article-button {
    background: #fff url('~assets/images/pc/article/icon_etc.png') no-repeat;
    background-size: 24px;
    cursor: pointer;
    position: relative;
    width: 24px;
    height: 26px;
    margin-left: 8px;

    .article-popup {
      background-color: #ffffff;
      border-radius: 4px;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25));
      cursor: default;
      box-sizing: border-box;
      font-size: 14px;
      padding: 8px 16px;
      position: absolute;
      left: -190px;
      top: 24px;
      z-index: 1;

      .article-popup-content {
        color: #6e6e6e;
        cursor: pointer;
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        line-height: 2;
        text-decoration: none;
        user-select: none;
        white-space: nowrap;
        width: 100%;
      }
    }
  }

  .separate-line {
    border: none;
    border-top: solid 1px #cecece;
    height: 1px;
    opacity: 0.3;
  }

  .price-label {
    align-items: center;
    border-radius: 2px;
    border: 1px solid #0086cc;
    box-sizing: border-box;
    color: #0086cc;
    display: flex;
    font-size: 12px;
    font-weight: bold;
    height: 24px;
    margin: 0 0 0 auto;
    padding: 0 6px;
  }

  .purchased-label {
    align-items: center;
    background: rgba(0, 134, 204, 0.3);
    border-radius: 2px;
    box-sizing: border-box;
    color: #fff;
    display: flex;
    font-size: 12px;
    font-weight: bold;
    height: 24px;
    margin: 0 0 0 auto;
    padding: 0 6px;
  }
}

@media screen and (max-width: 640px) {
  .area-header {
    border-bottom: none;
    padding: 0 16px;
    position: relative;

    &.is-sticky {
      position: sticky;
      top: 0;
    }

    &::before {
      content: '';
      position: absolute;
      left: 16px;
      bottom: 0;
      height: 1px;
      width: calc(100% - 16px * 2);
      border-bottom: 1px solid #f0f0f0;
    }

    .article-button {
      .article-popup {
        left: -190px;

        .article-popup-content.unpublish-button {
          display: none;

          &.show-unpublish-button {
            display: block;
          }

          &.hide-article-popup-content {
            display: none;
          }
        }
      }
    }
  }
}
</style>
