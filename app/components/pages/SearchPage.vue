<template>
  <div class="search-page-container">
    <app-header />
    <form class="area-search" @submit.prevent="search">
      <input
        ref="searchInput"
        v-model.trim="inputText"
        type="text"
        class="form-input"
        required
        placeholder="ALIS内で検索する"
        maxlength="150"
      >
      <img
        class="search-icon"
        :class="{ disabled: inputText === '' }"
        src="~assets/images/pc/common/icon_search.png"
        @click="onClickSearch"
      >
    </form>
    <nav v-if="showNav" class="area-nav">
      <nuxt-link
        :to="{ path: '/search', query: { context: 'article', q: query } }"
        class="nav-link"
        :class="{ selected: searchContentType === 'article' }"
      >
        記事
      </nuxt-link>
      <nuxt-link
        :to="{ path: '/search', query: { context: 'tag', q: query } }"
        class="nav-link"
        :class="{ selected: searchContentType === 'tag' }"
      >
        タグ
      </nuxt-link>
      <nuxt-link
        :to="{ path: '/search', query: { context: 'user', q: query } }"
        class="nav-link"
        :class="{ selected: searchContentType === 'user' }"
      >
        ユーザー
      </nuxt-link>
    </nav>
    <div class="area-search-result">
      <no-ssr>
        <div v-if="searchContentType === 'article'">
          <p v-if="searchArticles.articles.length === 0" class="no-result-message">
            {{ searchArticles.isFetching || !showNav ? '' : '該当する検索結果が存在しません。' }}
          </p>
          <search-article-card-list v-else :articles="searchArticles.articles" />
        </div>
        <div v-else-if="searchContentType === 'tag'">
          <p v-if="searchTags.tags.length === 0" class="no-result-message">
            {{ searchTags.isFetching || !showNav ? '' : '該当する検索結果が存在しません。' }}
          </p>
          <search-tags v-else :tags="searchTags.tags" />
        </div>
        <div v-else-if="searchContentType === 'user'">
          <p v-if="searchUsers.users.length === 0" class="no-result-message">
            {{ searchUsers.isFetching || !showNav ? '' : '該当する検索結果が存在しません。' }}
          </p>
          <search-user-card-list v-else :users="searchUsers.users" />
        </div>
      </no-ssr>
    </div>
    <the-loader
      v-if="searchContentType === 'article'"
      :is-loading="showNav && !searchArticles.isLastPage"
    />
    <the-loader
      v-else-if="searchContentType === 'user'"
      :is-loading="showNav && !searchUsers.isLastPage"
    />
    <app-footer />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppHeader from '../organisms/AppHeader'
import SearchArticleCardList from '../organisms/SearchArticleCardList'
import SearchUserCardList from '../organisms/SearchUserCardList'
import SearchTags from '../molecules/SearchTags'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable, isScrollBottom } from '~/utils/client'

