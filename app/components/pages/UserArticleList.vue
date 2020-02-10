<template>
  <div class="user-article-list-container long-article-card">
    <app-header />
    <user-article-list-user-info :user="isCurrentUser ? currentUserInfo : userInfo" />
    <no-ssr>
      <user-profile-nav :isCurrentUser="isCurrentUser" />
    </no-ssr>
    <user-article-card-list :articles="isCurrentUser ? publicArticles : userArticles" />
    <the-loader
      :is-loading="
        isCurrentUser ? hasPublicArticlesLastEvaluatedKey : hasUserArticlesLastEvaluatedKey
      "
    />
    <app-footer />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import UserArticleListUserInfo from '../atoms/UserArticleListUserInfo'
import UserProfileNav from '../molecules/UserProfileNav'
import UserArticleCardList from '../organisms/UserArticleCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable, isScrollBottom } from '~/utils/client'

export default {
  components: {
    AppHeader,
    UserArticleListUserInfo,
    UserProfileNav,
    UserArticleCardList,
    TheLoader,
    AppFooter
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
    ...mapGetters('article', ['publicArticles', 'hasPublicArticlesLastEvaluatedKey']),
    ...mapGetters('user', [
      'userInfo',
      'userArticles',
      'hasUserArticlesLastEvaluatedKey',
      'loggedIn',
      'currentUser',
      'currentUserInfo'
    ])
  },
  methods: {
    async infiniteScroll(event) {
      if (!isScrollBottom()) return

      if (this.isCurrentUser) {
        await this.getPublicArticles()
      } else {
        await this.getUserArticles({ userId: this.$route.params.userId })
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
    },
    isCurrentUser(newState) {
      // ログインユーザーのプロフィールページでログインしたとき、公開済み記事データを取得
      if (newState) this.getPublicArticles()
    }
  }
}
</script>

<style lang="scss" scoped>
.user-article-list-container {
  display: grid;
  grid-template-rows: 100px auto auto minmax(0, 1fr) 75px 75px;
  grid-template-columns: minmax(0, 1fr) 710px minmax(0, 1fr);
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

@media screen and (max-width: 920px) {
  .user-article-list-container {
    grid-template-columns: minmax(0, 1fr) 340px minmax(0, 1fr);
  }
}

@media screen and (max-width: 550px) {
  .user-article-list-container {
    background: #fff;
    grid-template-columns: minmax(0, 1fr) 340px minmax(0, 1fr);
    grid-template-rows: 66px min-content auto minmax(0, 1fr) 75px min-content;
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
}

@media screen and (max-width: 370px) {
  .user-article-list-container {
    grid-template-columns: 10px minmax(0, 1fr) 10px;
  }
}
</style>
