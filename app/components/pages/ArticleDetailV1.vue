<template>
  <div class="article-container">
    <app-header ref="detailHeader" class="area-app-header" :class="{ 'is-logged-in': loggedIn }" />
    <div class="area-article v1-content">
      <div class="area-title">
        <nuxt-link class="topic-link" :to="`/articles/popular?topic=${article.topic}`">
          {{ topic }}
        </nuxt-link>
        <h1 class="article-title">
          {{ decodedTitle }}
        </h1>
      </div>
      <no-ssr>
        <article-header :article="article" :topic="topic" :is-current-user="isCurrentUser" />
      </no-ssr>
      <author-header-info :article="article" :publishedAt="publishedAt" />
      <div class="area-content" v-html="article.body" />
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
      <article-sub-infos :published-at="publishedAt" :token-amount="article.alisToken" />
      <article-registration v-if="isShowRegistration && !loggedIn" />
      <author-info
        :user="article.userInfo"
        class="area-authr-info"
        :class="{ 'is-logged-in': loggedIn }"
      />
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
import AppHeader from '../organisms/AppHeader'
import ArticleHeader from '../organisms/ArticleHeader'
import ArticleFooterActions from '../atoms/ArticleFooterActions'
import ArticleSideActions from '../atoms/ArticleSideActions'
import ArticleSubInfos from '../atoms/ArticleSubInfos'
import AuthorInfo from '../atoms/AuthorInfo'
import AuthorHeaderInfo from '../atoms/AuthorHeaderInfo'
import UserArticlePopularCardList from '../organisms/UserArticlePopularCardList'
import ArticleTags from '../molecules/ArticleTags'
import ArticleRegistration from '../organisms/ArticleRegistration'
import ArticleCommentForm from '../molecules/ArticleCommentForm'
import ArticleComments from '../organisms/ArticleComments'
import AppFooter from '../organisms/AppFooter'
import { showEmbedTweet, htmlDecode } from '~/utils/article'

export default {
  components: {
    AppHeader,
    ArticleHeader,
    ArticleFooterActions,
    ArticleSideActions,
    ArticleSubInfos,
    AuthorInfo,
    AuthorHeaderInfo,
    UserArticlePopularCardList,
    ArticleTags,
    ArticleRegistration,
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
  data() {
    return {
      isShowRegistration: false,
      lastScrollY: 0,
      scrollCount: 0
    }
  },
  mounted() {
    const figcaptions = document.querySelectorAll('figcaption')
    figcaptions.forEach((figcaption) => {
      figcaption.removeAttribute('contenteditable')
    })
    showEmbedTweet()
    // header scroll
    window.addEventListener('scroll', this.handleScroll)
    // ちらつきを抑えるため mouted 後に表示
    this.isShowRegistration = true
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
    ...mapGetters('article', ['likesCount', 'isLikedArticle']),
    ...mapGetters('user', ['loggedIn', 'currentUser'])
  },
  methods: {
    handleScroll(event) {
      const headerElement = this.$refs.detailHeader.$el
      if (window.scrollY >= this.lastScrollY && window.scrollY > 100 && this.scrollCount >= 10) {
        headerElement.classList.add('is-scroll')
      } else {
        headerElement.classList.remove('is-scroll')
      }
      if (this.scrollCount < 10) this.scrollCount++
      this.lastScrollY = window.scrollY
    },
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

header.area-app-header {
  background-color: white;
  height: 100px;
  max-width: 100%;
  width: 100%;
  position: fixed;
  transition: 0.5s;
  /deep/ a.logo-link {
    position: absolute;
    left: calc(50% - 540px);
  }
  /deep/ .session-items {
    position: absolute;
    left: calc(50% + 277px);
  }
  /deep/ .menu {
    right: auto;
    left: -100px;
  }
  &.is-logged-in /deep/ .session-items {
    left: calc(50% + 366px);
  }
  &.is-scroll {
    transform: translateY(-100%);
    /deep/ .modal {
      &-mask {
        top: 100px;
      }
    }
  }
}

.area-article {
  display: grid;
  grid-area: article;
  grid-template-rows: 32px auto;
  grid-template-columns: auto;
  grid-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    'title                         '
    'header                        '
    'author-header-info            '
    'content                       '
    'tags                          '
    'article-sub-infos             '
    'footer-actions                '
    'article-registration          '
    'author-info                   '
    'user-article-popular-card-list';
}

.area-title {
  grid-area: title;
  .topic-link {
    border-bottom: solid 1px transparent;
    color: #6e6e6e;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: all 400ms ease;
    height: 16px;
    margin-right: 20px;
    white-space: nowrap;

    &:hover {
      border-bottom: solid 1px #6e6e6e;
    }
  }
  .article-title {
    color: #333;
    font-size: 24px;
    letter-spacing: 0.02em;
    line-height: 1.5;
    margin: 4px 0 -24px;
    word-break: break-all;
  }
}

.area-authr-info {
  &.is-logged-in {
    margin-top: -30px;
  }
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
  header.area-app-header {
    /deep/ a.logo-link {
      position: absolute;
      left: 34px;
    }
    /deep/ .session-items {
      position: absolute;
      left: auto;
      right: 34px;
    }
    &.is-logged-in /deep/ .session-items {
      left: auto;
    }
  }
}

@media screen and (max-width: 920px) {
  header.area-app-header {
    /deep/ a.logo-link {
      position: absolute;
      left: 12px;
    }
    /deep/ .session-items {
      position: absolute;
      left: auto;
      right: 12px;
    }
    /deep/ .menu {
      right: 0;
      left: auto;
    }
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

  header.area-app-header {
    height: 66px;
    &.is-scroll {
      /deep/ .modal {
        &-mask {
          top: 66px;
        }
      }
    }
  }

  .area-article {
    grid-template-columns: 8px auto 8px;
    grid-gap: 10px;
    /* prettier-ignore */
    grid-template-areas:
      '...            title                           ...           '
      'header         header                          header        '
      '...            author-header-info              ...           '
      '...            content                         ...           '
      '...            tags                            ...           '
      '...            article-sub-infos               ...           '
      'footer-actions footer-actions                  footer-actions'
      '...            article-registration            ...           '
      '...            author-info                     ...           '
      '...            user-article-popular-card-list  ...           ';
  }

  .area-title {
    font-size: 20px;
    margin: 6px 0 -6px;
  }
}
</style>
