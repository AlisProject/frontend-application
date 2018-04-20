<template>
  <public-article-list/>
</template>

<script>
import PublicArticleList from '~/components/pages/PublicArticleList'

export default {
  components: {
    PublicArticleList
  },
  async mounted() {
    await this.$store.dispatch('article/getPublicArticles')
    await this.$store.dispatch('article/getPublicArticles')
  },
  head: {
    title: '公開済み記事一覧'
  }
}
</script>
