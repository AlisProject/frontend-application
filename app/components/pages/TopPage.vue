<template>
  <div class="top-page" :class="{ 'is-show-guide': isShowGuide }">
    <app-header />
    <default-header-nav class="default-header-nav" />
    <top-notices />
    <div v-if="isInit" class="area-recommended-tip-ranking">
      <div class="label">
        投げ銭によるオススメ
      </div>
      <nuxt-link class="more-link-pc" to="/articles/ranking/tip">
        もっと見る
      </nuxt-link>
    </div>
    <tip-eyecatch-article-card-list
      :articles="tipEyecatchArticles"
      class="tip-eyecatch-article-card-list"
    />
    <div v-if="isInit" class="area-recommended-like-ranking">
      <div class="label">
        いいねによるオススメ
      </div>
    </div>
    <recommended-article-card-list
      :articles="tipEyecatchArticles"
      :isTipRanking="true"
      class="eyecatch-article-card-list-sp"
    />
    <div v-if="isInit" class="area-more-link">
      <nuxt-link class="more-link-sp" to="/articles/ranking/tip">
        もっと見る ＞
      </nuxt-link>
    </div>
    <recommended-article-card-list
      :articles="recommendedArticles.articles"
      class="recommended-article-card-list"
    />
    <how-to-use-image class="how-to-use-image" />
    <sub-footer class="sub-footer" />
    <the-loader :is-loading="!recommendedArticles.isLastPage" />
    <app-footer class="app-footer" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import DefaultHeaderNav from '../molecules/DefaultHeaderNav'
import TopNotices from '../organisms/TopNotices'
import TipEyecatchArticleCardList from '../organisms/TipEyecatchArticleCardList'
import RecommendedArticleCardList from '../organisms/RecommendedArticleCardList'
import HowToUseImage from '../organisms/HowToUseImage'
import SubFooter from '../organisms/SubFooter'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable, isScrollBottom } from '~/utils/client'

export default {
  components: {
    AppHeader,
    DefaultHeaderNav,
    TopNotices,
    TipEyecatchArticleCardList,
    RecommendedArticleCardList,
    HowToUseImage,
    SubFooter,
    TheLoader,
    AppFooter
  },
  data() {
    return {
      isFetchingArticles: false,
      isShowGuide: false,
      isInit: false
    }
  },
  computed: {
    ...mapGetters('article', ['tipEyecatchArticles', 'recommendedArticles']),
    ...mapGetters('user', ['loggedIn', 'currentUser', 'muteUsers']),
    ...mapGetters('presentation', ['articleListScrollHeight'])
  },
  async mounted() {
    if (!this.loggedIn) {
      this.isShowGuide = true
    }
    await this.getMuteUsers()
    // Eyecatch 部分が読み込み完了次第、描画を行う
    await this.getTipEyecatchArticles()
    await this.$nextTick()
    this.isInit = true
    await this.getRecommendedArticles()

    window.addEventListener('scroll', this.infiniteScroll)

    // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
    // 画面の高さに合うまで要素を取得する。

    // 画面の高さに合っているかをスクロールできるかどうかで判定
    if (!isPageScrollable(this.$el)) {
      if (this.recommendedArticles.isLastPage || this.recommendedArticles.articles.length === 0) {
        return
      }
      await this.getRecommendedArticles()
    }
    if (this.articleListScrollHeight) {
      this.$el.scrollTop = this.articleListScrollHeight
    }

    if (!this.loggedIn && this.$route.query.isSignUp === 'true') {
      this.setSignUpModal({ showSignUpModal: true })
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

        if (this.recommendedArticles.isLastPage || !isScrollBottom()) return

        await this.getRecommendedArticles()
      } finally {
        this.isFetchingArticles = false
      }
    },
    async moveToNewArticlePage() {
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
    ...mapActions('article', ['getTipEyecatchArticles', 'getRecommendedArticles']),
    ...mapActions('user', [
      'setSignUpModal',
      'setRequestLoginModal',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal',
      'getMuteUsers'
    ]),
    ...mapActions('presentation', ['setArticleListScrollHeight'])
  },
  watch: {
    async 'recommendedArticles.articles'() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態なるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (
        isPageScrollable(this.$el) ||
        this.recommendedArticles.isLastPage ||
        this.recommendedArticles.articles.length === 0
      ) {
        return
      }
      await this.getRecommendedArticles()
    },
    loggedIn(newState) {
      // ログインしたときにALISの使い方を非表示にする
      if (newState) this.isShowGuide = false
    }
  }
}
</script>

