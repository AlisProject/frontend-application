<template>
  <div class="edit-article-container">
    <app-header />
    <edit-header-nav-v1 type="draft-article" />
    <article-editor-v1 :title="decodedTitle" :put-article="putArticle" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import EditHeaderNavV1 from '../molecules/EditHeaderNavV1'
import ArticleEditorV1 from '../organisms/ArticleEditorV1'
import { htmlDecode } from '~/utils/article'

export default {
  components: {
    AppHeader,
    EditHeaderNavV1,
    ArticleEditorV1
  },
  computed: {
    decodedTitle() {
      return htmlDecode(this.title)
    },
    ...mapGetters('article', ['title', 'body', 'articleId'])
  },
  methods: {
    ...mapActions('article', ['putDraftArticle', 'gotArticleData']),
    async putArticle() {
      if (!this.gotArticleData) return
      const { title, body, thumbnail, articleId } = this
      const article = { title, body }
      if (thumbnail !== '') article.eye_catch_url = thumbnail
      await this.putDraftArticle({ article, articleId })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-article-container {
  display: grid;
  grid-template-rows: 100px 74px 50px 650px 75px;
  grid-template-columns: minmax(0, 1fr) 640px minmax(0, 1fr);
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header app-header"
    "nav         nav        nav       "
    "...         ...        ...       "
    "...         editor     ...       "
    "...         ...        ...       ";
}
</style>
