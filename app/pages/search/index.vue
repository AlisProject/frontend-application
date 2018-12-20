<template>
  <search-page/>
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
    switch (context) {
      case 'article':
        await this.$store.dispatch('article/getSearchArticles', { query })
        break
      case 'user':
        await this.$store.dispatch('user/getSearchUsers', { query })
        break
      case 'tag':
        await this.$store.dispatch('tag/getSearchTags', { query })
        break
      default:
        break
    }
  },
  head: {
    title: '検索',
    link: [{ rel: 'canonical', href: `https://${process.env.DOMAIN}/search` }]
  }
}
</script>
