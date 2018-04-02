<template>
  <div class="create-article-container">
    <app-header showEditHeaderNav showPostArticleLink class="drafts logo-original"/>
    <article-editor :tags="this.$store.state.article.tags"/>
    <app-footer/>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
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
    ...mapGetters('article', ['articleId', 'title', 'body'])
  },
  data() {
    return {
      isPosted: false
    }
  },
  methods: {
    ...mapActions('article', ['postNewArticle', 'putDraftArticle', 'setIsSaving', 'setIsSaved']),
    postOrPutArticle: debounce(async function() {
      const article = {
        title: this.title + ' ',
        body: this.body + ' '
      }
      this.setIsSaving({ isSaving: true })
      if (this.isPosted) {
        try {
          await this.putDraftArticle({ article, articleId: this.articleId })
          this.setIsSaved({ isSaved: true })
        } catch (e) {
          console.error(e)
        }
      } else {
        try {
          await this.postNewArticle({ article })
          this.setIsSaved({ isSaved: true })
          this.isPosted = true
        } catch (e) {
          console.error(e)
        }
      }
    }, 500)
  },
  watch: {
    title(newTitle, oldTitle) {
      this.setIsSaved({ isSaved: false })
      this.setIsSaving({ isSaving: false })
      this.postOrPutArticle()
    },
    body(newBody, oldBody) {
      this.setIsSaved({ isSaved: false })
      this.setIsSaving({ isSaving: false })
      this.postOrPutArticle()
    }
  }
}
</script>

<style lang="scss" scoped>
.create-article-container {
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
