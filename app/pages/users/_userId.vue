<template>
  <user-article-list/>
</template>

<script>
import UserArticleList from '~/components/pages/UserArticleList'

export default {
  components: {
    UserArticleList
  },
  async beforeCreate() {
    const { userId } = this.$route.params
    await this.$store.dispatch('user/setUserInfo', { userId })
    await this.$store.dispatch('user/getUserArticles')
  }
}
</script>
