<template>
  <div class="user-article-list-container long-article-card">
    <app-header />
    <user-article-list-user-info :user="userInfo" />
    <no-ssr>
      <nav class="area-user-profile-nav" v-if="isCurrentUser">
        <ul class="user-profile-nav-ul">
          <li class="user-profile-nav-item active">
            <nuxt-link class="link" :to="`/users/${$route.params.userId}`">
              公開中
            </nuxt-link>
          </li>
          <li class="user-profile-nav-item">
            <nuxt-link class="link" :to="`/users/${$route.params.userId}/drafts`">
              下書き
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </no-ssr>
    <user-article-card-list :articles="isCurrentUser ? publicArticles : userArticles"/>
    <the-loader :isLoading="isCurrentUser ? hasPublicArticlesLastEvaluatedKey : hasUserArticlesLastEvaluatedKey"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import UserArticleListUserInfo from '../atoms/UserArticleListUserInfo'
import UserArticleCardList from '../organisms/UserArticleCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable, isScrollBottom } from '~/utils/client'

export default {
  components: {
    AppHeader,
    UserArticleListUserInfo,
    UserArticleCardList,
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

    // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
    // 画面の高さに合うまで要素を取得する。

    // 画面の高さに合っているかをスクロールできるかどうかで判定
    if (!isPageScrollable(this.$el)) {
      if (this.isCurrentUser) {
        if (!this.hasPublicArticlesLastEvaluatedKey || this.publicArticles.length === 0) return
        this.getPublicArticles()
      } else {
        if (!this.hasUserArticlesLastEvaluatedKey || this.userArticles.length === 0) return
        this.getUserArticles({ userId: this.$route.params.userId })
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.infiniteScroll)
  },
  computed: {
    isCurrentUser() {
      return this.loggedIn && this.$route.params.userId === this.currentUser.userId
    },
    ...mapGetters('article', [
      'publicArticles',
      'publicArticlesLastEvaluatedKey',
      'hasPublicArticlesLastEvaluatedKey'
    ]),
    ...mapGetters('user', [
      'userInfo',
      'userArticles',
      'hasUserArticlesLastEvaluatedKey',
      'loggedIn',
      'currentUser'
    ])
  },
  methods: {
    async infiniteScroll(event) {
      if (this.isFetchingArticles) return
      try {
        this.isFetchingArticles = true
        if (!isScrollBottom()) return

        await this.getUserArticles({ userId: this.$route.params.userId })
      } finally {
        this.isFetchingArticles = false
      }
    },
    ...mapActions('user', ['getUserArticles']),
    ...mapActions('article', ['getPublicArticles'])
  },
  watch: {
    async userArticles() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (
        isPageScrollable(this.$el) ||
        !this.hasUserArticlesLastEvaluatedKey ||
        this.userArticles.length === 0
      ) {
        return
      }
      this.getUserArticles({ userId: this.$route.params.userId })
    },
    async publicArticles() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (
        isPageScrollable(this.$el) ||
        !this.hasPublicArticlesLastEvaluatedKey ||
        this.publicArticles.length === 0
      ) {
        return
      }
      this.getPublicArticles()
    }
  }
}
</script>

<style lang="scss" scoped>
.user-article-list-container {
  display: grid;
  grid-template-rows: 100px auto auto 1fr 75px 75px;
  grid-template-columns: 1fr 710px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header        app-header"
    "...        user-info         ...       "
    "...        user-profile-nav  ...       "
    "...        article-card-list ...       "
    "...        loader            ...       "
    "app-footer app-footer        app-footer";
  min-height: 100vh;
}

.area-user-profile-nav {
  grid-area: user-profile-nav;
  display: block;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 40px;

  .user-profile-nav-ul {
    margin: 0;
    padding: 0;
    display: flex;

    .user-profile-nav-item {
      list-style: none;
      height: 20px;
      width: 40px;
      color: #99a2ff;
      font-size: 12px;
      margin-right: 24px;
      text-align: center;

      &.active {
        color: #0086cc;
        border-bottom: 1px solid #0086cc;

        .link {
          color: #0086cc;
        }
      }

      .link {
        text-decoration: none;
        color: #6e6e6e;
      }
    }
  }
}

@media screen and (max-width: 920px) {
  .user-article-list-container {
    grid-template-columns: 1fr 340px 1fr;
  }
}

@media screen and (max-width: 550px) {
  .user-article-list-container {
    background: #fff;
    grid-template-columns: 1fr 350px 1fr;
    grid-template-rows: 66px min-content auto 1fr 75px min-content;
    grid-row-gap: 20px;
    /* prettier-ignore */
    grid-template-areas:
    "app-header       app-header        app-header"
    "user-info        user-info         user-info "
    "user-profile-nav user-profile-nav  user-profile-nav"
    "...              article-card-list ...       "
    "...              loader            ...       "
    "app-footer       app-footer        app-footer";
  }

  .area-user-profile-nav {
    border-top: 1px solid #e6e6e6;
    margin-bottom: 0;

    .user-profile-nav-ul {
      margin: 0;
      padding-left: 12px;
      display: flex;

      .user-profile-nav-item {
        height: 22px;
        padding-top: 10px;
      }
    }
  }
}

@media screen and (max-width: 370px) {
  .user-article-list-container {
    grid-template-columns: 10px 1fr 10px;
  }
}

@media screen and (max-width: 320px) {
  .area-user-profile-nav {
    .user-profile-nav-ul {
      padding-left: 10px;
    }
  }
}
</style>
