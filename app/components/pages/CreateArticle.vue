<template>
  <div class="create-article-container">
    <app-header />
    <edit-header-nav type="draft-article" />
    <article-editor-v2 :putArticle="putArticle"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import EditHeaderNav from '../molecules/EditHeaderNav'
import ArticleEditorV2 from '../organisms/ArticleEditorV2'

export default {
  components: {
    AppHeader,
    EditHeaderNav,
    ArticleEditorV2
  },
  computed: {
    ...mapGetters('article', ['articleId', 'title', 'body'])
  },
  methods: {
    ...mapActions('article', ['putDraftArticleTitle']),
    async putArticle() {
      const { title, articleId } = this
      const article = { title }
      await this.putDraftArticleTitle({ article, articleId })
    }
  }
}
</script>

<style lang="scss" scoped>
.create-article-container {
  display: grid;
  grid-template-rows: 100px 40px 50px 650px 75px;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header app-header"
    "nav         nav        nav       "
    "...         ...        ...       "
    "...         editor     ...       "
    "...         ...        ...       ";
}

@media screen and (max-width: 550px) {
  .create-article-container {
    grid-template-rows: 66px 40px min-content min-content min-content;
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
