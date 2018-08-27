<template>
  <div class="tag-article-list">
    <app-header showDefaultHeaderNav showOnlySessionLinks class="without-shadow"/>
    <div class="area-tag">
      {{ this.$route.params.tag }}
    </div>
    <div class="area-nav">
      nav
    </div>
    <div class="area-tag-articles">
      <search-article-card-list :articles="tagArticles.articles"/>
    </div>
    <app-footer/>
  </div>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex'
import { mapGetters } from 'vuex'
// import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppHeader from '../organisms/AppHeader'
import SearchArticleCardList from '../organisms/SearchArticleCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    SearchArticleCardList,
    TheLoader,
    AppFooter
  },
  computed: {
    ...mapGetters('article', ['tagArticles'])
  }
}
</script>


<style lang="scss" scoped>
.tag-article-list {
  display: grid;
  grid-row-gap: 20px;
  grid-template-columns: 1fr 1080px 1fr;
  grid-template-rows: 100px 30px 30px 1fr 75px 75px;
  // grid-template-rows: 100px 60px 20px 80px 1fr 75px 75px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header             app-header"
    "...         tag                    ...       "
    "...         nav                    ...       "
    "...         tag-articles           ...       "
    "...         loader                 ...       "
    "app-footer  app-footer             app-footer";
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.area-tag {
  grid-area: tag;
  color: #030303;
  font-size: 20px;
  letter-spacing: 0.25px;
  line-height: 1.5;
}

.area-nav {
  grid-area: nav;
}

.area-tag-articles {
  grid-area: tag-articles;
}

@media screen and (max-width: 1296px) {
  .tag-article-list {
    grid-template-columns: 1fr 710px 1fr;
  }
}

@media screen and (max-width: 920px) {
  .tag-article-list {
    grid-template-columns: 1fr 340px 1fr;
  }
}

@media screen and (max-width: 640px) {
  .tag-article-list {
    grid-template-columns: 1fr 340px 1fr;
    grid-template-rows: 100px 40px 20px 1fr 75px min-content;
  }
}

@media screen and (max-width: 550px) {
  .search-page-container {
    grid-template-rows: 60px 20px 20px 50px 1fr 75px;
    /* prettier-ignore */
    grid-template-areas:
      "app-header  app-header             app-header"
      "...         tag                    ...       "
      "nav         nav                    nav       "
      "...         tag-articles           ...       "
      "...         loader                 ...       "
      "app-footer  app-footer             app-footer";
  }
}
</style>
