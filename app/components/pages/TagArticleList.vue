<template>
  <div class="tag-article-list" @scroll="infiniteScroll">
    <app-header showDefaultHeaderNav showOnlySessionLinks class="without-shadow"/>
    <div class="area-tag">
      {{ this.$route.params.tag }}
    </div>
    <div class="area-nav">
      <span class="nav-content">
        新規記事
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
import { isPageScrollable } from '~/utils/client'

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
    if (!isPageScrollable(this.$el)) {
      if (this.tagArticles.isLastPage) return
      this.getTagArticles({ tag: this.$route.params.tag })
    }
    if (this.tagArticlesScrollHeight) {
      this.$el.scrollTop = this.tagArticlesScrollHeight
    }
  },
  beforeDestroy() {
    this.setTagArticlesScrollHeight({ scrollHeight: this.$el.scrollTop })
  },
  methods: {
    async infiniteScroll(event) {
      if (this.isFetchingData) return
      try {
        this.isFetchingData = true

        const isLastPage = this.tagArticles.isLastPage
        const isScrollBottom =
          event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight - 10
        if (isLastPage || !isScrollBottom) return

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
      await this.$nextTick()
      if (isPageScrollable(this.$el)) return
      this.getTagArticles({ tag: this.$route.params.tag })
    }
  }
}
</script>


<style lang="scss" scoped>
.tag-article-list {
  display: grid;
  grid-row-gap: 40px;
  grid-template-columns: 1fr 1080px 1fr;
  grid-template-rows: 100px 40px 30px 1fr 75px 75px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header             app-header"
    "...         tag                    ...       "
    "...         nav                    ...       "
    "...         tag-articles           ...       "
    "...         loader                 ...       "
    "app-footer  app-footer             app-footer";
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.area-tag {
  grid-area: tag;
  color: #030303;
  font-size: 20px;
  letter-spacing: 0.25px;
  line-height: 1.5;
  padding-left: 10px;
}

.area-nav {
  grid-area: nav;
  grid-template-columns: 48px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    'nav-content ...';
  padding-left: 10px;

  .nav-content {
    grid-area: nav-content;
    border-bottom: 1px solid #99a2ff;
    color: #858dda;
    font-size: 12px;
    padding-bottom: 12px;
  }
}

.area-tag-articles {
  grid-area: tag-articles;
}

.no-result-message {
  color: #5e5e5e;
  text-align: center;
}

@media screen and (max-width: 1296px) {
  .tag-article-list {
    grid-template-columns: 1fr 710px 1fr;
  }
}

@media screen and (max-width: 920px) {
  .tag-article-list {
    grid-template-columns: 1fr 340px 1fr;
  }
}

@media screen and (max-width: 640px) {
  .tag-article-list {
    grid-template-columns: 1fr 340px 1fr;
    grid-template-rows: 100px 40px 30px 1fr 75px min-content;
  }
}

@media screen and (max-width: 550px) {
  .tag-article-list {
    grid-row-gap: 20px;
    grid-template-rows: 60px 40px 30px 1fr 75px min-content;
    /* prettier-ignore */
    grid-template-areas:
      "app-header  app-header             app-header"
      "...         tag                    ...       "
      "nav         nav                    nav       "
      "...         tag-articles           ...       "
      "...         loader                 ...       "
      "app-footer  app-footer             app-footer";
  }

  .area-tag {
    padding-left: 0;
  }

  .area-nav {
    box-shadow: 0 8px 5px -5px rgba(0, 0, 0, 0.15);
    // 170px - half width of article-card
    padding-left: calc(50vw - 170px);
  }
}

@media screen and (max-width: 370px) {
  .tag-article-list {
    grid-template-columns: 10px 1fr 10px;
  }

  .area-nav {
    padding-left: 10px;
  }
}
</style>
