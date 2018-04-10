<template>
  <public-article-list/>
</template>

<script>
import PublicArticleList from '~/components/pages/PublicArticleList'

export default {
  components: {
    PublicArticleList
  },
  beforeCreate() {
    this.$store.dispatch('article/getPublicArticles')
  }
}
</script>
