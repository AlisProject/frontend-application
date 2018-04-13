<template>
  <user-article-list/>
</template>

<script>
import UserArticleList from '~/components/pages/UserArticleList'

export default {
  components: {
    UserArticleList
  },
  async fetch({ store, params, error }) {
    try {
      await store.dispatch('user/setUserInfo', { userId: params.userId })
      await store.dispatch('user/getUserArticles', { userId: params.userId })
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  beforeDestroy() {
    this.$store.dispatch('user/resetUserArticles')
    this.$store.dispatch('user/resetUserArticlesLastEvaluatedKey')
  }
}
</script>
