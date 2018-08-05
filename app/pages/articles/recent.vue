<template>
  <new-article-list/>
</template>

<script>
import NewArticleList from '~/components/pages/NewArticleList'

export default {
  components: {
    NewArticleList
  },
  async fetch({ store, params }) {
    const topic = params.topics || 'crypto'
    await store.dispatch('article/getNewPagesArticles', { topic })
  },
  head() {
    return {
      title: '新着記事',
      meta: [
        {
          hid: `og:title`,
          property: 'og:title',
          content: `新着記事 | ALIS`
        },
        {
          hid: `og:description`,
          property: 'og:description',
          content: '新着記事一覧'
        }
      ]
    }
  }
}
</script>
