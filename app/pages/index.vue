<template>
  <top-page />
</template>

<script>
import TopPage from '~/components/pages/TopPage'

export default {
  components: {
    TopPage
  },
  async fetch({ store, query, error }) {
    try {
      await store.dispatch('article/getTopics')
      await Promise.all([
        store.dispatch('article/getEyecatchArticles'),
        store.dispatch('article/getRecommendedArticles')
      ])
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  head() {
    return {
      titleTemplate: ''
    }
  }
}
</script>
