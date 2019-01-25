<template>
  <component :is="componentName"/>
</template>

<script>
import BlankPage from '~/components/pages/BlankPage'
import CreateArticle from '~/components/pages/CreateArticle'
import EditDraftArticleV1 from '~/components/pages/EditDraftArticleV1'
import EditDraftArticleV2 from '~/components/pages/EditDraftArticleV2'
import { isV2 } from '~/utils/article'
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
    EditDraftArticleV1,
    EditDraftArticleV2
  },
  async created() {
    const { Items: articles } = await this.$axios.$get('/me/articles/drafts', {
      params: { limit: 1 }
    })
    const latestDraftArticleId = articles[0].article_id
    const latestDraftArticle = await this.$axios.$get(`/me/articles/${latestDraftArticleId}/drafts`)
    const isLatestDraftArticleEmpty =
      latestDraftArticle.title === null && latestDraftArticle.body === null
    const isV2Article = isV2(latestDraftArticle)

    if (isLatestDraftArticleEmpty) {
      await this.$store.dispatch('article/getEditDraftArticle', { articleId: latestDraftArticleId })
      this.$store.dispatch('article/setGotArticleData', { gotArticleData: true })
      this.componentName = isV2Article ? 'EditDraftArticleV2' : 'EditDraftArticleV1'
    } else {
      const article = { title: '', body: '' }
      await this.$store.dispatch('article/postNewArticle', { article })
      this.componentName = 'CreateArticle'
    }
  },
  head: { ...head, title: '新規記事' }
}
</script>
