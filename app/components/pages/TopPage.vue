<template>
  <div class="top-container" @scroll="infiniteScroll">
    <app-header showDefaultHeaderNav class="popular-articles logo-white"/>
    <article-card-list :articles="popularArticles"/>
    <the-loader :lastEvaluatedKey="popularArticlesLastEvaluatedKey"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import ArticleCardList from '../organisms/ArticleCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    ArticleCardList,
    TheLoader,
    AppFooter
  },
  computed: {
    ...mapGetters('article', ['popularArticles', 'popularArticlesLastEvaluatedKey'])
  },
  methods: {
    infiniteScroll(event) {
      if (event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight) {
        this.getPopularArticles()
      }
    },
    ...mapActions('article', ['getPopularArticles'])
  }
}
</script>

<style lang="scss" scoped>
.top-container {
  background: url('~assets/images/pc/bg/bg_top.png') no-repeat;
  background-color: #f7f7f7;
  background-size: contain;
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header        app-header"
    "...         ...               ...       "
    "...         article-card-list ...       "
    "...         loader            ...       "
    "app-footer  app-footer        app-footer";
  grid-template-columns: 1fr 1080px 1fr;
  grid-template-rows: 100px 190px 1fr 75px 75px;
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

@media screen and (max-width: 1296px) {
  .top-container {
    grid-template-columns: 1fr 710px 1fr;
  }
}

@media screen and (max-width: 920px) {
  .top-container {
    grid-template-columns: 1fr 340px 1fr;
  }
}

@media screen and (max-width: 550px) {
  .top-container {
    background: #f7f7f7;
    grid-template-rows: 100px 15px 1fr 75px min-content;
    grid-template-columns: 1fr 350px 1fr;
  }
}

@media screen and (max-width: 370px) {
  .top-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
