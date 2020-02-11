<template>
  <div class="purchased-articles-container">
    <app-header />
    <nav class="area-nav">
      <div class="nav-content">
        購入した記事
      </div>
    </nav>
    <div class="area-purchased-articles">
      <p v-if="!hasPurchasedArticle" class="no-result-message">
        購入済みの記事が存在しません。
      </p>
      <search-article-card-list :articles="purchasedArticles.articles" />
    </div>
    <the-loader :isLoading="purchasedArticles.hasLastEvaluatedKey" />
    <app-footer />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import SearchArticleCardList from '../organisms/SearchArticleCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable, isScrollBottom } from '~/utils/client'

export default {
  components: {
    AppHeader,
    SearchArticleCardList,
    TheLoader,
    AppFooter
  },
  data() {
    return {
      isFetchingArticles: false
    }
  },
  computed: {
    hasPurchasedArticle() {
      return (
        this.purchasedArticles.hasLastEvaluatedKey || this.purchasedArticles.articles.length !== 0
      )
    },
    ...mapGetters('article', ['purchasedArticles'])
  },
  mounted() {
    window.addEventListener('scroll', this.infiniteScroll)

    // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
    // 画面の高さに合うまで要素を取得する。

    // 画面の高さに合っているかをスクロールできるかどうかで判定
    if (!isPageScrollable(this.$el)) {
      if (
        !this.purchasedArticles.hasLastEvaluatedKey ||
        this.purchasedArticles.articles.length === 0
      ) {
        return
      }
      this.getPurchasedArticles()
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.infiniteScroll)
  },
  methods: {
    async infiniteScroll(event) {
      if (this.isFetchingArticles) return
      try {
        this.isFetchingArticles = true
        if (!isScrollBottom()) return

        await this.getPurchasedArticles()
      } finally {
        this.isFetchingArticles = false
      }
    },
    ...mapActions('article', ['getPurchasedArticles'])
  },
  watch: {
    async 'purchasedArticles.articles'() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (
        isPageScrollable(this.$el) ||
        !this.purchasedArticles.hasLastEvaluatedKey ||
        this.purchasedArticles.articles.length === 0
      ) {
        return
      }
      this.getPurchasedArticles()
    }
  }
}
</script>

<style lang="scss" scoped>
.purchased-articles-container {
  display: grid;
  grid-row-gap: 20px;
  grid-template-columns: minmax(0, 1fr) 710px minmax(0, 1fr);
  grid-template-rows: 100px 22px minmax(0, 1fr) 75px 75px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header         app-header"
    "...        nav                ...       "
    "...        purchased-articles ...       "
    "...        loader             ...       "
    "app-footer app-footer         app-footer";
  min-height: 100vh;
}

.area-nav {
  grid-area: nav;
  display: flex;
  border-bottom: 1px solid #e6e6e6;

  .nav-content {
    border-bottom: 1px solid #0086cc;
    color: #0086cc;
    font-size: 12px;
    height: 20px;
    letter-spacing: 1.2px;
    text-align: center;
  }
}

.area-purchased-articles {
  grid-area: purchased-articles;
  padding-top: 20px;
}

.no-result-message {
  color: #5e5e5e;
  text-align: center;
}

@media screen and (max-width: 920px) {
  .purchased-articles-container {
    grid-template-columns: minmax(0, 1fr) 340px minmax(0, 1fr);
  }
}

@media screen and (max-width: 640px) {
  .purchased-articles-container {
    grid-template-rows: 100px 22px minmax(0, 1fr) 75px min-content;
  }
}

@media screen and (max-width: 550px) {
  .purchased-articles-container {
    grid-row-gap: 0;
    grid-template-rows: 66px 22px minmax(0, 1fr) 75px min-content;
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header         app-header"
      "nav        nav                nav       "
      "...        purchased-articles ...       "
      "...        loader             ...       "
      "app-footer app-footer         app-footer";
  }

  .area-nav {
    box-shadow: 0 10px 8px -8px rgba(192, 192, 192, 0.5);
    padding-left: 12px;
  }
}

@media screen and (max-width: 370px) {
  .purchased-articles-container {
    grid-template-columns: 10px minmax(0, 1fr) 10px;
  }
}
</style>
