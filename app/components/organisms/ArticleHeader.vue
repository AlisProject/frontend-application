<template>
  <div class="area-header" :class="{ 'is-sticky': isCurrentUser }">
    <span class="topic">{{ topic }}</span>
    <template v-if="isCurrentUser">
      <span class="article-status">(公開中)</span>
      <div class="article-button" @click="toggleArticlePopup">
        <div class="article-popup" v-show="isArticlePopupShown">
          <span class="article-popup-content" @click="unpublish">記事を下書きに戻す</span>
          <a
            class="article-popup-content"
            :href="twitterShareUrl"
            target="_blank">twitterでシェアする</a>
          <span class="article-popup-content" @click="execCopyUrl">シェア用のURLをコピーする</span>
        </div>
      </div>
      <a class="edit-article" :href="`/me/articles/public/${article.article_id}/edit`">
        編集する
      </a>
    </template>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  data() {
    return {
      isArticlePopupShown: false
    }
  },
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
        this.$router.push(`/users/${this.article.user_id}`)
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
    margin-right: 20px;

    .article-popup {
      background-color: #ffffff;
      border-radius: 4px;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25));
      cursor: default;
      box-sizing: border-box;
      font-size: 14px;
      padding: 8px 16px;
      position: absolute;
      left: -98px;
      top: 24px;
      z-index: 1;

      &::after {
        border-bottom: 8px solid #fff;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        content: '';
        height: 0;
        padding: 0;
        position: absolute;
        right: 0;
        right: 98px;
        top: -6px;
        width: 0;
      }

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

  .edit-article {
    background: url('~/assets/images/sp/common/icon_editprofile.png') no-repeat;
    background-size: 20px;
    color: #0086cc;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.8;
    padding-left: 24px;
    text-decoration: none;
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
  }
}
</style>
