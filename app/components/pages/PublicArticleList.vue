<template>
  <div class="public-article-list-container long-article-card" @scroll="infiniteScroll">
    <app-header showEditHeaderNav class="public-articles logo-original"/>
    <article-card-list :articles="publicArticles" :linkTo="'public'"/>
    <!-- <the-loader :lastEvaluatedKey="publicArticlesLastEvaluatedKey"/> -->
    <app-footer/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import ArticleCardList from '../organisms/ArticleCardList'
// import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    ArticleCardList,
    // TheLoader,
    AppFooter
  },
  data() {
    return {
      isFetchingArticles: false
    }
  },
  computed: {
    ...mapGetters('article', ['publicArticles', 'publicArticlesLastEvaluatedKey'])
  },
  methods: {
    async infiniteScroll(event) {
      if (this.isFetchingArticles) return
      try {
        this.isFetchingArticles = true
        if (
          !(event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight - 10)
        ) {
          return
        }
        await this.getPublicArticles()
      } finally {
        this.isFetchingArticles = false
      }
    },
    ...mapActions('article', ['getPublicArticles'])
  }
}
</script>

<style lang="scss" scoped>
.public-article-list-container {
  display: grid;
  grid-template-rows: 100px 40px 1fr 75px 75px;
  grid-template-columns: 1fr 1080px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header        app-header"
    "...         ...               ...       "
    "...         article-card-list ...       "
    "...         loader            ...       "
    "app-footer  app-footer        app-footer";
  background: #f7f7f7;
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

@media screen and (max-width: 1296px) {
  .public-article-list-container {
    grid-template-columns: 1fr 710px 1fr;
  }
}

@media screen and (max-width: 920px) {
  .public-article-list-container {
    grid-template-columns: 1fr 340px 1fr;
  }
}

@media screen and (max-width: 550px) {
  .public-article-list-container {
    grid-template-rows: 100px 40px 1fr 75px min-content;
    grid-template-columns: 1fr 350px 1fr;
  }
}

@media screen and (max-width: 370px) {
  .public-article-list-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