export default {
  components: {
    AppHeader,
    SearchArticleCardList,
    SearchUserCardList,
    SearchTags,
    TheLoader,
    AppFooter
  },
  computed: {
    ...mapGetters('article', ['searchArticles']),
    ...mapGetters('user', ['searchUsers']),
    ...mapGetters('presentation', [
      'searchArticlesScrollHeight',
      'searchUsersScrollHeight',
      'searchTagsScrollHeight'
    ]),
    ...mapGetters('tag', ['searchTags'])
  },
  created() {
    this.searchContentType = this.$route.query.context
    this.query = this.$route.query.q
    this.showNav = !!this.query
  },
  async mounted() {
    window.addEventListener('scroll', this.infiniteScroll)

    if (window.innerWidth > 640) this.$refs.searchInput.focus()
    this.inputText = this.$route.query.q
    await this.$nextTick()
    if (this.searchArticlesScrollHeight) this.$el.scrollTop = this.searchArticlesScrollHeight
    if (this.searchTagsScrollHeight) this.$el.scrollTop = this.searchTagsScrollHeight
    if (this.searchUsersScrollHeight) this.$el.scrollTop = this.searchUsersScrollHeight
  },
  data() {
    return {
      isFetchingData: false,
      searchContentType: '',
      query: null,
      showNav: false,
      inputText: '',
      isSearchFirstly: true
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.infiniteScroll)

    switch (this.searchContentType) {
      case 'article':
        this.setSearchArticlesScrollHeight({ scrollHeight: this.$el.scrollTop })
        break
      case 'tag':
        this.setTagArticlesScrollHeight({ scrollHeight: this.$el.scrollTop })
        break
      case 'user':
        this.setSearchUsersScrollHeight({ scrollHeight: this.$el.scrollTop })
        break
      default:
        break
    }
  },
  methods: {
    async search() {
      try {
        if (window.innerWidth <= 640) document.activeElement.blur()
        this.resetSearchData()
        this.query = this.inputText
        if (this.isFetchingData || !this.query) return
        this.isFetchingData = true
        this.showNav = true
        const path = `/search?context=${this.searchContentType}&q=${this.query}`
        this.isSearchFirstly ? this.$router.replace(path) : this.$router.push(path)
        this.isSearchFirstly = false
        await this.getSearchData(this.query)
      } catch (error) {
        this.ADD_TOAST_MESSAGE({ text: '検索結果の取得に失敗しました', type: 'warning' })
        console.error(error)
      } finally {
        this.isFetchingData = false
      }
    },
    async onClickSearch() {
      if (this.inputText === '') return
      await this.search()
    },
    async getSearchData(query) {
      try {
        switch (this.searchContentType) {
          case 'article':
            await this.getSearchArticles({ query })
            break
          case 'tag':
            await this.getSearchTags({ query })
            break
          case 'user':
            await this.getSearchUsers({ query })
            break
          default:
            break
        }
      } catch (error) {
        this.ADD_TOAST_MESSAGE({
          text: 'エラーが発生しました。しばらく時間を置いて再度お試しください',
          type: 'warning'
        })
      }
    },
    async infiniteScroll(event) {
      if (this.isFetchingData || !this.query) return
      try {
        this.isFetchingData = true
        let isLastPage = false
        switch (this.searchContentType) {
          case 'article':
            isLastPage = this.searchArticles.isLastPage
            break
          case 'user':
            isLastPage = this.searchUsers.isLastPage
            break
          default:
            break
        }
        if (isLastPage || !isScrollBottom()) return

        await this.getSearchData(this.query)
      } finally {
        this.isFetchingData = false
      }
    },
    resetSearchData() {
      this.resetSearchArticles()
      this.resetSearchArticlesPage()
      this.resetSearchArticlesIsLastPage()
      this.resetSearchUsers()
      this.resetSearchUsersPage()
      this.resetSearchUsersIsLastPage()
    },
    async fetchSearchedData(query) {
      this.resetSearchData()
      this.query = query
      if (typeof this.query !== 'string') return
      this.inputText = this.query
      await this.getSearchData(this.query)
    },
    ...mapActions({ ADD_TOAST_MESSAGE }),
    ...mapActions('user', [
      'getSearchUsers',
      'resetSearchUsers',
      'resetSearchUsersPage',
      'resetSearchUsersIsLastPage'
    ]),
    ...mapActions('article', [
      'getSearchArticles',
      'resetSearchArticles',
      'resetSearchArticlesPage',
      'resetSearchArticlesIsLastPage'
    ]),
    ...mapActions('presentation', [
      'setSearchArticlesScrollHeight',
      'setSearchUsersScrollHeight',
      'setTagArticlesScrollHeight'
    ]),
    ...mapActions('tag', ['getSearchTags'])
  },
  watch: {
    async 'searchArticles.articles'() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (
        isPageScrollable(this.$el) ||
        this.searchArticles.isLastPage ||
        this.searchArticles.articles.length === 0
      ) {
        return
      }
      this.getSearchArticles({ query: this.query })
    },
    async 'searchUsers.users'() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (
        isPageScrollable(this.$el) ||
        this.searchUsers.isLastPage ||
        this.searchUsers.users.length === 0
      ) {
        return
      }
      this.getSearchUsers({ query: this.query })
    },
    $route(to, from) {
      const { query } = to
      this.searchContentType = query.context
      this.showNav = !!query.q
      this.isSearchFirstly = !this.showNav
      this.fetchSearchedData(query.q)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-page-container {
  display: grid;
  grid-row-gap: 40px;
  grid-template-rows: 100px auto auto 1fr 75px 75px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header             app-header"
    "...         search                 ...       "
    "...         nav                    ...       "
    "...         search-result          ...       "
    "...         loader                 ...       "
    "app-footer  app-footer             app-footer";
  min-height: 100vh;
  grid-template-columns: 1fr 710px 1fr;
}

.area-search {
  grid-area: search;
  margin: 0 auto;
  position: relative;

  .form-input {
    appearance: none;
    border-radius: 0;
    border: none;
    box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.5);
    box-sizing: border-box;
    padding: 12px 24px 12px 12px;
    width: 400px;

    &::-webkit-input-placeholder {
      color: #cecece;
      font-size: 14px;
    }

    &:focus {
      outline: 0;
    }
  }

  .search-icon {
    cursor: pointer;
    position: absolute;
    right: 12px;
    top: 12px;
    width: 16px;

    &.disabled {
      cursor: not-allowed;
    }
  }
}

.area-nav {
  grid-area: nav;
  display: flex;
  border-bottom: 1px solid #e6e6e6;

  .nav-link {
    color: #6e6e6e;
    font-size: 12px;
    height: 20px;
    list-style: none;
    margin-right: 24px;
    text-align: center;
    text-decoration: none;

    &.nuxt-link-exact-active {
      color: #0086cc;
      border-bottom: 1px solid #0086cc;
    }
  }
}

.area-search-result {
  grid-area: search-result;
}

.no-result-message {
  text-align: center;
}

@media screen and (max-width: 920px) {
  .search-page-container {
    grid-template-columns: 1fr 340px 1fr;
  }

  .area-search {
    max-width: 100%;

    .form-input {
      width: 340px;
    }
  }
}

@media screen and (max-width: 640px) {
  .search-page-container {
    grid-template-rows: 100px auto auto 1fr 75px min-content;
  }
}

@media screen and (max-width: 550px) {
  .search-page-container {
    grid-template-rows: 66px auto auto 1fr 75px min-content;
    grid-row-gap: 30px;
  }
}

@media screen and (max-width: 370px) {
  .search-page-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
