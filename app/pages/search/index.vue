<template>
  <no-ssr>
    <search-page/>
  </no-ssr>
</template>

<script>
import SearchPage from '~/components/pages/SearchPage'

export default {
  components: {
    SearchPage
  },
  async mounted() {
    const { q: query, context } = this.$route.query
    if (!query) return
    context === 'article'
      ? await this.$store.dispatch('article/getSearchArticles', { query })
      : await this.$store.dispatch('user/getSearchUsers', { query })
  },
  head: {
    title: '検索',
    link: [{ rel: 'canonical', href: `https://${process.env.DOMAIN}/search` }]
  }
}
</script>
