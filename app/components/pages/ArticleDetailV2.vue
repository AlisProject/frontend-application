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
      <div class="area-content ck-content" v-html="body" />
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
      <article-sub-infos-v2 :article="article" :publishedAt="publishedAt" />
      <author-info :user="article.userInfo" />
      <user-article-popular-card-list
        v-if="userPopularArticles.articles.length > 0"
        :articles="userPopularArticles.articles"
      />
    </div>
    <article-comments :comments="article.comments" />
    <article-comment-form />
    <app-footer />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import hljs from 'highlight.js'
import cheerio from 'cheerio'
import AppHeader from '../organisms/AppHeader'
import ArticleHeader from '../organisms/ArticleHeader'
import ArticleFooterActions from '../atoms/ArticleFooterActions'
import ArticleSideActions from '../atoms/ArticleSideActions'
import ArticleSubInfosV2 from '../organisms/ArticleSubInfosV2'
import AuthorInfo from '../atoms/AuthorInfo'
import UserArticlePopularCardList from '../organisms/UserArticlePopularCardList'
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
    UserArticlePopularCardList,
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
    },
    userPopularArticles: {
      type: Object,
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
    body() {
      let highlightedArticleBody = this.article.body
      try {
        const $ = cheerio.load(`<div id="outerHTML">${this.article.body}</div>`)
        $('code').each(function() {
          const language = $(this)
            .attr('class')
            .split('-')
            .slice(1)
            .join('-')
          $(this).html(htmlDecode(hljs.highlight(language, $(this).html()).value))
        })
        highlightedArticleBody = $('#outerHTML').html()
      } catch (e) {
        /* 記事のパースでエラーが起きた場合元のbodyをそのまま返す */
      }
      return highlightedArticleBody
    },
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
    ...mapActions('article', ['resetArticleCommentsLastEvaluatedKey', 'postPv']),
    ...mapActions('user', ['resetUserPopularArticles'])
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
  grid-template-rows: 100px minmax(0, 1fr) min-content min-content 75px;
  // grid-template-rows: 100px 50px minmax(0, 1fr) 470px 75px;
  grid-template-columns: minmax(0, 1fr) 640px minmax(0, 1fr);
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
    'header                        '
    'title                         '
    'content                       '
    'tags                          '
    'article-sub-infos             '
    'footer-actions                '
    'author-info                   '
    'user-article-popular-card-list';

  &.is-show-paypart {
    /* prettier-ignore */
    grid-template-areas:
    'header                        '
    'title                         '
    'content                       '
    'paypart                       '
    'tags                          '
    'article-sub-infos             '
    'footer-actions                '
    'author-info                   '
    'user-article-popular-card-list';
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
    grid-template-rows: 100px minmax(0, 1fr) min-content min-content 75px;
  }
}

@media screen and (max-width: 640px) {
  .article-container {
    grid-template-rows: 66px minmax(0, 1fr) min-content min-content min-content;
    grid-template-columns: 10px minmax(0, 1fr) 10px;
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
      'header         header                          header        '
      '...            title                           ...           '
      '...            content                         ...           '
      '...            tags                            ...           '
      '...            article-sub-infos               ...           '
      '...            author-info                     ...           '
      '...            user-article-popular-card-list  ...           '
      'footer-actions footer-actions                  footer-actions';

    &.is-show-paypart {
      /* prettier-ignore */
      grid-template-areas:
        'header         header                         header        '
        '...            title                          ...           '
        '...            content                        ...           '
        'paypart        paypart                        paypart       '
        '...            tags                           ...           '
        '...            article-sub-infos              ...           '
        '...            author-info                    ...           '
        '...            user-article-popular-card-list ...           '
        'footer-actions footer-actions                 footer-actions';
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
