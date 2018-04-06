<template>
  <user-article-list/>
</template>

<script>
import UserArticleList from '~/components/pages/UserArticleList'

export default {
  components: {
    UserArticleList
  },
  async fetch({ store }) {
    // await store.dispatch('article/getNewPagesArticles')
    // const { newArticles: articles } = store.state.article
    // await store.dispatch('article/getUserInfos', { articles })
    // await store.dispatch('article/getAlisTokens', { articles })
    // const { userInfos, alisTokens } = store.state.article
    // const type = 'new'
    // store.dispatch('article/setUserInfoToArticles', {
    //   articles,
    //   userInfos,
    //   type
    // })
    // store.dispatch('article/setAlisTokenToArticles', {
    //   articles,
    //   alisTokens,
    //   type
    // })
  }
}
</script>
