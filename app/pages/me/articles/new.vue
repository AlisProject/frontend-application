<template>
  <component :is="componentName" />
</template>

<script>
import BlankPage from '~/components/pages/BlankPage'
import CreateArticle from '~/components/pages/CreateArticle'
import EditDraftArticleV2 from '~/components/pages/EditDraftArticleV2'
import { isV2 } from '~/utils/article'

export default {
  components: {
    BlankPage,
    CreateArticle,
    EditDraftArticleV2
  },
  data() {
    return {
      componentName: 'BlankPage'
    }
  },
  async created() {
    // 下書き記事の最新記事を確認し、v2 の空記事だった場合はその記事を利用する
    // 空記事でなかった場合は新しく記事を作成する

    const { Items: articles } = await this.$axios.$get('/me/articles/drafts', {
      params: { limit: 1 }
    })
    // 下書き記事が存在しない場合は、記事を作成する
    if (articles.length < 1) {
      await this.createNewArticle()
      return
    }
    const latestDraftArticleId = articles[0].article_id
    const latestDraftArticle = await this.$axios.$get(`/me/articles/${latestDraftArticleId}/drafts`)
    const { title = null, body = null } = latestDraftArticle
    const isLatestDraftArticleEmpty = title === null && body === '<p>&nbsp;</p>'
    if (isLatestDraftArticleEmpty && isV2(latestDraftArticle)) {
      await this.useLatestDraftArticle(latestDraftArticleId)
    } else {
      await this.createNewArticle()
    }
  },
  methods: {
    async createNewArticle() {
      const articleId = await this.$store.dispatch('article/postNewArticleId')
      history.replaceState(null, null, `/me/articles/draft/v2/${articleId}/edit`)
      this.componentName = 'CreateArticle'
    },
    async useLatestDraftArticle(articleId) {
      await this.$store.dispatch('article/getEditDraftArticle', { articleId })
      history.replaceState(null, null, `/me/articles/draft/v2/${articleId}/edit`)
      this.$store.dispatch('article/setGotArticleData', { gotArticleData: true })
      this.componentName = 'EditDraftArticleV2'
    }
  },
  head: {
    title: '新規記事',
    meta: [
      {
        hid: 'viewport',
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
      }
    ]
  }
}
</script>
