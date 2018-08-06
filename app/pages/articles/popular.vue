<template>
  <popular-article-list/>
</template>

<script>
import PopularArticleList from '~/components/pages/PopularArticleList'

export default {
  components: {
    PopularArticleList
  },
  async fetch({ store, query }) {
    const topic = query.topic || 'crypto'
    store.dispatch('article/resetArticleData')
    await store.dispatch('article/getPopularArticles', { topic })
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
