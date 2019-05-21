<template>
  <div class="tip-ranking-container">
    <app-header />
    <default-header-nav class="default-header-nav" />
    <new-topic-candidates />
    <div class="area-recommended-tip-ranking">
      <div class="label">
        投げ銭によるオススメ
      </div>
    </div>
    <tip-ranking-sort-select-nav />
    <!-- TODO: eyecatchArticles を 投げ銭ランキングのデータに変更 -->
    <tip-eyecatch-article-card-list
      :articles="eyecatchArticles"
      class="tip-eyecatch-article-card-list"
    />
    <!-- TODO: eyecatchArticles を 投げ銭ランキングのデータに変更 -->
    <recommended-article-card-list
      :articles="eyecatchArticles.filter((article) => article !== null)"
      :isTipRanking="true"
      class="eyecatch-article-card-list-sp"
    />
    <recommended-article-card-list
      :articles="recommendedArticles.articles"
      class="recommended-article-card-list"
    />
    <the-loader :is-loading="!recommendedArticles.isLastPage" />
    <app-footer class="app-footer" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import DefaultHeaderNav from '../molecules/DefaultHeaderNav'
import NewTopicCandidates from '../organisms/NewTopicCandidates'
import TipRankingSortSelectNav from '../organisms/TipRankingSortSelectNav'
import TipEyecatchArticleCardList from '../organisms/TipEyecatchArticleCardList'
import RecommendedArticleCardList from '../organisms/RecommendedArticleCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable, isScrollBottom } from '~/utils/client'

export default {
  components: {
    AppHeader,
    DefaultHeaderNav,
    NewTopicCandidates,
    TipRankingSortSelectNav,
    TipEyecatchArticleCardList,
    RecommendedArticleCardList,
    TheLoader,
    AppFooter
  },
  data() {
    return {
      isFetchingArticles: false
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
    }
  }
}
</script>

<style lang="scss" scoped>
.tip-ranking-container {
  display: grid;
  grid-column-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header                     app-header                     app-header"
    "nav        nav                            nav                            nav       "
    "...        candidates                     candidates                     ...       "
    "...        recommended-tip-ranking        recommended-tip-ranking        ...       "
    "...        tip-ranking-sort-select-nav    tip-ranking-sort-select-nav    ...       "
    "...        tip-eyecatch-article-card-list tip-eyecatch-article-card-list ...       "
    "...        article-card-list              article-card-list              ...       "
    "...        article-card-list              article-card-list              ...       "
    "...        loader                         loader                         ...       "
    "app-footer app-footer                     app-footer                     app-footer";

  grid-template-columns: 1fr 710px 340px 1fr;
  grid-template-rows: 100px minmax(50px, min-content) 50px 26px 90px auto auto 1fr 75px 75px;
  min-height: 100vh;

  .default-header-nav {
    margin-bottom: 20px;
  }

  .tip-eyecatch-article-card-list {
    margin-bottom: 30px;
  }

  .eyecatch-article-card-list-sp {
    display: none;
    grid-area: eyecatch-article-card-list-sp;
  }
}

.area-recommended-tip-ranking {
  grid-area: recommended-tip-ranking;
  border-bottom: 1px solid rgba(#cecece, 0.3);
  display: flex;
  justify-content: space-between;
}

.label {
  color: #333333;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #6e6e6e;
}

@media screen and (max-width: 1296px) {
  .tip-ranking-container {
    grid-template-columns: 1fr 710px 1fr;
    grid-template-rows: 100px minmax(50px, min-content) 50px 26px 90px auto 1fr 75px 75px;
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header                     app-header"
      "nav        nav                            nav       "
      "...        candidates                     ...       "
      "...        recommended-tip-ranking        ...       "
      "...        tip-ranking-sort-select-nav    ...       "
      "...        tip-eyecatch-article-card-list ...       "
      "...        article-card-list              ...       "
      "...        loader                         ...       "
      "app-footer app-footer                     app-footer";

    .app-footer {
      display: flex;
    }
  }
}

@media screen and (max-width: 920px) {
  .tip-ranking-container {
    grid-template-columns: 1fr 340px 1fr;
    grid-template-rows: 100px 80px 50px 26px 90px auto 1fr 75px minmax(75px, min-content);
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header                    app-header"
      "nav        nav                           nav       "
      "candidates candidates                    candidates"
      "...        recommended-tip-ranking       ...       "
      "...        tip-ranking-sort-select-nav   ...       "
      "...        eyecatch-article-card-list-sp ...       "
      "...        article-card-list             ...       "
      "...        loader                        ...       "
      "app-footer app-footer                    app-footer";

    .eyecatch-article-card-list-sp {
      display: grid;
      grid-area: eyecatch-article-card-list-sp;
      margin-bottom: 20px;
    }

    .tip-eyecatch-article-card-list {
      display: none;
    }
  }
}

@media screen and (max-width: 550px) {
  .tip-ranking-container {
    grid-template-rows: 66px minmax(50px, min-content) 36px 30px 26px 90px auto 1fr 75px min-content;
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header                    app-header"
      "nav        nav                           nav       "
      "candidates candidates                    candidates"
      "...        ...                           ...       "
      "...        recommended-tip-ranking       ...       "
      "...        tip-ranking-sort-select-nav   ...       "
      "...        eyecatch-article-card-list-sp ...       "
      "...        article-card-list             ...       "
      "...        loader                        ...       "
      "app-footer app-footer                    app-footer";
    grid-gap: 0;

    .default-header-nav {
      margin-bottom: 0;
    }
  }
}

@media screen and (max-width: 375px) {
  .tip-ranking-container {
    grid-template-columns: 1fr auto 1fr;
  }
}
</style>
