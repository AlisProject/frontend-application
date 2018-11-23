<template>
  <draft-article-list/>
</template>

<script>
import DraftArticleList from '~/components/pages/DraftArticleList'

export default {
  components: {
    DraftArticleList
  },
  async fetch({ store, params, error }) {
    await store.dispatch('user/setUserInfo', { userId: params.userId })
  },
  mounted() {
    this.$store.dispatch('article/getDraftArticles')
  },
  head: {
    title: '下書き記事一覧'
  }
}
</script>
