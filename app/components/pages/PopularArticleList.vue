<template>
  <div class="popular-article-list-container" @scroll="infiniteScroll">
    <app-header showDefaultHeaderNav :class="`topic${topicNumber}`"/>
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
  data() {
    return {
      isFetchingArticles: false,
      topicNumber: 1
    }
  },
  computed: {
    ...mapGetters('article', ['popularArticles', 'popularArticlesLastEvaluatedKey', 'topics']),
    ...mapGetters('presentation', ['articleListScrollHeight'])
  },
  mounted() {
    if (this.articleListScrollHeight) {
      this.$el.scrollTop = this.articleListScrollHeight
    }
  },
  beforeDestroy() {
    this.setArticleListScrollHeight({ scrollHeight: this.$el.scrollTop })
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
        await this.getPopularArticles()
      } finally {
        this.isFetchingArticles = false
      }
    },
    setTopicNumber() {
      this.topics.forEach((topic) => {
        if (topic.name === this.$route.query.topics) this.topicNumber = topic.order
      })
    },
    ...mapActions('article', ['getPopularArticles']),
    ...mapActions('presentation', ['setArticleListScrollHeight'])
  },
  watch: {
    $route() {
      this.setTopicNumber()
    },
    topics() {
      this.setTopicNumber()
    }
  }
}
</script>

<style lang="scss" scoped>
.popular-article-list-container {
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header        app-header"
    "...         ...               ...       "
    "...         article-card-list ...       "
    "...         loader            ...       "
    "app-footer  app-footer        app-footer";
  grid-template-columns: 1fr 1080px 1fr;
  grid-template-rows: 100px 20px 1fr 75px 75px;
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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
    background: #f7f7f7;
    grid-template-rows: 92px 28px 1fr 75px min-content;
    grid-template-columns: 1fr 350px 1fr;
  }
}

@media screen and (max-width: 370px) {
  .popular-article-list-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
