<template>
  <div class="edit-article-container">
    <app-header showEditHeaderNav showPostArticleLink class="logo-original"/>
    <editor :title="title" :body="body" :tags="this.$store.state.article.tags"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { putDraftArticle } from '~/api/article'
import AppHeader from '../organisms/AppHeader'
import Editor from '../atoms/Editor'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    Editor,
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
      const { id: articleId } = this.$route.params
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
