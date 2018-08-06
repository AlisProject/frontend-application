<template>
  <new-article-list/>
</template>

<script>
import NewArticleList from '~/components/pages/NewArticleList'

export default {
  components: {
    NewArticleList
  },
  async fetch({ store, query }) {
    const topic = query.topics || 'crypto'
    store.dispatch('article/resetArticleData')
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
