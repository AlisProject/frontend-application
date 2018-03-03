<template>
  <public-article :article="this.$store.state.article.article"/>
</template>

<script>
import PublicArticle from '~/components/pages/PublicArticle'
import * as types from '~/store/mutation-types'

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
    store.commit(`article/${types.SET_USER_INFO_TO_ARTICLE}`, {
      userInfo
    })
    store.commit(`article/${types.SET_LIKES_COUNT_TO_ARTICLE}`, {
      likesCount
    })
    store.commit(`article/${types.SET_ALIS_TOKEN_TO_ARTICLE}`, {
      alisToken
    })
  }
}
</script>
