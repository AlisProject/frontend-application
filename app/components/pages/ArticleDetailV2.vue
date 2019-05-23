<template>
  <div class="article-container">
    <app-header />
    <div class="area-article v2-content" :class="{ 'is-show-paypart': isShowPaypart }">
      <no-ssr>
        <article-header :article="article" :topic="topic" :is-current-user="isCurrentUser" />
      </no-ssr>
      <h1 class="area-title">
        {{ decodedTitle }}
      </h1>
      <div class="area-content ck-content" v-html="article.body" />
      <no-ssr>
        <article-detail-paypart v-if="isShowPaypart" :article="article" />
      </no-ssr>
      <article-tags :tags="article.tags" />
      <article-footer-actions
        :article-id="article.article_id"
        :article-user-id="article.user_id"
        :likes-count="likesCount"
        :is-liked-article="isLikedArticle"
      />
      <article-side-actions
        :article-id="article.article_id"
        :likes-count="likesCount"
        :is-liked-article="isLikedArticle"
      />
      <article-sub-infos-v2
        :articleId="article.article_id"
        :articleUserId="article.user_id"
        :publishedAt="publishedAt"
        :tokenAmount="article.alisToken"
      />
      <author-info :user="article.userInfo" />
    </div>
    <article-comments :comments="article.comments" />
    <article-comment-form />
    <app-footer />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import ArticleHeader from '../organisms/ArticleHeader'
import ArticleFooterActions from '../atoms/ArticleFooterActions'
import ArticleSideActions from '../atoms/ArticleSideActions'
import ArticleSubInfosV2 from '../organisms/ArticleSubInfosV2'
import AuthorInfo from '../atoms/AuthorInfo'
import ArticleTags from '../molecules/ArticleTags'
import ArticleDetailPaypart from '../organisms/ArticleDetailPaypart'
import ArticleCommentForm from '../molecules/ArticleCommentForm'
import ArticleComments from '../organisms/ArticleComments'
import AppFooter from '../organisms/AppFooter'
import { htmlDecode, showEmbed } from '~/utils/article'

export default {
  components: {
    AppHeader,
    ArticleHeader,
    ArticleFooterActions,
    ArticleSideActions,
    ArticleSubInfosV2,
    AuthorInfo,
    ArticleTags,
    ArticleDetailPaypart,
    ArticleCommentForm,
    ArticleComments,
    AppFooter
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
    showEmbed()
    const paywallLine = document.querySelector('.paywall-line')
    if (!paywallLine) return
    paywallLine.innerHTML = `これより上のエリアが<span class="br" />無料で表示されます`
    if (this.isPurchased) paywallLine.remove()
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
      return this.loggedIn && this.$route.params.userId === this.currentUser.userId
    },
    isPurchased() {
      return this.purchasedArticleIds.includes(this.article.article_id)
    },
    isShowPaypart() {
      return !!this.article.price && !this.isPurchased && !this.isCurrentUser
    },
    ...mapGetters('article', ['likesCount', 'isLikedArticle', 'purchasedArticleIds']),
    ...mapGetters('user', ['loggedIn', 'currentUser'])
  },
  methods: {
    ...mapActions('article', ['resetArticleCommentsLastEvaluatedKey', 'postPv'])
  },
  watch: {
    loggedIn(newState) {
      if (newState && this.currentUser.phoneNumberVerified) {
        this.postPv({ articleId: this.$route.params.articleId })
      }
    }
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

  &.is-show-paypart {
    /* prettier-ignore */
    grid-template-areas:
    'header        '
    'title         '
    'content       '
    'paypart       '
    'tags          '
    'article-sub-infos'
    'footer-actions'
    'author-info   ';
  }
}

.area-title {
  grid-area: title;
  color: #333;
  font-size: 24px;
  letter-spacing: 0.02em;
  line-height: 1.5;
  margin: 2px 0 -24px;
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

    &.is-show-paypart {
      /* prettier-ignore */
      grid-template-areas:
        'header         header            header        '
        '...            title             ...           '
        '...            content           ...           '
        'paypart        paypart           paypart       '
        '...            tags              ...           '
        '...            article-sub-infos ...'
        '...            author-info       ...           '
        'footer-actions footer-actions    footer-actions';
    }
  }

  .area-title {
    font-size: 20px;
    margin: 6px 0 -6px;
  }
}
</style>

<style lang="scss">
.v2-content {
  .ck-content {
    p {
      &.paywall-line {
        color: #030303;
        position: relative;
        padding: 0 120px;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 30px;
        clear: both;

        &:before,
        &:after {
          content: '...........';
          display: inline-block;
          font-size: 14px;
          height: 2px;
          letter-spacing: 8px;
          position: absolute;
          top: -5px;
          width: 140px;
        }

        &:before {
          left: 0;
        }

        &:after {
          right: -8px;
        }
      }
    }
  }
}

@media screen and (max-width: 640px) {
  .v2-content {
    .ck-content {
      p {
        .br {
          &:before {
            content: '\A';
            white-space: pre;
          }
        }

        &.paywall-line {
          color: #030303;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 0.8px;
          line-height: 1.5;
          margin-bottom: 20px;
          padding: 0;
          text-align: center;

          &:before,
          &:after {
            content: '.....';
            top: 2px;
            width: 80px;
          }

          &:before {
            left: -10px;
          }

          &:after {
            right: -10px;
          }
        }
      }
    }
  }
}
</style>
