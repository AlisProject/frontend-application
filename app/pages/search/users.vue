<template>
  <search-page/>
</template>

<script>
import SearchPage from '~/components/pages/SearchPage'

export default {
  components: {
    SearchPage
  },
  mounted() {
    const query = this.$route.query.q
    if (query) {
      this.$store.dispatch('article/getSearchArticles', { query })
      this.$store.dispatch('user/getSearchUsers', { query })
    }
  },
  head: {
    title: '検索'
  }
}
</script>
