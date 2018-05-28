<template>
  <div class="create-article-container">
    <app-header showEditHeaderNav showPostArticleLink class="new-article logo-original"/>
    <article-editor :putArticle="this.putArticle"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import ArticleEditor from '../atoms/ArticleEditor'

export default {
  components: {
    AppHeader,
    ArticleEditor
  },
  computed: {
    ...mapGetters('article', ['articleId', 'title', 'body'])
  },
  methods: {
    ...mapActions('article', ['putDraftArticle']),
    async putArticle() {
      const article = {
        title: this.title === '' ? ' ' : this.title,
        body: this.body === '' ? ' ' : this.body
      }
      try {
        await this.putDraftArticle({ article, articleId: this.articleId })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.create-article-container {
  display: grid;
  grid-template-rows: 100px 50px 650px 75px;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header app-header"
    "...         ...        ...       "
    "...         editor     ...       "
    "...         ...        ...       ";
}

@media screen and (max-width: 640px) {
  .create-article-container {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
