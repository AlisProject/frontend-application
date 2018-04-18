<template>
  <div class="create-article-container">
    <app-header showEditHeaderNav showPostArticleLink class="drafts logo-original"/>
    <article-editor/>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import ArticleEditor from '../atoms/ArticleEditor'

export default {
  components: {
    AppHeader,
    ArticleEditor
  },
  computed: {
    ...mapGetters('article', ['articleId', 'title', 'body', 'isSaving'])
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
        body:
          this.body
            .replace(/<p class="medium-insert-active">[\s\S]*/, '')
            .replace(/<div class="medium-insert-buttons"[\s\S]*/, '') + ' '
      }
      this.setIsSaving({ isSaving: true })
      if (this.isPosted) {
        try {
          if (this.isSaving) await this.putDraftArticle({ article, articleId: this.articleId })
          this.setIsSaved({ isSaved: true })
        } catch (e) {
          console.error(e)
        }
      } else {
        try {
          if (this.isSaving) await this.postNewArticle({ article })
          this.setIsSaved({ isSaved: true })
          this.isPosted = true
        } catch (e) {
          console.error(e)
        }
      }
    }, 2500)
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
