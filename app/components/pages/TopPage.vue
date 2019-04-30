<template>
  <div class="top-page" :class="{ 'is-show-guide': isShowGuide }">
    <app-header />
    <default-header-nav class="default-header-nav" />
    <new-topic-candidates />
    <eyecatch-article-card-list :articles="eyecatchArticles" class="eyecatch-article-card-list" />
    <recommended-article-card-list
      :articles="eyecatchArticles.filter((article) => article !== null)"
      class="eyecatch-article-card-list-sp"
    />
    <recommended-article-card-list
      :articles="recommendedArticles.articles"
      class="recommended-article-card-list"
    />
    <how-to-use-image class="how-to-use-image" />
    <sub-footer class="sub-footer" />
    <the-loader :is-loading="!recommendedArticles.isLastPage" />
    <app-footer class="app-footer" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import DefaultHeaderNav from '../molecules/DefaultHeaderNav'
import NewTopicCandidates from '../organisms/NewTopicCandidates'
import EyecatchArticleCardList from '../organisms/EyecatchArticleCardList'
import RecommendedArticleCardList from '../organisms/RecommendedArticleCardList'
import HowToUseImage from '../organisms/HowToUseImage'
import SubFooter from '../organisms/SubFooter'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable, isScrollBottom } from '~/utils/client'

export default {
  components: {
    AppHeader,
    DefaultHeaderNav,
    NewTopicCandidates,
    EyecatchArticleCardList,
    RecommendedArticleCardList,
    HowToUseImage,
    SubFooter,
    TheLoader,
    AppFooter
  },
  data() {
    return {
      isFetchingArticles: false,
      isShowGuide: false
    }
  },
  computed: {
    ...mapGetters('article', ['eyecatchArticles', 'recommendedArticles']),
    ...mapGetters('user', ['loggedIn', 'currentUser']),
    ...mapGetters('presentation', ['articleListScrollHeight'])
  },
  async mounted() {
    if (!this.loggedIn) this.isShowGuide = true

    window.addEventListener('scroll', this.infiniteScroll)

    // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
    // 画面の高さに合うまで要素を取得する。

    // 画面の高さに合っているかをスクロールできるかどうかで判定
    if (!isPageScrollable(this.$el)) {
      if (this.recommendedArticles.isLastPage || this.recommendedArticles.articles.length === 0) {
        return
      }
      await this.getRecommendedArticles()
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

        if (this.recommendedArticles.isLastPage || !isScrollBottom()) return

        await this.getRecommendedArticles()
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
    ...mapActions('article', ['getRecommendedArticles']),
    ...mapActions('user', [
      'setRequestLoginModal',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal'
    ]),
    ...mapActions('presentation', ['setArticleListScrollHeight'])
  },
  watch: {
    async 'recommendedArticles.articles'() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態なるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (
        isPageScrollable(this.$el) ||
        this.recommendedArticles.isLastPage ||
        this.recommendedArticles.articles.length === 0
      ) {
        return
      }
      await this.getRecommendedArticles()
    },
    loggedIn(newState) {
      // ログインしたときにALISの使い方を非表示にする
      if (newState) this.isShowGuide = false
    }
  }
}
</script>

<style lang="scss" scoped>
.top-page {
  display: grid;
  grid-column-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header                 app-header                 app-header"
    "nav        nav                        nav                        nav       "
    "...        candidates                 candidates                 ...       "
    "...        eyecatch-article-card-list eyecatch-article-card-list ...       "
    "...        article-card-list          article-card-list          ...       "
    "...        article-card-list          article-card-list          ...       "
    "...        loader                     loader                     ...       "
    "app-footer app-footer                 app-footer                 app-footer";

  grid-template-columns: 1fr 710px 340px 1fr;
  grid-template-rows: 100px minmax(50px, min-content) 50px auto auto 1fr 75px 75px;
  min-height: 100vh;

  &.is-show-guide {
    grid-template-rows: 100px minmax(50px, min-content) 50px auto 652px minmax(100px, 1fr) 75px 75px;
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header                 app-header                 app-header"
      "nav        nav                        nav                        nav       "
      "...        candidates                 candidates                 ...       "
      "...        eyecatch-article-card-list eyecatch-article-card-list ...       "
      "...        article-card-list          how-to-use-image           ...       "
      "...        article-card-list          sub-footer                 ...       "
      "...        loader                     loader                     ...       ";

    .how-to-use-image,
    .sub-footer {
      display: block;
    }

    .how-to-use-image {
      margin-bottom: 30px;
    }

    .app-footer {
      display: none;
    }
  }

  .default-header-nav {
    margin-bottom: 30px;
  }

  .how-to-use-image,
  .sub-footer {
    display: none;
  }

  .eyecatch-article-card-list {
    margin-bottom: 30px;
  }

  .eyecatch-article-card-list-sp {
    display: none;
    grid-area: eyecatch-article-card-list-sp;
  }
}

