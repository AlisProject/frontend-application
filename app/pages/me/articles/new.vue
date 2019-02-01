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
    // 下書き記事の最新記事を確認し、空記事だった場合はその記事を表示する
    // 空記事でなかった場合は新しく記事を作成する

    const { Items: articles } = await this.$axios.$get('/me/articles/drafts', {
      params: { limit: 1 }
    })
    // 下書き記事が存在しない場合は、記事を作成する
    if (articles.length < 0) {
      await this.createNewArticle()
      return
    }
    const latestDraftArticleId = articles[0] && articles[0].article_id
    const latestDraftArticle = await this.$axios.$get(`/me/articles/${latestDraftArticleId}/drafts`)
    const isLatestDraftArticleEmpty =
      latestDraftArticle.title === null && latestDraftArticle.body === null
    const isV2Article = isV2(latestDraftArticle)
    if (isLatestDraftArticleEmpty) {
      await this.useLatestDraftArticle(latestDraftArticleId, isV2Article)
    } else {
      await this.createNewArticle()
    }
  },
  methods: {
    async createNewArticle() {
      const article = { title: '', body: '' }
      await this.$store.dispatch('article/postNewArticle', { article })
      this.componentName = 'CreateArticle'
    },
    async useLatestDraftArticle(latestDraftArticleId, isV2Article) {
      await this.$store.dispatch('article/getEditDraftArticle', { articleId: latestDraftArticleId })
      this.$store.dispatch('article/setGotArticleData', { gotArticleData: true })
      this.componentName = isV2Article ? 'EditDraftArticleV2' : 'EditDraftArticleV1'
    }
  },
  head: { ...head, title: '新規記事' }
}
</script>
