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
    const topic = query.topic || 'crypto'
    await store.dispatch('article/getTopics')
    store.dispatch('article/resetArticleData')
    await store.dispatch('article/getNewPagesArticles', { topic })
  },
  head() {
    let topicDisplayName = ''
    this.$store.state.article.topics.forEach((topic) => {
      if (topic.name !== this.$route.query.topic) return
      topicDisplayName = topic.display_name
    })
    return {
      title: `${topicDisplayName} - 新着記事`,
      meta: [
        {
          hid: `og:title`,
          property: 'og:title',
          content: `${topicDisplayName} - 新着記事 | ALIS`
        },
        {
          hid: `og:description`,
          property: 'og:description',
          content: `${topicDisplayName}新着記事一覧`
        }
      ]
    }
  }
}
</script>
