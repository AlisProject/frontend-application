<template>
  <div class="create-article-container">
    <app-header />
    <edit-header-nav type="draft-article" />
    <article-editor-v2
      :title="decodedTitle"
      :updateArticleTitle="updateArticleTitle"
      :putArticleBody="putDraftArticleBody"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import EditHeaderNav from '../molecules/EditHeaderNav'
import ArticleEditorV2 from '../organisms/ArticleEditorV2'
import { htmlDecode } from '~/utils/article'

export default {
  components: {
    AppHeader,
    EditHeaderNav,
    ArticleEditorV2
  },
  computed: {
    decodedTitle() {
      return htmlDecode(this.title)
    },
    ...mapGetters('article', ['articleId', 'title', 'body'])
  },
  methods: {
    ...mapActions('article', ['putDraftArticleTitle', 'gotArticleData', 'putDraftArticleBody']),
    async updateArticleTitle() {
      if (!this.gotArticleData) return
      const { title, thumbnail, articleId } = this
      const article = { title }
      if (thumbnail !== '') article.eye_catch_url = thumbnail
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
</style>
