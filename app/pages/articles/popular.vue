<template>
  <popular-article-list/>
</template>

<script>
import PopularArticleList from '~/components/pages/PopularArticleList'

export default {
  components: {
    PopularArticleList
  },
  async mounted() {
    const topic = this.$route.query.topic
    await this.$store.dispatch('article/getTopics')
    this.$store.dispatch('article/setTopicDisplayName', { topicName: topic })
    this.$store.dispatch('article/resetArticleData')
    await this.$store.dispatch('article/getPopularArticles', { topic })
  },
  head() {
    return {
      title: `人気記事`,
      meta: [
        {
          hid: `og:title`,
          property: 'og:title',
          content: `人気記事 | ALIS`
        },
        {
          hid: `og:description`,
          property: 'og:description',
          content: `人気記事一覧`
        }
      ]
    }
  }
}
</script>
