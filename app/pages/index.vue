<template>
  <top-page/>
</template>

<script>
import TopPage from '~/components/pages/TopPage'

export default {
  components: {
    TopPage
  },
  async fetch({ store }) {
    await store.dispatch('article/getPopularArticles')
  },
  head() {
    return {
      titleTemplate: ''
    }
  }
}
</script>