<style lang="scss" scoped>
.top-page {
  display: grid;
  grid-column-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header                     app-header                     app-header"
    "nav        nav                            nav                            nav       "
    "...        notices                        notices                        ...       "
    "...        recommended-tip-ranking        recommended-tip-ranking        ...       "
    "...        ...                            ...                            ...       "
    "...        tip-eyecatch-article-card-list tip-eyecatch-article-card-list ...       "
    "...        recommended-like-ranking       recommended-like-ranking       ...       "
    "...        ...                            ...                            ...       "
    "...        article-card-list              article-card-list              ...       "
    "...        article-card-list              article-card-list              ...       "
    "...        loader                         loader                         ...       "
    "app-footer app-footer                     app-footer                     app-footer";

  grid-template-columns: minmax(0, 1fr) 710px 340px minmax(0, 1fr);
  grid-template-rows:
    100px minmax(50px, min-content) 43px 26px 30px auto 26px 30px auto minmax(0, 1fr)
    75px 75px;
  min-height: 100vh;

  &.is-show-guide {
    grid-template-rows:
      100px minmax(50px, min-content) 43px 26px 30px auto 26px 30px 652px minmax(
        100px,
        minmax(0, 1fr)
      )
      75px 75px;
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header                     app-header                     app-header"
      "nav        nav                            nav                            nav       "
      "...        notices                        notices                        ...       "
      "...        recommended-tip-ranking        recommended-tip-ranking        ...       "
      "...        ...                            ...                            ...       "
      "...        tip-eyecatch-article-card-list tip-eyecatch-article-card-list ...       "
      "...        recommended-like-ranking       recommended-like-ranking       ...       "
      "...        ...                            ...                            ...       "
      "...        article-card-list              how-to-use-image               ...       "
      "...        article-card-list              sub-footer                     ...       "
      "...        loader                         loader                         ...       ";

    .how-to-use-image,
    .sub-footer {
      display: block;
    }

    .how-to-use-image {
      margin-bottom: 30px;
    }

    .app-footer {
      display: none;
    }
  }

  .default-header-nav {
    margin-bottom: 18px;
  }

  .how-to-use-image,
  .sub-footer {
    display: none;
  }

  .tip-eyecatch-article-card-list {
    margin-bottom: 30px;
  }

  .eyecatch-article-card-list-sp {
    display: none;
    grid-area: eyecatch-article-card-list-sp;
  }
}

