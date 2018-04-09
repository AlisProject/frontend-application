<template>
  <draft-article-list/>
</template>

<script>
import DraftArticleList from '~/components/pages/DraftArticleList'

export default {
  components: {
    DraftArticleList
  },
  beforeCreate() {
    this.$store.dispatch('article/getDraftArticles')
  }
}
</script>
