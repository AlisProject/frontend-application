<template>
  <draft-article-list/>
</template>

<script>
import DraftArticleList from '~/components/pages/DraftArticleList'

export default {
  components: {
    DraftArticleList
  },
  async fetch({ store }) {
    await store.dispatch('article/getDraftArticles', { userId: '1' })
    const { draftArticles: articles } = store.state.article
    await store.dispatch('article/getUserInfos', { articles })
    await store.dispatch('article/getAlisTokens', { articles })
    const { userInfos, alisTokens } = store.state.article
    const type = 'draft'
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
