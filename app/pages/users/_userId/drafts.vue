<template>
  <draft-article-list/>
</template>

<script>
import DraftArticleList from '~/components/pages/DraftArticleList'

export default {
  components: {
    DraftArticleList
  },
  async fetch({ store, params }) {
    await store.dispatch('user/setUserInfo', { userId: params.userId })
  },
  async mounted() {
    const isCurrentUser =
      this.$store.state.user.loggedIn &&
      this.$route.params.userId === this.$store.state.user.currentUser.userId

    // ログインユーザーが他人の下書きページにアクセスした場合、記事一覧ページにリダイレクトする
    if (!isCurrentUser) {
      this.$router.push(`/users/${this.$route.params.userId}`)
      return
    }
    this.$store.dispatch('article/getDraftArticles')
  },
  head: {
    title: '下書き記事一覧'
  }
}
</script>
