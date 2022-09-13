<template>
  <tip-supporters />
</template>

<script>
import TipSupporters from '~/components/pages/TipSupporters'

export default {
  components: {
    TipSupporters
  },
  async fetch({ store, params, error }) {
    try {
      const { articleId } = params
      await store.dispatch('article/getArticleSupporters', { articleId })
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  head: {
    title: 'サポーター一覧',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'サポーター一覧 | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'サポーター一覧'
      },
      {
        hid: 'robots',
        name: 'robots',
        content: 'noindex'
      }
    ]
  }
}
</script>
