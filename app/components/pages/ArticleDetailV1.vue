<template>
  <div class="article-container" :style="eventInfoStyle">
    <app-header ref="detailHeader" class="area-app-header" :class="{ 'is-logged-in': loggedIn }" />
    <div class="area-article v1-content">
      <div class="area-title">
        <div v-if="['crypto', 'game'].includes(article.topic)">
          <nuxt-link :to="eventInfo.eventUrl">
            <div class="event-banner" />
          </nuxt-link>
        </div>
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
    <article-topic-recommended-card-list
      v-if="topicRecommendedArticles.articles.length > 0"
      :articles="topicRecommendedArticles.articles"
    />
    <app-footer ref="appFooter" />
    <article-registration-footer
      v-if="isShowRegistration && !loggedIn"
      ref="registrationFooter"
      :tags="article.tags"
      :topic="article.topic"
      class="area-register-footer is-scroll"
    />
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
import ArticleRegistrationFooter from '../organisms/ArticleRegistrationFooter'
import ArticleCommentForm from '../molecules/ArticleCommentForm'
import ArticleComments from '../organisms/ArticleComments'
import ArticleTopicRecommendedCardList from '../organisms/ArticleTopicRecommendedCardList'
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
    ArticleRegistrationFooter,
    ArticleCommentForm,
    ArticleComments,
    ArticleTopicRecommendedCardList,
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
    },
    topicRecommendedArticles: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      isShowRegistration: false,
      lastScrollY: 0,
      scrollCount: 0,
      detailHeaderEl: null
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

    // scroll イベント発行時に利用するエレメントを定義
    this.detailHeaderEl = this.$refs.detailHeader.$el
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
    eventInfo() {
      return this.eventsInfo.find((eventInfo) => eventInfo.key === 'クリプトモン')
    },
    eventInfoStyle() {
      return {
        '--banner-background': `#fff url(${this.eventInfo.bannerUrl}) no-repeat`,
        '--banner-background-sp': `#fff url(${this.eventInfo.bannerSpUrl}) no-repeat`
      }
    },
    ...mapGetters('article', ['likesCount', 'isLikedArticle', 'eventsInfo']),
    ...mapGetters('user', ['loggedIn', 'currentUser'])
  },
  methods: {
    handleScroll(event) {
      // appHeader
      if (window.scrollY >= this.lastScrollY && window.scrollY > 100 && this.scrollCount >= 10) {
        this.detailHeaderEl.classList.add('is-scroll')
      } else {
        this.detailHeaderEl.classList.remove('is-scroll')
      }
      if (this.scrollCount < 10) this.scrollCount++
      this.lastScrollY = window.scrollY

      // registrationFooter
      if (!this.loggedIn) {
        const registrationFooterEl = this.$refs.registrationFooter.$el
        const registrationFooterRect = registrationFooterEl.getBoundingClientRect()
        const appFooterRect = this.$refs.appFooter.$el.getBoundingClientRect()
        if (registrationFooterRect.top < appFooterRect.top - 80) {
          registrationFooterEl.classList.add('is-scroll')
        } else {
          registrationFooterEl.classList.remove('is-scroll')
        }
      }
    },
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
  grid-template-rows: 100px minmax(0, 1fr) min-content min-content min-content 75px;
  // grid-template-rows: 100px 50px minmax(0, 1fr) 470px 75px;
  grid-template-columns: minmax(0, 1fr) 640px minmax(0, 1fr);
  /* prettier-ignore */
  grid-template-areas:
    'app-header           app-header            app-header          '
    '...                  article               ...                 '
    'article-comments     article-comments      article-comments    '
    'article-comment-form article-comment-form  article-comment-form'
    '...                  recommended-card-list ...                 '
    'app-footer           app-footer            app-footer          ';
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
  grid-template-rows: auto;
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
  .event-banner {
    background: var(--banner-background);
    background-size: 640px auto;
    text-align: center;
    height: 130px;
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

.area-register-footer {
  &.is-scroll {
    transform: none;
  }
}

.sp-footer {
  display: none;
}

@media screen and (max-width: 1080px) {
  .article-container {
    grid-template-rows: 100px minmax(0, 1fr) min-content min-content min-content 75px;
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
    grid-template-rows: 66px minmax(0, 1fr) min-content min-content min-content min-content;
    grid-template-columns: 10px minmax(0, 1fr) 10px;
    /* prettier-ignore */
    grid-template-areas:
    'app-header            app-header            app-header           '
    'article               article               article              '
    'article-comments      article-comments      article-comments     '
    'article-comment-form  article-comment-form  article-comment-form '
    'recommended-card-list recommended-card-list recommended-card-list'
    'app-footer            app-footer            app-footer           ';
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
    .event-banner {
      background: var(--banner-background-sp);
      background-size: 100%;
      height: calc(100vw / 5);
      margin-bottom: 8px;
    }
    .article-title {
      margin: 4px 0;
    }
  }
}
</style>
