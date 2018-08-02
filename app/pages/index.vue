<template>
  <popular-article-list/>
</template>

<script>
import PopularArticleList from '~/components/pages/PopularArticleList'

export default {
  components: {
    PopularArticleList
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
