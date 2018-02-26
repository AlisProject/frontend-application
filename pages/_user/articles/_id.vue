<template>
  <article-detail :article="this.$store.state.article.article"/>
</template>

<script>
import ArticleDetail from '~/components/pages/ArticleDetail'
import * as types from '~/store/mutation-types'

export default {
  components: {
    ArticleDetail
  },
  async fetch({ store, params }) {
    const { article_id: articleId, user_id: userId } = params
    await store.dispatch('article/getArticleDetail', { articleId })
    await store.dispatch('article/getUserInfo', { userId })
    await store.dispatch('article/getLikesCountOfArticle', { articleId })
    await store.dispatch('article/getAlisToken', { articleId })
    const { userInfo, likesCount, alisToken } = store.state.article
    store.commit(`article/${types.SET_USER_INFO_TO_STORY}`, {
      userInfo
    })
    store.commit(`article/${types.SET_LIKES_COUNT_TO_STORY}`, {
      likesCount
    })
    store.commit(`article/${types.SET_ALIS_TOKEN_TO_STORY}`, {
      alisToken
    })
  }
}
</script>
