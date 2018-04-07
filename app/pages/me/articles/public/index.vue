<template>
  <public-article-list/>
</template>

<script>
import PublicArticleList from '~/components/pages/PublicArticleList'

export default {
  components: {
    PublicArticleList
  },
  async fetch({ store }) {
    await store.dispatch('article/getPublicArticles', { userId: '1' })
    const { publicArticles: articles } = store.state.article
    await store.dispatch('article/getUserInfos', { articles })
    await store.dispatch('article/getAlisTokens', { articles })
    const { userInfos, alisTokens } = store.state.article
    const type = 'public'
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