.is-fixed-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
}

@media screen and (max-width: 1296px) {
  .top-page {
    grid-template-columns: 1fr 710px 1fr;
    grid-template-rows: 100px minmax(50px, min-content) 50px auto 1fr 75px 75px;
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header                 app-header"
      "nav        nav                        nav       "
      "...        candidates                 ...       "
      "...        eyecatch-article-card-list ...       "
      "...        article-card-list          ...       "
      "...        loader                     ...       "
      "app-footer app-footer                 app-footer";

    &.is-show-guide {
      grid-template-rows: 100px minmax(50px, min-content) 50px auto auto 1fr 75px 75px;
      /* prettier-ignore */
      grid-template-areas:
        "app-header app-header                 app-header"
        "nav        nav                        nav       "
        "...        candidates                 ...       "
        "...        eyecatch-article-card-list ...       "
        "...        how-to-use-image           ...       "
        "...        article-card-list          ...       "
        "...        loader                     ...       "
        "app-footer app-footer                 app-footer";

      .sub-footer {
        display: none;
      }

      .app-footer {
        display: flex;
      }
    }

    .app-footer {
      display: flex;
    }
  }
}

@media screen and (max-width: 920px) {
  .top-page {
    grid-template-columns: 1fr 340px 1fr;
    grid-template-rows: 100px 80px 50px auto 1fr 75px 75px;
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header                    app-header"
      "nav        nav                           nav       "
      "candidates candidates                    candidates"
      "...        eyecatch-article-card-list-sp ...       "
      "...        article-card-list             ...       "
      "...        loader                        ...       "
      "app-footer app-footer                    app-footer";

    &.is-show-guide {
      /* prettier-ignore */
      grid-template-areas:
        "app-header app-header                    app-header"
        "nav        nav                           nav       "
        "candidates candidates                    candidates"
        "...        how-to-use-image              ...       "
        "...        eyecatch-article-card-list-sp ...       "
        "...        article-card-list             ...       "
        "...        loader                        ...       "
        "app-footer app-footer                    app-footer";
    }

    .eyecatch-article-card-list-sp {
      display: grid;
      grid-area: eyecatch-article-card-list-sp;
      margin-bottom: 30px;
    }

    .eyecatch-article-card-list {
      display: none;
    }
  }
}

@media screen and (max-width: 550px) {
  .top-page {
    grid-template-rows: 66px minmax(50px, min-content) 36px auto 1fr 75px min-content;
    /* prettier-ignore */
    grid-template-areas:
      "app-header       app-header                    app-header"
      "nav              nav                           nav       "
      "candidates       candidates                    candidates"
      "...              eyecatch-article-card-list-sp ...       "
      "...              article-card-list             ...       "
      "...              loader                        ...       "
      "app-footer       app-footer                    app-footer";
    grid-gap: 0;

    &.is-show-guide {
      grid-template-rows: 66px minmax(50px, min-content) 44px auto auto 1fr 75px min-content;
      /* prettier-ignore */
      grid-template-areas:
        "app-header       app-header                    app-header      "
        "nav              nav                           nav             "
        "candidates       candidates                    candidates      "
        "how-to-use-image how-to-use-image              how-to-use-image"
        "...              eyecatch-article-card-list-sp ...             "
        "...              article-card-list             ...             "
        "...              loader                        ...             "
        "app-footer       app-footer                    app-footer";

      .how-to-use-image {
        margin: 12px 0 0;
      }
    }

    .default-header-nav {
      margin-bottom: 0;
    }

    .eyecatch-article-card-list-sp,
    .recommended-article-card-list {
      margin-top: 24px;
    }

    .eyecatch-article-card-list-sp {
      margin-bottom: 0;
    }
  }
}

@media screen and (max-width: 375px) {
  .top-page {
    grid-template-columns: 1fr auto 1fr;
  }
}
</style>
