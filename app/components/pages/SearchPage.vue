<template>
  <div class="search-page-container" :class="searchContentType" @scroll="infiniteScroll">
    <app-header showDefaultHeaderNav showOnlySessionLinks class="without-shadow"/>
    <h1 class="area-title">{{ title }}</h1>
    <form @submit.prevent="search" class="area-search">
      <input
        type="text"
        class="form-input"
        required
        maxlength="150"
        v-model.trim="inputText"
        ref="searchInput">
      <img
        @click="onClickSearch"
        class="search-icon"
        :class="{ 'disabled': inputText === '' }"
        src="~assets/images/pc/common/icon_search.png">
    </form>
    <nav class="area-nav" v-if="showNav">
      <nuxt-link
        :to="{ path: '/search', query: { context: 'article', q: this.query }}"
        class="area-article nav-link"
        :class="{ 'selected': searchContentType === 'article' }">記事</nuxt-link>
      <nuxt-link
        :to="{ path: '/search', query: { context: 'user', q: this.query }}"
        class="area-user nav-link"
        :class="{ 'selected': searchContentType === 'user' }">ユーザー</nuxt-link>
      <nuxt-link
        :to="{ path: '/search', query: { context: 'tag', q: this.query }}"
        class="area-tag nav-link"
        :class="{ 'selected': searchContentType === 'tag' }">タグ</nuxt-link>
    </nav>
    <div class="area-search-result">
      <no-ssr>
        <div v-if="searchContentType === 'article'">
          <p class="no-result-message" v-if="searchArticles.articles.length === 0">
           {{  searchArticles.isFetching || !showNav ? '' : '該当する検索結果が存在しません。'}}
          </p>
          <search-article-card-list :articles="searchArticles.articles" v-else/>
        </div>
        <div v-else-if="searchContentType === 'user'">
          <p class="no-result-message" v-if="searchUsers.users.length === 0">
           {{ searchUsers.isFetching || !showNav ? '' : '該当する検索結果が存在しません。'}}
          </p>
          <search-user-card-list :users="searchUsers.users" v-else/>
        </div>
        <div v-else-if="searchContentType === 'tag'">
          <p class="no-result-message" v-if="searchTags.tags.length === 0">
           {{ searchTags.isFetching || !showNav ? '' : '該当する検索結果が存在しません。'}}
          </p>
          <article-tags :tags="searchTags.tags" v-else/>
        </div>
      </no-ssr>
    </div>
    <the-loader :isLoading="showNav && !searchArticles.isLastPage" v-if="searchContentType === 'article'"/>
    <the-loader :isLoading="showNav && !searchUsers.isLastPage" v-else-if="searchContentType === 'user'"/>
    <the-loader :isLoading="showNav && !searchTags.isLastPage" v-else-if="searchContentType === 'tag'"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppHeader from '../organisms/AppHeader'
