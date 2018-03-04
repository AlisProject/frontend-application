<template>
  <new-article-list/>
</template>

<script>
import NewArticleList from '~/components/pages/NewArticleList'

export default {
  components: {
    NewArticleList
  },
  async fetch({ store }) {
    await store.dispatch('article/getNewPagesArticles')
    const { newArticles: articles } = store.state.article
    await store.dispatch('article/getUserInfos', { articles })
    await store.dispatch('article/getAlisTokens', { articles })
    const { userInfos, alisTokens } = store.state.article
    const type = 'new'
    store.dispatch('article/setUserInfoToArticles', {
      articles,
      userInfos,
      type
    })
    store.dispatch('article/setAlisTokenToArticles', {
      articles,
      alisTokens,
      type
    })
  }
}
</script>
