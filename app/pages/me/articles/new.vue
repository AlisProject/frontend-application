<template>
  <component :is="componentName"/>
</template>

<script>
import BlankPage from '~/components/pages/BlankPage'
import CreateArticle from '~/components/pages/CreateArticle'
import EditDraftArticle from '~/components/pages/EditDraftArticle'

import head from '~/utils/editor-head'

export default {
  data() {
    return {
      componentName: 'BlankPage'
    }
  },
  components: {
    BlankPage,
    CreateArticle,
    EditDraftArticle
  },
  async created() {
    const { Items: articles } = await this.$axios.$get('/me/articles/drafts', {
      params: { limit: 1 }
    })
    const latestDraftArticleId = articles[0].article_id
    const latestDraftArticle = await this.$axios.$get(`/me/articles/${latestDraftArticleId}/drafts`)
    const isLatestDraftArticleEmpty =
      latestDraftArticle.title === null && latestDraftArticle.body === null

    if (isLatestDraftArticleEmpty) {
      await this.$store.dispatch('article/getEditDraftArticle', { articleId: latestDraftArticleId })
      this.$store.dispatch('article/setGotArticleData', { gotArticleData: true })
      this.componentName = 'EditDraftArticle'
    } else {
      const article = { title: '', body: '' }
      await this.$store.dispatch('article/postNewArticle', { article })
      this.componentName = 'CreateArticle'
    }
  },
  head: { ...head, title: '新規記事' }
}
</script>
