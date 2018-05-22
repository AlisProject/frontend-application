<template>
  <div class="edit-article-container">
    <app-header showEditHeaderNav showPostArticleLink class="logo-original"/>
    <article-editor :title="title" :postOrPutArticleFunction="this.putArticleAndSetSavingStatus"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import ArticleEditor from '../atoms/ArticleEditor'

export default {
  components: {
    AppHeader,
    ArticleEditor
  },
  computed: {
    ...mapGetters('article', ['title', 'body', 'thumbnail', 'isSaving', 'isSavingImage'])
  },
  methods: {
    ...mapActions('article', ['putPublicArticle', 'gotArticleData']),
    async putArticle() {
      const article = {
        title: this.title === '' ? ' ' : this.title,
        body: this.body === '' ? ' ' : this.body
      }
      if (this.thumbnail !== '') {
        article.eye_catch_url = this.thumbnail
      }
      const { articleId } = this.$route.params
      try {
        if (this.isSaving) await this.putPublicArticle({ article, articleId })
      } catch (e) {
        console.error(e)
      }
    },
    async putArticleAndSetSavingStatus() {
      if (this.gotArticleData && !this.isSavingImage) {
        await this.putArticle()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-article-container {
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
</style>
