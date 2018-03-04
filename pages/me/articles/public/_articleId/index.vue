<template>
  <public-article :article="this.$store.state.article.article"/>
</template>

<script>
import PublicArticle from '~/components/pages/PublicArticle'

export default {
  components: {
    PublicArticle
  },
  async fetch({ store, params }) {
    const { articleId, user: userId } = params
    await store.dispatch('article/getPublicArticleDetail', { articleId })
    await store.dispatch('article/getUserInfo', { userId })
    await store.dispatch('article/getLikesCountOfArticle', { articleId })
    await store.dispatch('article/getAlisToken', { articleId })
    const { userInfo, likesCount, alisToken } = store.state.article
    store.dispatch('article/setUserInfoToArticle', { userInfo })
    store.dispatch('article/setLikesCountToArticle', { likesCount })
    store.dispatch('article/setAlisTokenToArticle', { alisToken })
  }
}
</script>
