<template>
  <div class="search-page-container" :class="showArticles ? 'article' : 'user'" @scroll="infiniteScroll">
    <app-header showDefaultHeaderNav showOnlySessionLinks class="logo-original"/>
    <h1 class="area-title">{{ title }}</h1>
    <form @submit.prevent="search" class="area-search">
      <input
        type="text"
        class="form-input"
        required
        v-model.trim="inputText"
        ref="searchInput">
      <img
        @click="search"
        class="search-icon"
        src="~assets/images/pc/common/icon_search.png">
    </form>
    <nav class="area-nav" v-if="showNav">
      <nuxt-link
        :to="{ path: '/search', query: { context: 'article', q: this.query }}"
        class="area-article nav-link"
        :class="{ 'selected': showArticles }">記事</nuxt-link>
      <nuxt-link
        :to="{ path: '/search', query: { context: 'user', q: this.query }}"
        class="area-user nav-link"
        :class="{ 'selected': !showArticles }">ユーザー</nuxt-link>
    </nav>
    <div class="area-search-result">
      <search-article-card-list :articles="searchArticles.articles" v-if="showArticles"/>
      <search-user-card-list :users="searchUsers.users" v-else/>
    </div>
    <the-loader :isLastPage="!this.query || searchArticles.isLastPage"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import SearchArticleCardList from '../organisms/SearchArticleCardList'
import SearchUserCardList from '../organisms/SearchUserCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    SearchArticleCardList,
    SearchUserCardList,
    TheLoader,
    AppFooter
  },
  computed: {
    title() {
      return 'SEARCH'
    },
    ...mapGetters('article', ['searchArticles']),
    ...mapGetters('user', [
      'searchUsers',
      'notificationsLastEvaluatedKey',
      'hasNotificationsLastEvaluatedKey'
    ]),
    ...mapGetters('presentation', ['searchArticlesScrollHeight', 'searchUsersScrollHeight'])
  },
  created() {
    this.showArticles = this.$route.query.context === 'article'
    this.query = this.$route.query.q
    this.showNav = !!this.query
  },
  mounted() {
    this.$refs.searchInput.focus()
    this.inputText = this.$route.query.q
    if (this.searchArticlesScrollHeight) {
      this.$el.scrollTop = this.searchArticlesScrollHeight
    } else if (this.searchUsersScrollHeight) {
      this.$el.scrollTop = this.searchUsersScrollHeight
    }
  },
  data() {
    return {
      canLoadNextData: true,
      isFetchingData: false,
      showArticles: true,
      query: null,
      showNav: false,
      inputText: '',
      isSearchFirstly: true
    }
  },
  beforeDestroy() {
    this.showArticles
      ? this.setSearchArticlesScrollHeight({ scrollHeight: this.$el.scrollTop })
      : this.setSearchUsersScrollHeight({ scrollHeight: this.$el.scrollTop })
  },
  methods: {
    async search() {
      try {
        this.resetSearchData()
        this.query = this.inputText
        if (this.isFetchingData || !this.query) return
        this.isFetchingData = true
        this.showNav = true
        const path = `/search?context=${this.showArticles ? 'article' : 'user'}&q=${this.query}`
        this.isSearchFirstly ? this.$router.replace(path) : this.$router.push(path)
        this.isSearchFirstly = false
        await this.getSearchData(this.query)
      } catch (error) {
        console.error(error)
      } finally {
        this.isFetchingData = false
      }
    },
    async getSearchData(query) {
      this.showArticles
        ? await this.getSearchArticles({ query })
        : await this.getSearchUsers({ query })
    },
    async infiniteScroll(event) {
      if (this.isFetchingData || !this.query) return
      try {
        this.isFetchingData = true
        if (
          !this.canLoadNextData ||
          !(event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight - 10)
        ) {
          return
        }

        await this.getSearchData(this.query)

        this.canLoadNextData = !this.searchArticles.isLastPage
      } finally {
        this.isFetchingData = false
      }
    },
    resetSearchData() {
      this.resetSearchArticles()
      this.resetSearchArticlesPage()
      this.resetSearchUsers()
      this.resetSearchUsersPage()
    },
    async fetchSearchedData(query) {
      this.resetSearchData()
      this.query = query
      if (typeof this.query !== 'string') return
      this.inputText = this.query
      await this.getSearchData(this.query)
    },
    ...mapActions('user', ['getSearchUsers', 'resetSearchUsers', 'resetSearchUsersPage']),
    ...mapActions('article', [
      'getSearchArticles',
      'resetSearchArticles',
      'resetSearchArticlesPage'
    ]),
    ...mapActions('presentation', ['setSearchArticlesScrollHeight', 'setSearchUsersScrollHeight'])
  },
  watch: {
    async $route(to, from) {
      const { query } = to
      this.showArticles = query.context === 'article'
      this.showNav = !!query.q
      await this.fetchSearchedData(query.q)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-page-container {
  background-size: contain;
  display: grid;
  grid-gap: 20px;
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

  &.user {
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
    border: none;
    border-radius: 0;
    border-bottom: 1px dotted #232538;
    padding: 5px 24px 5px 0;
    width: 400px;
    font-family: YuGothic;

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
  }
}

.area-nav {
  grid-area: nav;
  display: grid;
  text-align: center;
  grid-template-rows: 1fr 30px 1fr;
  grid-template-columns: 1fr 70px 70px 1fr;
  grid-column-gap: 10px;
  /* prettier-ignore */
  grid-template-areas:
    "... ...     ...  ..."
    "... article user ..."
    "... ...     ...  ...";

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
}

.area-search-result {
  grid-area: search-result;
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

    &.user {
      grid-template-columns: 1fr 70vw 1fr;

      .area-search {
        width: 340px;
      }
    }
  }

  .area-search {
    .form-input {
      padding: 5px 0;
    }
  }

  .area-search {
    width: 100%;

    .form-input {
      width: 100%;
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

    &.user {
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
  }
}
</style>
