<template>
  <draft-article-list/>
</template>

<script>
import DraftArticleList from '~/components/pages/DraftArticleList'

export default {
  components: {
    DraftArticleList
  },
  async fetch({ store, params, error, redirect }) {
    await store.dispatch('user/setUserInfo', { userId: params.userId })

    // ログインユーザーが他人の下書きページにアクセスした場合、記事一覧ページにリダイレクトする
    const isCurrentUser =
      store.state.user.loggedIn && params.userId === store.state.user.currentUser.userId
    if (!isCurrentUser) {
      redirect(`/users/${params.userId}`)
    }
  },
  mounted() {
    this.$store.dispatch('article/getDraftArticles')
  },
  head: {
    title: '下書き記事一覧'
  }
}
</script>
