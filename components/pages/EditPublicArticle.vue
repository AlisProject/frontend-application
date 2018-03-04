<template>
  <div class="edit-article-container">
    <app-header showEditHeaderNav showPostArticleLink class="logo-original"/>
    <article-editor :title="title" :body="body" :tags="this.$store.state.article.tags"/>
    <app-footer/>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { mapGetters, mapActions } from 'vuex'
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
    ...mapActions('article', ['putPublicArticle', 'setIsSaving', 'setIsSaved']),
    putArticle: debounce(async function() {
      const article = {
        title: this.title,
        body: this.body
      }
      const { articleId } = this.$route.params
      this.setIsSaving({ isSaving: true })
      try {
        await this.putPublicArticle({ article, articleId })
        this.setIsSaved({ isSaved: true })
      } catch (e) {
        console.error(e)
      }
    }, 500)
  },
  watch: {
    title(newTitle, oldTitle) {
      this.setIsSaved({ isSaved: false })
      this.setIsSaving({ isSaving: false })
      this.putArticle()
    },
    body(newBody, oldBody) {
      this.setIsSaved({ isSaved: false })
      this.setIsSaving({ isSaving: false })
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
