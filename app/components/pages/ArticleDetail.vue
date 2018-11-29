<template>
  <div class="article-container">
    <app-header />
    <div class="area-article">
      <no-ssr>
        <div class="area-header" :class="{ 'is-sticky': isCurrentUser }" v-if="topic">
          <span class="topic">{{ topic }}</span>
          <template v-if="isCurrentUser">
            <span class="article-status">(公開中)</span>
            <div class="etc-button" @click="toggleEtcPopup">
              <div class="etc-popup" v-show="isEtcPopupShown">
                <span class="etc-popup-content" @click="unpublish">記事を下書きに戻す</span>
                <a
                  class="etc-popup-content"
                  :href="twitterShareUrl"
                  target="_blank">twitterでシェアする</a>
                <span class="etc-popup-content" @click="execCopyUrl">シェア用のURLをコピーする</span>
              </div>
            </div>
            <a class="edit-article" :href="`/me/articles/public/${this.$route.params.articleId}/edit`">
              編集する
            </a>
          </template>
        </div>
      </no-ssr>
      <h1 class="area-title">{{ decodedTitle }}</h1>
      <div class="area-content" v-html="article.body" />
      <article-tags :tags="article.tags"/>
      <article-footer-actions
        :articleId="article.article_id"
        :articleUserId="article.user_id"
        :likesCount="likesCount"
        :isLikedArticle="isLikedArticle"/>
      <article-side-actions
        :articleId="article.article_id"
        :likesCount="likesCount"
        :isLikedArticle="isLikedArticle"/>
      <article-sub-infos :publishedAt="publishedAt" :tokenAmount="article.alisToken"/>
      <author-info :user="article.userInfo"/>
    </div>
    <article-comments :comments="article.comments"/>
    <article-comment-form/>
    <app-footer/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppHeader from '../organisms/AppHeader'
import ArticleFooterActions from '../atoms/ArticleFooterActions'
import ArticleSideActions from '../atoms/ArticleSideActions'
import ArticleSubInfos from '../atoms/ArticleSubInfos'
import AuthorInfo from '../atoms/AuthorInfo'
import ArticleTags from '../molecules/ArticleTags'
import ArticleCommentForm from '../molecules/ArticleCommentForm'
import ArticleComments from '../organisms/ArticleComments'
import AppFooter from '../organisms/AppFooter'
import { showEmbedTweet, htmlDecode } from '~/utils/article'

export default {
  components: {
    AppHeader,
    ArticleFooterActions,
    ArticleSideActions,
    ArticleSubInfos,
    AuthorInfo,
    ArticleTags,
    ArticleCommentForm,
    ArticleComments,
    AppFooter
  },
  data() {
    return {
      isEtcPopupShown: false
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
    }
  },
  mounted() {
    this.listen(window, 'click', (event) => {
      if (
        this.$el.querySelector('.etc-button') &&
        !this.$el.querySelector('.etc-button').contains(event.target)
      ) {
        this.closeEtcPopup()
      }
    })
    this.listen(window, 'touchstart', (event) => {
      if (
        this.$el.querySelector('.etc-button') &&
        !this.$el.querySelector('.etc-button').contains(event.target)
      ) {
        this.closeEtcPopup()
      }
    })
    const figcaptions = document.querySelectorAll('figcaption')
    figcaptions.forEach((figcaption) => {
      figcaption.removeAttribute('contenteditable')
    })
    showEmbedTweet()
  },
  beforeDestroy() {
    this.resetArticleCommentsLastEvaluatedKey()
  },
  computed: {
    decodedTitle() {
      return htmlDecode(this.article.title)
    },
    publishedAt() {
      return this.article.published_at || this.article.created_at
    },
    isCurrentUser() {
      return this.loggedIn && this.$route.params.user === this.currentUser.userId
    },
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
    ...mapGetters('article', ['likesCount', 'isLikedArticle']),
    ...mapGetters('user', ['loggedIn', 'currentUser'])
  },
  methods: {
    toggleEtcPopup() {
      this.isEtcPopupShown = !this.isEtcPopupShown
    },
    closeEtcPopup() {
      this.isEtcPopupShown = false
    },
    async unpublish() {
      const { articleId } = this.$route.params
      try {
        await this.unpublishPublicArticle({ articleId })
        this.$router.push(`/users/${this.$route.params.user}`)
        this.sendNotification({ text: '記事を下書きに戻しました。' })
      } catch (e) {
        this.sendNotification({ text: '記事を下書きに戻せませんでした。', type: 'warning' })
        console.error(e)
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
    ...mapActions('article', ['resetArticleCommentsLastEvaluatedKey', 'unpublishPublicArticle'])
  }
}
</script>

<style lang="scss" scoped>
.article-container {
  display: grid;
  grid-template-rows: 100px 1fr min-content min-content 75px;
  // grid-template-rows: 100px 50px 1fr 470px 75px;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    'app-header           app-header           app-header      '
    '...                  article              ...             '
    'article-comments     article-comments     article-comments'
    'article-comment-form article-comment-form article-comment-form'
    'app-footer           app-footer           app-footer      ';
  background: white;
  position: relative;
}

.area-article {
  display: grid;
  grid-area: article;
  grid-template-rows: 32px auto;
  grid-template-columns: auto;
  grid-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    'header        '
    'title         '
    'content       '
    'tags          '
    'article-sub-infos'
    'footer-actions'
    'author-info   ';
}

.area-header {
  grid-area: header;
  height: 31px;
  display: flex;
  margin-bottom: -20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  z-index: 2;
  align-items: center;

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

  .etc-button {
    background: #fff url('~assets/images/pc/article/icon_etc.png') no-repeat;
    background-size: 24px;
    cursor: pointer;
    position: relative;
    width: 24px;
    height: 26px;
    margin-right: 20px;

    .etc-popup {
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

      .etc-popup-content {
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

.area-title {
  font-size: 24px;
  grid-area: title;
  letter-spacing: 0.1em;
  line-height: 1.5;
  word-break: break-all;
}

.area-content {
  grid-area: content;
}

.sp-footer {
  display: none;
}

@media screen and (max-width: 1080px) {
  .article-container {
    grid-template-rows: 100px 1fr min-content min-content 75px;
  }
}

@media screen and (max-width: 640px) {
  .article-container {
    grid-template-rows: 66px 1fr min-content min-content min-content;
    grid-template-columns: 10px 1fr 10px;
    /* prettier-ignore */
    grid-template-areas:
    'app-header           app-header           app-header      '
    'article              article              article         '
    'article-comments     article-comments     article-comments'
    'article-comment-form article-comment-form article-comment-form'
    'app-footer           app-footer           app-footer      ';
  }

  .area-article {
    grid-template-columns: 8px auto 8px;
    grid-gap: 10px;
    /* prettier-ignore */
    grid-template-areas:
      'header         header            header        '
      '...            title             ...           '
      '...            content           ...           '
      '...            tags              ...           '
      '...            article-sub-infos ...'
      '...            author-info       ...           '
      'footer-actions footer-actions    footer-actions';
  }

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

  .area-title {
    font-size: 20px;
  }
}
</style>
