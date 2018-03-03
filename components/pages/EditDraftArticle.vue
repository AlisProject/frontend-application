<template>
  <div class="edit-article-container">
    <app-header showEditHeaderNav showPostArticleLink class="logo-original"/>
    <article-editor :title="title" :body="body" :tags="this.$store.state.article.tags"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { putDraftArticle } from '~/api/article'
import AppHeader from '../organisms/AppHeader'
import ArticleEditor from '../atoms/ArticleEditor'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    ArticleEditor,
    AppFooter
  },
  computed: {
    ...mapGetters('article', ['title', 'body'])
  },
  methods: {
    async putArticle() {
      const article = {
        title: this.title,
        body: this.body
      }
      const { articleId } = this.$route.params
      await putDraftArticle({ article, articleId })
    }
  },
  watch: {
    title(newTitle, oldTitle) {
      this.putArticle()
    },
    body(newBody, oldBody) {
      this.putArticle()
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-article-container {
  display: grid;
  grid-template-rows: 100px 50px 650px 75px 75px;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header app-header"
    "...         ...        ...       "
    "...         editor     ...       "
    "...         ...        ...       "
    "...         app-footer ...       ";
}
</style>
