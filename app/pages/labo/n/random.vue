<template>
  <article-detail-v2 :article="article" :topic="topicDisplayName" />
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleDetailV2 from '~/components/pages/ArticleDetailV2'

export default {
  components: {
    ArticleDetailV2
  },
  async fetch({ store, query, from = {}, error }) {
    try {
      await store.dispatch('article/getLaboNArticleRandom')

      await store.dispatch('article/getTopics')
      store.dispatch('article/setTopicDisplayName', {
        topicName: store.state.article.article.topic
      })
    } catch (e) {
      console.log(e)
      error({ statusCode: 404 })
    }
  },
  computed: {
    ...mapGetters('article', ['article', 'topicDisplayName'])
  }
}
</script>
