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
    try {
      const { code } = this.$route.query

      history.replaceState(null, null, '/articles/popular?topic=crypto')

      if (!code) return
      await this.$store.dispatch('user/checkAuthByLine', {
        code
      })
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
