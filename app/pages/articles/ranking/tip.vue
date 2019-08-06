<template>
  <tip-ranking />
</template>

<script>
import TipRanking from '~/components/pages/TipRanking'

export default {
  components: {
    TipRanking
  },
  async fetch({ store, query, from = {}, error }) {
    try {
      if (from.name === 'articles-recent' || from.name === 'articles-popular') {
        store.dispatch('article/resetArticleData')
      }

      await store.dispatch('article/getTopics')
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  head: {
    title: '投げ銭ランキング',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: '投げ銭ランキング | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '投げ銭ランキング'
      }
    ]
  }
}
</script>
