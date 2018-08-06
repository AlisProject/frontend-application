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
    await store.dispatch('article/getTopics')
    store.dispatch('article/resetArticleData')
    await store.dispatch('article/getPopularArticles', { topic })
  },
  head() {
    let topicDisplayName = ''
    this.$store.state.article.topics.forEach((topic) => {
      if (topic.name !== this.$route.query.topic) return
      topicDisplayName = topic.display_name
    })
    return {
      title: `${topicDisplayName} - 人気記事`,
      meta: [
        {
          hid: `og:title`,
          property: 'og:title',
          content: `${topicDisplayName} - 人気記事 | ALIS`
        },
        {
          hid: `og:description`,
          property: 'og:description',
          content: `${topicDisplayName}人気記事一覧`
        }
      ]
    }
  }
}
</script>
