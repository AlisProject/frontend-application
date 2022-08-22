<template>
  <div
    class="tag-article-list"
    :class="{
      'defined-tag': definedTag,
      'defined-tag-background': definedTag && definedTag.backgroundUrl
    }"
    :style="tagStyle"
  >
    <app-header />
    <tag-info v-if="definedTag" :tagInfo="definedTag" />
    <div v-else-if="isNFTOwner" class="area-tag">
      {{ $route.params.tag }}
      <p class="tag-description">
        ALISバッジ保有者が追加可能な「NFTオーナー」タグの記事が表示されます。
      </p>
    </div>
    <div v-else class="area-tag">
      {{ $route.params.tag }}
    </div>
    <div class="area-nav">
      <span class="nav-content">
        新着記事
      </span>
    </div>
    <div class="area-tag-articles">
      <p v-if="tagArticles.articles.length === 0" class="no-result-message">
        該当する記事が存在しません。
      </p>
      <search-article-card-list v-else :articles="tagArticles.articles" />
    </div>
    <the-loader :is-loading="!tagArticles.isLastPage" />
    <app-footer />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import SearchArticleCardList from '../organisms/SearchArticleCardList'
import TagInfo from '../atoms/TagInfo'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable, isScrollBottom } from '~/utils/client'

export default {
  components: {
    AppHeader,
    TagInfo,
    SearchArticleCardList,
    TheLoader,
    AppFooter
  },
  data() {
    return {
      isFetchingArticles: false,
      scrollCount: 0
    }
  },
  computed: {
    definedTag() {
      return this.eventsInfo.find((definedTag) => definedTag.key === this.$route.params.tag)
    },
    isNFTOwner() {
      return this.$route.params.tag === 'NFTオーナー'
    },
    tagStyle() {
      if (this.definedTag && this.definedTag.backgroundUrl) {
        return {
          '--background': `#fff url(${this.definedTag.backgroundUrl}) no-repeat`
        }
      }
      return null
    },
    ...mapGetters('article', ['tagArticles', 'eventsInfo']),
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
        this.addGtmScrollEvent()
      } finally {
        this.isFetchingData = false
      }
    },
    async addGtmScrollEvent() {
      this.scrollCount += 1
      window.dataLayer.push({
        event: 'articlePageScroll',
        scroll_info: `tag_${this.$route.params.tag}_${this.scrollCount}`
      })
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
  grid-template-columns: minmax(0, 1fr) 710px minmax(0, 1fr);
  grid-template-rows: 100px 40px 26px minmax(0, 1fr) 75px 75px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header             app-header"
    "...         tag                    ...       "
    "...         nav                    ...       "
    "...         tag-articles           ...       "
    "...         loader                 ...       "
    "app-footer  app-footer             app-footer";
  min-height: 100vh;
  &.defined-tag {
    grid-template-rows: 100px 200px 26px minmax(0, 1fr) 75px 75px;
  }
  &.defined-tag-background {
    background: var(--background);
    background-attachment: fixed;
    background-position: bottom;
  }
}

.area-tag {
  grid-area: tag;
  font-size: 20px;
  letter-spacing: 0.25px;
  .tag-description {
    font-size: 14px;
    color: #5e5e5e;
  }
}

.area-nav {
  grid-area: nav;
  grid-template-columns: 48px minmax(0, 1fr);
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
    grid-template-columns: minmax(0, 1fr) 340px minmax(0, 1fr);
    &.defined-tag {
      grid-template-rows: 100px 245px 26px minmax(0, 1fr) 75px 75px;
    }
    &.defined-tag-background {
      background: none;
    }
  }
}

@media screen and (max-width: 640px) {
  .tag-article-list {
    grid-template-rows: 100px 40px 26px minmax(0, 1fr) 75px min-content;
    &.defined-tag {
      grid-template-rows: 100px 245px 26px minmax(0, 1fr) 75px min-content;
    }
  }
}

@media screen and (max-width: 550px) {
  .tag-article-list {
    grid-row-gap: 26px;
    grid-template-rows: 60px 40px 26px minmax(0, 1fr) 75px min-content;
    .area-tag {
      .tag-description {
        font-size: 12px;
        color: #5e5e5e;
      }
    }
  }
}

@media screen and (max-width: 370px) {
  .tag-article-list {
    grid-template-columns: 10px minmax(0, 1fr) 10px;
  }
}
</style>
