<template>
  <div class="edit-article-container">
    <app-header />
    <edit-header-nav type="public-article" />
    <article-editor-v2 :title="decodedTitle" :putArticle="putArticle"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
    ...mapGetters('article', ['title', 'body', 'thumbnail'])
  },
  methods: {
    ...mapActions('article', ['putPublicArticleTitle', 'gotArticleData']),
    async putArticle() {
      if (!this.gotArticleData) return
      const { title, thumbnail } = this
      const { articleId } = this.$route.params
      const article = { title }
      if (thumbnail !== '') article.eye_catch_url = thumbnail
      await this.putPublicArticleTitle({ article, articleId })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-article-container {
  display: grid;
  grid-template-rows: 100px 74px 50px 650px 75px;
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
