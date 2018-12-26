<template>
  <div class="popular-article-list-container">
    <app-header />
    <default-header-nav/>
    <article-type-select-nav />
    <article-card-list :articles="popularArticles"/>
    <create-new-article-button class="is-fixed-button" @click="moveToNewArticlePage"/>
    <the-loader :isLoading="!isLastPage"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import DefaultHeaderNav from '../molecules/DefaultHeaderNav'
import ArticleTypeSelectNav from '../organisms/ArticleTypeSelectNav'
import ArticleCardList from '../organisms/ArticleCardList'
import CreateNewArticleButton from '../atoms/CreateNewArticleButton'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable, isScrollBottom } from '~/utils/client'

export default {
  components: {
    AppHeader,
    DefaultHeaderNav,
    ArticleTypeSelectNav,
    ArticleCardList,
    CreateNewArticleButton,
    TheLoader,
    AppFooter
  },
  data() {
    return {
      isFetchingArticles: false,
      topicNumber: 1
    }
  },
  computed: {
    ...mapGetters('article', ['popularArticles', 'isLastPage', 'topics']),
    ...mapGetters('user', ['loggedIn', 'currentUser']),
    ...mapGetters('presentation', ['articleListScrollHeight'])
  },
  mounted() {
    window.addEventListener('scroll', this.infiniteScroll)

    // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
    // 画面の高さに合うまで要素を取得する。

    // 画面の高さに合っているかをスクロールできるかどうかで判定
    if (!isPageScrollable(this.$el)) {
      if (this.isLastPage) return
      this.getPopularArticles({ topic: this.$route.query.topic })
    }
    if (this.articleListScrollHeight) {
      this.$el.scrollTop = this.articleListScrollHeight
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.infiniteScroll)
    this.setArticleListScrollHeight({ scrollHeight: this.$el.scrollTop })
  },
  methods: {
    async infiniteScroll(event) {
      if (this.isFetchingArticles) return
      try {
        this.isFetchingArticles = true

        if (this.isLastPage || !isScrollBottom()) return

        await this.getPopularArticles({ topic: this.$route.query.topic || 'crypto' })
      } finally {
        this.isFetchingArticles = false
      }
    },
    moveToNewArticlePage() {
      if (!this.loggedIn) {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleCreate' })
        return
      }
      if (!this.currentUser.phoneNumberVerified) {
        this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleCreate' })
        this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
        return
      }
      location.href = '/me/articles/new'
    },
    ...mapActions('article', ['getPopularArticles', 'resetArticleData', 'setTopicDisplayName']),
    ...mapActions('user', [
      'setRequestLoginModal',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal'
    ]),
    ...mapActions('presentation', ['setArticleListScrollHeight'])
  },
  watch: {
    async popularArticles() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態なるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (isPageScrollable(this.$el) || this.isLastPage || this.popularArticles.length === 0) return
      this.getPopularArticles({ topic: this.$route.query.topic })
    },
    $route(to) {
      this.resetArticleData()
      this.setTopicDisplayName({ topicName: to.query.topic })
      this.getPopularArticles({ topic: to.query.topic })
    }
  }
}
</script>

<style lang="scss" scoped>
.popular-article-list-container {
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header              app-header              app-header"
    "nav                     nav                     nav       "
    "article-type-select-nav article-type-select-nav article-type-select-nav"
    "...                     article-card-list       ...       "
    "...                     loader                  ...       "
    "app-footer              app-footer              app-footer";
  grid-template-columns: 1fr 1080px 1fr;
  grid-template-rows: 100px auto 84px 1fr 75px 75px;
  min-height: 100vh;
}

.is-fixed-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
}

@media screen and (max-width: 1296px) {
  .popular-article-list-container {
    grid-template-columns: 1fr 710px 1fr;
  }
}

@media screen and (max-width: 920px) {
  .popular-article-list-container {
    grid-template-columns: 1fr 340px 1fr;
  }
}

@media screen and (max-width: 550px) {
  .popular-article-list-container {
    grid-template-rows: 66px minmax(50px, min-content) 60px 1fr 75px min-content;
    grid-template-columns: 1fr 350px 1fr;
  }
}

@media screen and (max-width: 370px) {
  .popular-article-list-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