import SearchArticleCardList from '../organisms/SearchArticleCardList'
import SearchUserCardList from '../organisms/SearchUserCardList'
import ArticleTags from '../molecules/ArticleTags'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    SearchArticleCardList,
    SearchUserCardList,
    ArticleTags,
    TheLoader,
    AppFooter
  },
  computed: {
    title() {
      return 'SEARCH'
    },
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
    if (window.innerWidth > 640) this.$refs.searchInput.focus()
    this.inputText = this.$route.query.q
    await this.$nextTick()
    if (this.searchArticlesScrollHeight) this.$el.scrollTop = this.searchArticlesScrollHeight
    if (this.searchUsersScrollHeight) this.$el.scrollTop = this.searchUsersScrollHeight
    if (this.searchTagsScrollHeight) this.$el.scrollTop = this.searchTagsScrollHeight
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
    switch (this.searchContentType) {
      case 'article':
        this.setSearchArticlesScrollHeight({ scrollHeight: this.$el.scrollTop })
        break
      case 'user':
        this.setSearchUsersScrollHeight({ scrollHeight: this.$el.scrollTop })
        break
      case 'tag':
        this.setTagUsersScrollHeight({ scrollHeight: this.$el.scrollTop })
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
        this.ADD_TOAST_MESSAGE({ text: '検索結果の取得に失敗しました。', type: 'warning' })
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
      switch (this.searchContentType) {
        case 'article':
          await this.getSearchArticles({ query })
          break
        case 'user':
          await this.getSearchUsers({ query })
          break
        case 'tag':
          await this.getSearchTags({ query })
          break
        default:
          break
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
          case 'tag':
            isLastPage = this.searchTags.isLastPage
            break
          default:
            break
        }
        const isScrollBottom =
          event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight - 10
        if (isLastPage || !isScrollBottom) return

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
      this.resetSearchTags()
      this.resetSearchTagsPage()
      this.resetSearchTagsIsLastPage()
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
    ...mapActions('presentation', ['setSearchArticlesScrollHeight', 'setSearchUsersScrollHeight']),
    ...mapActions('tag', [
      'getSearchTags',
      'resetSearchTags',
      'resetSearchTagsPage',
      'resetSearchTagsIsLastPage'
    ])
  },
  watch: {
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
  background-size: contain;
  display: grid;
  grid-row-gap: 20px;
  grid-template-rows: 100px 60px 20px 80px 1fr 75px 75px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header             app-header"
    "...         title                  ...       "
    "...         search                 ...       "
    "...         nav                    ...       "
    "...         search-result          ...       "
    "...         loader                 ...       "
    "app-footer  app-footer             app-footer";
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  &.article {
    grid-template-columns: 1fr 1080px 1fr;
  }

  &.user,
  &.tag {
    grid-template-columns: 1fr 640px 1fr;
  }
}

.area-title {
  font-family: 'Times New Roman', Times, serif;
  text-align: center;
  font-size: 20px;
  margin: 0;
  grid-area: title;
  letter-spacing: 0.2em;
}

.area-search {
  grid-area: search;
  margin: 0 auto;
  position: relative;

  .form-input {
    -webkit-appearance: none;
    border: none;
    border-radius: 0;
    border-bottom: 1px dotted #232538;
    padding: 5px 24px 5px 0;
    width: 400px;

    &:focus {
      outline: 0;
    }
  }

  .search-icon {
    position: absolute;
    right: 0;
    top: 6px;
    width: 16px;
    cursor: pointer;

    &.disabled {
      cursor: not-allowed;
    }
  }
}

.area-nav {
  grid-area: nav;
  display: grid;
  text-align: center;
  grid-template-rows: 1fr 30px 1fr;
  grid-template-columns: 1fr repeat(3, 70px) 1fr;
  grid-column-gap: 10px;
  /* prettier-ignore */
  grid-template-areas:
    "... ...     ...  ... ..."
    "... article user tag ..."
    "... ...     ...  ... ...";

  .nav-link {
    font-size: 14px;
    text-decoration: none;
    color: #525256;
    cursor: pointer;

    &.selected {
      color: #99a2ff;
      border-bottom: 2px solid #99a2ff;
    }
  }

  .area-article {
    grid-area: article;
  }

  .area-user {
    grid-area: user;
  }

  .area-tag {
    grid-area: tag;
  }
}

.area-search-result {
  grid-area: search-result;
}

.no-result-message {
  text-align: center;
}

@media screen and (max-width: 1296px) {
  .search-page-container {
    &.article {
      grid-template-columns: 1fr 710px 1fr;
    }
  }
}

@media screen and (max-width: 920px) {
  .search-page-container {
    &.article {
      grid-template-columns: 1fr 340px 1fr;
    }

    &.user,
    &.tag {
      grid-template-columns: 1fr 70vw 1fr;

      .area-search {
        width: 340px;
      }
    }
  }

  .area-search {
    width: 100%;

    .form-input {
      width: calc(100% - 24px);
    }
  }
}

@media screen and (max-width: 640px) {
  .search-page-container {
    grid-template-columns: 1fr 340px 1fr;
    grid-template-rows: 100px 40px 20px 80px 1fr 75px min-content;
  }

  .area-title {
    font-size: 16px;
  }
}

@media screen and (max-width: 550px) {
  .search-page-container {
    grid-template-rows: 60px 20px 20px 50px 1fr 75px;
    /* prettier-ignore */
    grid-template-areas:
    "app-header  app-header             app-header"
    "...         title                  ...       "
    "...         search                 ...       "
    "nav         nav                    nav       "
    "...         search-result          ...       "
    "...         loader                 ...       "
    "app-footer  app-footer             app-footer";

    &.user,
    &.tag {
      grid-template-columns: 10px 1fr 10px;
    }
  }
}

@media screen and (max-width: 370px) {
  .search-page-container {
    grid-template-columns: 10px 1fr 10px;

    &.article {
      grid-template-columns: 10px 1fr 10px;
    }

    &.user,
    &.tag {
      .area-search {
        width: 100%;
      }
    }
  }
}
</style>
