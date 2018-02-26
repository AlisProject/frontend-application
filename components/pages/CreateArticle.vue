<template>
  <div class="create-article-container">
    <app-header showEditHeaderNav showPostStoryLink class="drafts logo-original"/>
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
  methods: {
    ...mapActions('article', ['postNewArticle']),
    postArticleAndReplaceUrl: async function() {
      if (location.pathname === '/me/articles/new') {
        const article = {
          title: this.title,
          body: this.body
        }
        await this.postNewArticle({ article })

        history.replaceState('', '', `/me/articles/edit/${this.articleId}`)
      }
    }
  },
  watch: {
    title(newTitle, oldTitle) {
      this.postArticleAndReplaceUrl()
    },
    body(newBody, oldBody) {
      this.postArticleAndReplaceUrl()
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
