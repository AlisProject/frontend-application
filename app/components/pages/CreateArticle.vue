<template>
  <div class="create-article-container">
    <app-header showEditHeaderNav showPostArticleLink class="new-article logo-original"/>
    <article-editor :putArticle="this.putArticle"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppHeader from '../organisms/AppHeader'
import ArticleEditor from '../atoms/ArticleEditor'

export default {
  components: {
    AppHeader,
    ArticleEditor
  },
  computed: {
    ...mapGetters('article', ['articleId', 'title', 'body'])
  },
  methods: {
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', ['putDraftArticle']),
    async putArticle() {
      const { title, body, articleId } = this
      const article = { title, body }
      try {
        await this.putDraftArticle({ article, articleId })
      } catch (e) {
        this.sendNotification({ text: '記事の更新に失敗しました。', type: 'warning' })
        console.error(e)
      }
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
