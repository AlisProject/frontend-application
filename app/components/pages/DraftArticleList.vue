<template>
  <div class="draft-article-list-container long-article-card">
    <app-header />
    <my-article-list-header-nav class="drafts" />
    <article-card-list :articles="draftArticles" class="draft" :linkTo="'draft'"/>
    <the-loader :isLoading="hasDraftArticlesLastEvaluatedKey"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import MyArticleListHeaderNav from '../molecules/MyArticleListHeaderNav'
import ArticleCardList from '../organisms/ArticleCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable } from '~/utils/client'

export default {
  components: {
    AppHeader,
    MyArticleListHeaderNav,
    ArticleCardList,
    TheLoader,
    AppFooter
  },
  data() {
    return {
      isFetchingArticles: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.infiniteScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.infiniteScroll)
  },
  computed: {
    ...mapGetters('article', ['draftArticles', 'hasDraftArticlesLastEvaluatedKey'])
  },
  methods: {
    async infiniteScroll(event) {
      if (this.isFetchingArticles) return
      try {
        this.isFetchingArticles = true
        if (window.innerHeight + window.pageYOffset < document.body.offsetHeight - 10) {
          return
        }

        await this.getDraftArticles()
      } finally {
        this.isFetchingArticles = false
      }
    },
    ...mapActions('article', ['getDraftArticles'])
  },
  watch: {
    async draftArticles() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (isPageScrollable(this.$el) || !this.hasDraftArticlesLastEvaluatedKey) return
      this.getDraftArticles()
    }
  }
}
</script>

<style lang="scss" scoped>
.draft-article-list-container {
  display: grid;
  grid-template-rows: 100px auto 40px 1fr 75px 75px;
  grid-template-columns: 1fr 1080px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header        app-header"
    "nav         nav               nav       "
    "...         ...               ...       "
    "...         article-card-list ...       "
    "...         loader            ...       "
    "app-footer  app-footer        app-footer";
}

@media screen and (max-width: 1296px) {
  .draft-article-list-container {
    grid-template-columns: 1fr 710px 1fr;
  }
}

@media screen and (max-width: 920px) {
  .draft-article-list-container {
    grid-template-columns: 1fr 340px 1fr;
  }
}

@media screen and (max-width: 550px) {
  .draft-article-list-container {
    grid-template-rows: 66px auto 24px 1fr 75px min-content;
    grid-template-columns: 1fr 350px 1fr;
  }
}

@media screen and (max-width: 370px) {
  .draft-article-list-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
