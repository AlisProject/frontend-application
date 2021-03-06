<template>
  <div class="draft-article-list-container">
    <app-header />
    <user-article-list-user-info :user="userInfo" />
    <user-profile-nav :isCurrentUser="true" />
    <user-article-card-list :articles="draftArticles" :link-to="'draft'" />
    <the-loader :is-loading="hasDraftArticlesLastEvaluatedKey" />
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
      if (!this.hasDraftArticlesLastEvaluatedKey || this.draftArticles.length === 0) return
      this.getDraftArticles()
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.infiniteScroll)
  },
  computed: {
    ...mapGetters('article', ['draftArticles', 'hasDraftArticlesLastEvaluatedKey']),
    ...mapGetters('user', ['userInfo'])
  },
  methods: {
    async infiniteScroll(event) {
      if (this.isFetchingArticles) return
      try {
        this.isFetchingArticles = true
        if (!isScrollBottom()) return

        await this.getDraftArticles()
      } finally {
        this.isFetchingArticles = false
      }
    },
    ...mapActions('article', ['getDraftArticles'])
  },
  watch: {
    async draftArticles() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (
        isPageScrollable(this.$el) ||
        !this.hasDraftArticlesLastEvaluatedKey ||
        this.draftArticles.length === 0
      ) {
        return
      }
      this.getDraftArticles()
    }
  }
}
</script>

<style lang="scss" scoped>
.draft-article-list-container {
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
  .draft-article-list-container {
    grid-template-columns: minmax(0, 1fr) 340px minmax(0, 1fr);
  }
}

@media screen and (max-width: 550px) {
  .draft-article-list-container {
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
  .draft-article-list-container {
    grid-template-columns: 10px minmax(0, 1fr) 10px;
  }
}
</style>
