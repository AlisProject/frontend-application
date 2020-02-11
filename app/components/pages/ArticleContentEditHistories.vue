<template>
  <div class="article-content-edit-history-list-container">
    <app-header />
    <h1 class="area-title">
      編集履歴一覧
    </h1>
    <article-content-edit-history-card-list
      :articleContentEditHistories="articleContentEditHistories"
    />
    <app-footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import ArticleContentEditHistoryCardList from '../organisms/ArticleContentEditHistoryCardList'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    ArticleContentEditHistoryCardList,
    AppFooter
  },
  mounted() {
    if (this.articleContentEditHistories == null) {
      const { articleId } = this.$route.params
      this.$store.dispatch('article/getArticleContentEditHistories', { articleId })
    }
  },
  computed: {
    ...mapGetters('article', ['articleContentEditHistories'])
  }
}
</script>

<style lang="scss" scoped>
.article-content-edit-history-list-container {
  background-size: contain;
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header                              app-header"
    "...         title                                   ...       "
    "...         article-content-edit-history-card-list  ...       "
    "app-footer  app-footer                              app-footer";
  grid-template-columns: minmax(0, 1fr) 460px minmax(0, 1fr);
  grid-template-rows: 100px 50px minmax(0, 1fr) 75px;
  min-height: 100vh;
}

.area-title {
  font-size: 20px;
  grid-area: title;
  letter-spacing: 1.33px;
  margin: 0;
}

@media screen and (max-width: 920px) {
  .article-content-edit-history-list-container {
    grid-template-columns: minmax(0, 1fr) 460px minmax(0, 1fr);
  }
}

@media screen and (max-width: 640px) {
  .article-content-edit-history-list-container {
    grid-template-columns: minmax(0, 1fr) 340px minmax(0, 1fr);
    grid-template-rows: 66px 40px minmax(0, 1fr) min-content;
  }

  .area-title {
    font-size: 16px;
  }
}

@media screen and (max-width: 370px) {
  .article-content-edit-history-list-container {
    grid-template-columns: 10px minmax(0, 1fr) 10px;
  }
}
</style>
