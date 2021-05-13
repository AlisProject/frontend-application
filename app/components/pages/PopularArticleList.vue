<template>
  <div
    class="popular-article-list-container"
    :class="{ 'with-notices': isWithNotices, 'with-ranking': isWithRanking }"
  >
    <app-header />
    <default-header-nav />
    <category-notices v-if="$route.query.topic === 'game'" />
    <coin-ranking-top v-if="$route.query.topic === 'crypto'" />
    <article-type-select-nav />
    <article-card-list :articles="popularArticles" />
    <the-loader :is-loading="!isLastPage" />
    <app-footer />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import DefaultHeaderNav from '../molecules/DefaultHeaderNav'
import CategoryNotices from '../organisms/CategoryNotices'
import CoinRankingTop from '../organisms/CoinRankingTop'
import ArticleTypeSelectNav from '../organisms/ArticleTypeSelectNav'
import ArticleCardList from '../organisms/ArticleCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable, isScrollBottom } from '~/utils/client'

export default {
  components: {
    AppHeader,
    DefaultHeaderNav,
    CategoryNotices,
    CoinRankingTop,
    ArticleTypeSelectNav,
    ArticleCardList,
    TheLoader,
    AppFooter
  },
  data() {
    return {
      isFetchingArticles: false,
      topicNumber: 1
    }
  },
  computed: {
    isWithNotices() {
      return this.$route.query.topic === 'game'
    },
    isWithRanking() {
      return this.$route.query.topic === 'crypto'
    },
    ...mapGetters('article', ['popularArticles', 'isLastPage', 'topics']),
    ...mapGetters('user', ['loggedIn', 'currentUser']),
    ...mapGetters('presentation', ['articleListScrollHeight'])
  },
  async mounted() {
    await this.getMuteUsers()
    await this.getPopularArticles({ topic: this.$route.query.topic })
    window.addEventListener('scroll', this.infiniteScroll)

    // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
    // 画面の高さに合うまで要素を取得する。

    // 画面の高さに合っているかをスクロールできるかどうかで判定
    if (!isPageScrollable(this.$el)) {
      if (this.isLastPage) return
      this.getPopularArticles({ topic: this.$route.query.topic })
    }
    if (this.articleListScrollHeight) {
      this.$el.scrollTop = this.articleListScrollHeight
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.infiniteScroll)
    this.setArticleListScrollHeight({ scrollHeight: this.$el.scrollTop })
  },
  methods: {
    async infiniteScroll(event) {
      if (this.isFetchingArticles) return
      try {
        this.isFetchingArticles = true

        if (this.isLastPage || !isScrollBottom()) return

        await this.getPopularArticles({ topic: this.$route.query.topic || 'crypto' })
      } finally {
        this.isFetchingArticles = false
      }
    },
    moveToNewArticlePage() {
      if (!this.loggedIn) {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleCreate' })
        return
      }
      if (!this.currentUser.phoneNumberVerified) {
        this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleCreate' })
        this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
        return
      }
      location.href = '/me/articles/new'
    },
    ...mapActions('article', ['getPopularArticles', 'resetArticleData', 'setTopicDisplayName']),
    ...mapActions('user', [
      'setRequestLoginModal',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal',
      'getMuteUsers'
    ]),
    ...mapActions('presentation', ['setArticleListScrollHeight'])
  },
  watch: {
    async popularArticles() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態なるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (isPageScrollable(this.$el) || this.isLastPage || this.popularArticles.length === 0) return
      this.getPopularArticles({ topic: this.$route.query.topic })
    },
    $route(to) {
      this.resetArticleData()
      this.setTopicDisplayName({ topicName: to.query.topic })
      this.getPopularArticles({ topic: to.query.topic })
    }
  }
}
</script>

<style lang="scss" scoped>
.popular-article-list-container {
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header              app-header              app-header             "
    "nav                     nav                     nav                    "
    "article-type-select-nav article-type-select-nav article-type-select-nav"
    "...                     article-card-list       ...                    "
    "...                     loader                  ...                    "
    "app-footer              app-footer              app-footer             ";
  grid-template-columns: minmax(0, 1fr) 1080px minmax(0, 1fr);
  grid-template-rows: 100px auto 84px minmax(0, 1fr) 75px 75px;
  min-height: 100vh;
}

.popular-article-list-container.with-notices {
  /* prettier-ignore */
  grid-template-areas:
    "app-header              app-header              app-header             "
    "nav                     nav                     nav                    "
    "...                     notices                 ...                    "
    "article-type-select-nav article-type-select-nav article-type-select-nav"
    "...                     ...                     ...                    "
    "...                     article-card-list       ...                    "
    "...                     loader                  ...                    "
    "app-footer              app-footer              app-footer             ";
  grid-template-rows: 100px auto 36px 49px 17.5px minmax(0, 1fr) 75px 75px;
}

.popular-article-list-container.with-ranking {
  /* prettier-ignore */
  grid-template-areas:
    "app-header              app-header              app-header             "
    "nav                     nav                     nav                    "
    "...                     ranking                 ...                    "
    "article-type-select-nav article-type-select-nav article-type-select-nav"
    "...                     ...                     ...                    "
    "...                     article-card-list       ...                    "
    "...                     loader                  ...                    "
    "app-footer              app-footer              app-footer             ";
  grid-template-rows: 100px auto auto 49px 17.5px minmax(0, 1fr) 75px 75px;
}

.is-fixed-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
}

.coin-ranking {
  margin-top: 5px;
}

@media screen and (max-width: 1296px) {
  .popular-article-list-container {
    grid-template-columns: minmax(0, 1fr) 710px minmax(0, 1fr);
    /* prettier-ignore */
    grid-template-areas:
      "app-header              app-header              app-header             "
      "nav                     nav                     nav                    "
      "article-type-select-nav article-type-select-nav article-type-select-nav"
      "...                     article-card-list       ...                    "
      "...                     loader                  ...                    "
      "app-footer              app-footer              app-footer             ";
  }
}

@media screen and (max-width: 920px) {
  .popular-article-list-container {
    grid-template-columns: minmax(0, 1fr) 340px minmax(0, 1fr);
  }
}

@media screen and (max-width: 550px) {
  .popular-article-list-container {
    grid-template-rows: 66px minmax(62px, min-content) 60px minmax(0, 1fr) 75px min-content;
    grid-template-columns: minmax(0, 1fr) 340px minmax(0, 1fr);
  }
  .popular-article-list-container.with-notices {
    grid-template-rows: 66px minmax(62px, min-content) 36px 30px 20px minmax(0, 1fr) 75px min-content;
  }
}

@media screen and (max-width: 370px) {
  .popular-article-list-container {
    grid-template-columns: 10px minmax(0, 1fr) 10px;
  }
}
</style>
