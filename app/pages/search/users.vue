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
    if (this.$route.query.q) {
      this.$store.dispatch('article/getSearchArticles', { query: this.$route.query.q })
      this.$store.dispatch('user/getSearchUsers', { query: this.$route.query.q })
    }
  },
  head: {
    title: '検索'
  }
}
</script>
