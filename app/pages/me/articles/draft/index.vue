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
  },
  head: {
    title: '下書き記事一覧'
  }
}
</script>