.area-recommended-tip-ranking {
  grid-area: recommended-tip-ranking;
  border-bottom: 1px solid rgba(#cecece, 0.3);
  display: flex;
  justify-content: space-between;
}

.label {
  color: #333333;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #6e6e6e;
}

.more-link-pc {
  color: #6e6e6e;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
}

.area-more-link {
  display: none;
}

.more-link-sp {
  display: none;
}

.area-recommended-like-ranking {
  grid-area: recommended-like-ranking;
  border-bottom: 1px solid rgba(#cecece, 0.3);
  display: flex;
  justify-content: space-between;
}

.is-fixed-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
}

@media screen and (max-width: 1296px) {
  .top-page {
    grid-template-columns: minmax(0, 1fr) 710px minmax(0, 1fr);
    grid-template-rows: 100px minmax(50px, min-content) 43px 26px 30px auto 26px 30px minmax(0, 1fr) 75px 75px;
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header                     app-header"
      "nav        nav                            nav       "
      "...        notices                        ...       "
      "...        recommended-tip-ranking        ...       "
      "...        ...                            ...       "
      "...        tip-eyecatch-article-card-list ...       "
      "...        recommended-like-ranking       ...       "
      "...        ...                            ...       "
      "...        article-card-list              ...       "
      "...        loader                         ...       "
      "app-footer app-footer                     app-footer";

    &.is-show-guide {
      grid-template-rows:
        100px minmax(50px, min-content) 43px 26px 30px auto 26px 30px auto minmax(0, 1fr)
        75px 75px;
      /* prettier-ignore */
      grid-template-areas:
        "app-header app-header                     app-header"
        "nav        nav                            nav       "
        "...        notices                        ...       "
        "...        recommended-tip-ranking        ...       "
        "...        ...                            ...       "
        "...        tip-eyecatch-article-card-list ...       "
        "...        recommended-like-ranking       ...       "
        "...        ...                            ...       "
        "...        how-to-use-image               ...       "
        "...        article-card-list              ...       "
        "...        loader                         ...       "
        "app-footer app-footer                     app-footer";

      .sub-footer {
        display: none;
      }

      .app-footer {
        display: flex;
      }
    }

    .app-footer {
      display: flex;
    }
  }
}

@media screen and (max-width: 920px) {
  .top-page {
    grid-template-columns: minmax(0, 1fr) 340px minmax(0, 1fr);
    grid-template-rows: 100px 80px 43px 26px 30px auto 60px 26px 30px minmax(0, 1fr) 75px minmax(
        75px,
        min-content
      );
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header                    app-header"
      "nav        nav                           nav       "
      "...        notices                       ...       "
      "...        recommended-tip-ranking       ...       "
      "...        ...                           ...       "
      "...        eyecatch-article-card-list-sp ...       "
      "...        more-link                     ...       "
      "...        recommended-like-ranking      ...       "
      "...        ...                           ...       "
      "...        article-card-list             ...       "
      "...        loader                        ...       "
      "app-footer app-footer                    app-footer";

    &.is-show-guide {
      grid-template-rows: 100px 80px 43px auto 26px 30px auto 60px 26px 30px minmax(0, 1fr) 75px minmax(
          75px,
          min-content
        );
      /* prettier-ignore */
      grid-template-areas:
        "app-header app-header                    app-header"
        "nav        nav                           nav       "
        "...        notices                       ...       "
        "...        how-to-use-image              ...       "
        "...        recommended-tip-ranking       ...       "
        "...        ...                           ...       "
        "...        eyecatch-article-card-list-sp ...       "
        "...        more-link                     ...       "
        "...        recommended-like-ranking      ...       "
        "...        ...                           ...       "
        "...        article-card-list             ...       "
        "...        loader                        ...       "
        "app-footer app-footer                    app-footer";
    }

    .eyecatch-article-card-list-sp {
      display: grid;
      grid-area: eyecatch-article-card-list-sp;
      margin-bottom: 20px;
    }

    .tip-eyecatch-article-card-list {
      display: none;
    }
  }

  .area-more-link {
    grid-area: more-link;
    display: block;
  }

  .more-link-pc {
    display: none;
  }

  .more-link-sp {
    display: block;
    color: #6e6e6e;
    font-size: 12px;
    font-weight: bold;
    text-align: right;
  }
}

@media screen and (max-width: 550px) {
  .top-page {
    grid-template-rows:
      66px minmax(50px, min-content) 36px 30px 26px auto 60px 26px 30px minmax(0, 1fr)
      75px min-content;
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header                    app-header"
      "nav        nav                           nav       "
      "...        notices                       ...       "
      "...        ...                           ...       "
      "...        recommended-tip-ranking       ...       "
      "...        eyecatch-article-card-list-sp ...       "
      "...        more-link                     ...       "
      "...        recommended-like-ranking      ...       "
      "...        ...                           ...       "
      "...        article-card-list             ...       "
      "...        loader                        ...       "
      "app-footer app-footer                    app-footer";
    grid-gap: 0;

    &.is-show-guide {
      grid-template-rows:
        66px minmax(50px, min-content) 44px auto 30px 26px auto 60px 26px 30px minmax(0, 1fr)
        75px min-content;
      /* prettier-ignore */
      grid-template-areas:
        "app-header       app-header                    app-header      "
        "nav              nav                           nav             "
        "...              notices                       ...             "
        "how-to-use-image how-to-use-image              how-to-use-image"
        "...              ...                           ...             "
        "...              recommended-tip-ranking       ...             "
        "...              eyecatch-article-card-list-sp ...             "
        "...              more-link                     ...             "
        "...              recommended-like-ranking      ...             "
        "...              ...                           ...             "
        "...              article-card-list             ...             "
        "...              loader                        ...             "
        "app-footer       app-footer                    app-footer      ";

      .how-to-use-image {
        margin: 12px 0 0;
      }
    }

    .default-header-nav {
      margin-bottom: 0;
    }

    .eyecatch-article-card-list-sp {
      margin-top: 24px;
    }
  }
}

@media screen and (max-width: 360px) {
  .top-page {
    grid-template-columns: minmax(10px, 1fr) calc(100% - 20px) minmax(10px, 1fr);
  }
}
</style>
