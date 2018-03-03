<template>
  <div class="create-article-container">
    <span>{{ this.saveStatus }}</span>
    <app-header showEditHeaderNav showPostArticleLink class="drafts logo-original"/>
    <editor :tags="this.$store.state.article.tags"/>
    <app-footer/>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { mapActions, mapGetters } from 'vuex'
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
    ...mapGetters({
      articleId: 'article/articleId',
      title: 'article/title',
      body: 'article/body'
    }),
    saveStatus() {
      if (this.isSaved) {
        return 'Saved'
      } else if (this.isSaving) {
        return 'Saving...'
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      isPosted: false,
      isSaving: false,
      isSaved: false
    }
  },
  methods: {
    ...mapActions('article', ['postNewArticle', 'putDraftArticle']),
    postOrPutArticle: debounce(async function() {
      const article = {
        title: this.title,
        body: this.body
      }
      this.isSaving = true
      if (this.isPosted) {
        await this.putDraftArticle({ article, articleId: this.articleId })
        this.isSaved = true
      } else {
        try {
          await this.postNewArticle({ article })
          this.isSaved = true
          this.isPosted = true
        } catch (e) {
          console.error(e)
        }
      }
    }, 500)
  },
  watch: {
    title(newTitle, oldTitle) {
      this.isSaved = false
      this.isSaving = false
      this.postOrPutArticle()
    },
    body(newBody, oldBody) {
      this.isSaved = false
      this.isSaving = false
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
