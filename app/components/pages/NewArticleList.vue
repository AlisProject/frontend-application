<template>
  <div class="new-article-list-container" @scroll="infiniteScroll">
    <app-header />
    <default-header-nav/>
    <article-type-select-nav />
    <article-card-list :articles="newArticles"/>
    <the-loader :isLoading="!isLastPage"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import DefaultHeaderNav from '../molecules/DefaultHeaderNav'
import ArticleTypeSelectNav from '../organisms/ArticleTypeSelectNav'
import ArticleCardList from '../organisms/ArticleCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable } from '~/utils/client'

export default {
  components: {
    AppHeader,
    DefaultHeaderNav,
    ArticleTypeSelectNav,
    ArticleCardList,
    TheLoader,
    AppFooter
  },
  computed: {
    ...mapGetters('article', ['newArticles', 'isLastPage', 'topics']),
    ...mapGetters('presentation', ['articleListScrollHeight'])
  },
  data() {
    return {
      isFetchingArticles: false,
      topicNumber: 1
    }
  },
  mounted() {
    // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
    // 画面の高さに合うまで要素を取得する。

    // 画面の高さに合っているかをスクロールできるかどうかで判定
    if (!isPageScrollable(this.$el)) {
      if (this.isLastPage) return
      this.getNewPagesArticles({ topic: this.$route.query.topic })
    }
    if (this.articleListScrollHeight) {
      this.$el.scrollTop = this.articleListScrollHeight
    }
  },
  beforeDestroy() {
    this.setArticleListScrollHeight({ scrollHeight: this.$el.scrollTop })
  },
  methods: {
    async infiniteScroll(event) {
      if (this.isFetchingArticles) return
      try {
        this.isFetchingArticles = true

        const isScrollBottom =
          event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight - 10
        if (this.isLastPage || !isScrollBottom) return

        await this.getNewPagesArticles({ topic: this.$route.query.topic })
      } finally {
        this.isFetchingArticles = false
      }
    },
    ...mapActions('article', ['getNewPagesArticles', 'resetArticleData', 'setTopicDisplayName']),
    ...mapActions('presentation', ['setArticleListScrollHeight'])
  },
  watch: {
    async newArticles() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (isPageScrollable(this.$el) || this.isLastPage || this.newArticles.length === 0) return
      this.getNewPagesArticles({ topic: this.$route.query.topic })
    },
    $route(to) {
      this.resetArticleData()
      this.setTopicDisplayName({ topicName: to.query.topic })
      this.getNewPagesArticles({ topic: to.query.topic })
    }
  }
}
</script>

<style lang="scss" scoped>
.new-article-list-container {
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header              app-header              app-header"
    "nav                     nav                     nav       "
    "article-type-select-nav article-type-select-nav article-type-select-nav"
    "...                     article-card-list       ...       "
    "...                     loader                  ...       "
    "app-footer              app-footer              app-footer";
  grid-template-columns: 1fr 1080px 1fr;
  grid-template-rows: 100px 30px 84px 1fr 75px 75px;
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

@media screen and (max-width: 1296px) {
  .new-article-list-container {
    grid-template-columns: 1fr 710px 1fr;
  }
}

@media screen and (max-width: 920px) {
  .new-article-list-container {
    grid-template-columns: 1fr 340px 1fr;
  }
}

@media screen and (max-width: 550px) {
  .new-article-list-container {
    grid-template-rows: 66px 28px 60px 1fr 75px min-content;
    grid-template-columns: 1fr 350px 1fr;
  }
}

@media screen and (max-width: 370px) {
  .new-article-list-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
