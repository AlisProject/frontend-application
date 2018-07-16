<template>
  <div class="search-page-container" :class="showArticles ? 'article' : 'user'" @scroll="infiniteScroll">
    <app-header showDefaultHeaderNav showOnlySessionLinks class="logo-original"/>
    <h1 class="area-title">{{ title }}</h1>
    <form @submit.prevent="search" class="area-search">
      <input
        type="text"
        class="form-input"
        required
        v-model="inputText"
        ref="searchInput">
      <img
        @click="search"
        class="search-icon"
        src="~assets/images/pc/common/icon_search.png">
    </form>
    <nav class="area-nav" v-if="showNav">
      <nuxt-link
        :to="{ path: '/search', query: { q: this.query }}"
        class="area-article nav-link"
        :class="{ 'selected': showArticles }"
        @click="showArticleResult">記事</nuxt-link>
      <nuxt-link
        :to="{ path: '/search/users', query: { q: this.query }}"
        class="area-user nav-link"
        :class="{ 'selected': !showArticles }"
        @click="showSearchResult">ユーザー</nuxt-link>
    </nav>
    <div class="area-search-result">
      <search-article-card-list :articles="searchArticles" v-if="showArticles"/>
      <search-user-card-list :users="searchUsers" v-else/>
    </div>
    <the-loader :lastEvaluatedKey="notificationsLastEvaluatedKey"/>
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
    ...mapGetters('presentation', ['notificationListScrollHeight'])
  },
  created() {
    this.query = this.$route.query.q
    this.showNav = !!this.query
  },
  mounted() {
    if (this.notificationListScrollHeight) {
      this.$el.scrollTop = this.notificationListScrollHeight
    }
    this.$el.querySelector('.area-search').focus()
    if (location.pathname.startsWith('/search/users')) {
      this.showArticles = false
    }
    this.inputText = this.$route.query.q
  },
  data() {
    return {
      canLoadNextData: true,
      isFetchingData: false,
      showArticles: true,
      query: null,
      showNav: false,
      inputText: ''
    }
  },
  beforeDestroy() {
    this.setNotificationListScrollHeight({ scrollHeight: this.$el.scrollTop })
  },
  methods: {
    async search() {
      this.query = this.$refs.searchInput.value
      if (!this.query) return
      this.showNav = true
      this.$router.push(`/search${this.showArticles ? '' : '/users'}?q=${this.query}`)
      try {
        await Promise.all([this.getSearchArticles(), this.getSearchUsers()])
      } catch (error) {
        console.error(error)
      }
    },
    showArticleResult() {
      this.showArticles = true
    },
    showSearchResult() {
      this.showArticles = false
    },
    async infiniteScroll(event) {
      if (this.isFetchingData) return
      try {
        this.isFetchingData = true
        if (
          !this.canLoadNextData ||
          !(event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight - 10)
        ) {
          return
        }

        this.showArticles ? await this.getSearchArticles() : await this.getSearchUsers()

        this.canLoadNextData = true
        // this.canLoadNextData = this.hasNotificationsLastEvaluatedKey
      } finally {
        this.isFetchingData = false
      }
    },
    ...mapActions('user', ['getSearchUsers']),
    ...mapActions('article', ['getSearchArticles']),
    ...mapActions('presentation', ['setNotificationListScrollHeight'])
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
    grid-template-rows: 100px 40px 1fr 75px min-content;
  }

  .area-title {
    font-size: 16px;
  }
}

@media screen and (max-width: 550px) {
  .search-page-container {
    grid-template-rows: 60px 20px 20px 50px 1fr 75px 75px;
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
  }
}
</style>
