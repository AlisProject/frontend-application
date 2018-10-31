<template>
  <div class="user-article-list-container long-article-card">
    <app-header />
    <user-article-list-user-info :user="userInfo" />
    <nav class="area-user-profile-nav">
      <ul class="user-profile-nav-ul">
        <li class="user-profile-nav-item">記事一覧</li>
      </ul>
    </nav>
    <article-card-list :articles="userArticles"/>
    <the-loader :isLoading="hasUserArticlesLastEvaluatedKey"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import UserArticleListUserInfo from '../atoms/UserArticleListUserInfo'
import ArticleCardList from '../organisms/ArticleCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable, isScrollBottom } from '~/utils/client'

export default {
  components: {
    AppHeader,
    UserArticleListUserInfo,
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

    // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
    // 画面の高さに合うまで要素を取得する。

    // 画面の高さに合っているかをスクロールできるかどうかで判定
    if (!isPageScrollable(this.$el)) {
      if (!this.hasUserArticlesLastEvaluatedKey) return
      this.getUserArticles({ userId: this.$route.params.userId })
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.infiniteScroll)
  },
  computed: {
    ...mapGetters('user', ['userInfo', 'userArticles', 'hasUserArticlesLastEvaluatedKey'])
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
    ...mapActions('user', ['getUserArticles'])
  },
  watch: {
    async userArticles() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (isPageScrollable(this.$el) || !this.hasUserArticlesLastEvaluatedKey) return
      this.getUserArticles({ userId: this.$route.params.userId })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-article-list-container {
  display: grid;
  grid-template-rows: 100px auto 1fr 75px 75px;
  grid-template-columns: 1fr 1080px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header        app-header"
    "...         user-info         ...       "
    "...         article-card-list ...       "
    "...         loader            ...       "
    "app-footer  app-footer        app-footer";
}

.area-user-profile-nav {
  grid-area: user-profile-nav;
  display: none;
}

@media screen and (max-width: 1296px) {
  .user-article-list-container {
    grid-template-columns: 1fr 710px 1fr;
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
    grid-template-rows: 66px min-content 50px 1fr 75px min-content;
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
    grid-area: user-profile-nav;
    display: block;
    border-bottom: 1px solid #e6e6e6;
    border-top: 1px solid #e6e6e6;

    .user-profile-nav-ul {
      margin: 0;
      padding-left: calc(50vw - 175px);

      .user-profile-nav-item {
        list-style: none;
        height: 48px;
        width: 48px;
        color: #99a2ff;
        font-size: 12px;
        line-height: 48px;
        border-bottom: 1px solid #99a2ff;
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
