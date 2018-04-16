<template>
  <new-article-list/>
</template>

<script>
import NewArticleList from '~/components/pages/NewArticleList'

export default {
  components: {
    NewArticleList
  },
  async fetch({ store }) {
    await store.dispatch('article/getNewPagesArticles')
  },
  head: {
    title: '新着記事'
  }
}
</script>
