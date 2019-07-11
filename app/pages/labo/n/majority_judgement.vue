<template>
  <labo-n-majority-judgement :article="article" :topic="topicDisplayName" />
</template>

<script>
import { mapGetters } from 'vuex'
import LaboNMajorityJudgement from '~/components/pages/LaboNMajorityJudgement'

export default {
  components: {
    LaboNMajorityJudgement
  },
  async fetch({ store, query, from = {}, error }) {
    try {
      // await store.dispatch('article/getLaboNArticleRandom')
      //
      // await store.dispatch('article/getTopics')
      // store.dispatch('article/setTopicDisplayName', {
      //   topicName: store.state.article.article.topic
      // })
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
