<template>
  <div class="tag-article-list">
    <app-header />
    <div class="area-tag">
      {{ $route.params.tag }}
    </div>
    <div class="area-nav">
      <span class="nav-content">
        新着記事
      </span>
    </div>
    <div class="area-tag-articles">
      <p class="no-result-message" v-if="tagArticles.articles.length === 0">
        該当する記事が存在しません。
      </p>
      <search-article-card-list :articles="tagArticles.articles" v-else/>
    </div>
    <the-loader :isLoading="!tagArticles.isLastPage"/>
    <app-footer/>
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
      isFetchingData: false
    }
  },
  computed: {
    ...mapGetters('article', ['tagArticles']),
    ...mapGetters('presentation', ['tagArticlesScrollHeight'])
  },
  mounted() {
    window.addEventListener('scroll', this.infiniteScroll)

    // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
    // 画面の高さに合うまで要素を取得する。

    // 画面の高さに合っているかをスクロールできるかどうかで判定
    if (!isPageScrollable(this.$el)) {
      if (this.tagArticles.isLastPage) return
      this.getTagArticles({ tag: this.$route.params.tag })
    }
    if (this.tagArticlesScrollHeight) {
      this.$el.scrollTop = this.tagArticlesScrollHeight
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.infiniteScroll)
    this.setTagArticlesScrollHeight({ scrollHeight: this.$el.scrollTop })
  },
  methods: {
    async infiniteScroll(event) {
      if (this.isFetchingData) return
      try {
        this.isFetchingData = true

        const isLastPage = this.tagArticles.isLastPage
        if (isLastPage || !isScrollBottom()) return

        await this.getTagArticles({ tag: this.$route.params.tag })
      } finally {
        this.isFetchingData = false
      }
    },
    ...mapActions('article', ['getTagArticles']),
    ...mapActions('presentation', ['setTagArticlesScrollHeight'])
  },
  watch: {
    async 'tagArticles.articles'() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (
        isPageScrollable(this.$el) ||
        this.tagArticles.isLastPage ||
        // 表示されている記事のカセットからタグに関連する記事一覧に遷移する場合は記事データを取得しない
        this.tagArticles.currentTag !== this.$route.params.tag
      ) {
        return
      }
      this.getTagArticles({ tag: this.$route.params.tag })
    }
  }
}
</script>


<style lang="scss" scoped>
.tag-article-list {
  display: grid;
  grid-row-gap: 40px;
  grid-template-columns: 1fr 710px 1fr;
  grid-template-rows: 100px 40px 26px 1fr 75px 75px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header             app-header"
    "...         tag                    ...       "
    "...         nav                    ...       "
    "...         tag-articles           ...       "
    "...         loader                 ...       "
    "app-footer  app-footer             app-footer";
  min-height: 100vh;
}

.area-tag {
  grid-area: tag;
  font-size: 20px;
  letter-spacing: 0.25px;
}

.area-nav {
  grid-area: nav;
  grid-template-columns: 48px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    'nav-content ...';
  border-bottom: 1px solid #f0f0f0;

  .nav-content {
    grid-area: nav-content;
    border-bottom: 1px solid #0086cc;
    color: #0086cc;
    font-size: 12px;
    padding-bottom: 8px;
  }
}

.area-tag-articles {
  grid-area: tag-articles;
}

.no-result-message {
  color: #5e5e5e;
  text-align: center;
}

@media screen and (max-width: 920px) {
  .tag-article-list {
    grid-template-columns: 1fr 340px 1fr;
  }
}

@media screen and (max-width: 640px) {
  .tag-article-list {
    grid-template-rows: 100px 40px 26px 1fr 75px min-content;
  }
}

@media screen and (max-width: 550px) {
  .tag-article-list {
    grid-row-gap: 26px;
    grid-template-rows: 60px 40px 26px 1fr 75px min-content;
  }
}

@media screen and (max-width: 370px) {
  .tag-article-list {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
