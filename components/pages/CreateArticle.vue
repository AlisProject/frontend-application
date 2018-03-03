<template>
  <div class="create-article-container">
    <app-header showEditHeaderNav showPostArticleLink class="drafts logo-original"/>
    <editor :tags="this.$store.state.article.tags"/>
    <app-footer/>
  </div>
</template>

<script>
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
    })
  },
  data() {
    return {
      isPosted: false
    }
  },
  methods: {
    ...mapActions('article', ['postNewArticle', 'putDraftArticle']),
    async postOrPutArticle() {
      const article = {
        title: this.title,
        body: this.body
      }
      if (this.isPosted) {
        await this.putDraftArticle({ article, articleId: this.articleId })
      } else {
        try {
          await this.postNewArticle({ article })
          this.isPosted = true
        } catch (e) {
          console.error(e)
        }
      }
    }
  },
  watch: {
    title(newTitle, oldTitle) {
      this.postOrPutArticle()
    },
    body(newBody, oldBody) {
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
