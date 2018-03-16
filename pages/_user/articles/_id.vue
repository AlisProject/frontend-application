<template>
  <article-detail :article="article"/>
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleDetail from '~/components/pages/ArticleDetail'

export default {
  components: {
    ArticleDetail
  },
  async fetch({ store, params }) {
    const { id: articleId, user: userId } = params
    await store.dispatch('article/getArticleDetail', { articleId })
    await store.dispatch('article/getUserInfo', { userId })
    await store.dispatch('article/getLikesCountOfArticle', { articleId })
    await store.dispatch('article/getAlisToken', { articleId })
    const { userInfo, likesCount, alisToken } = store.state.article
    store.dispatch('article/setUserInfoToArticle', { userInfo })
    store.dispatch('article/setLikesCountToArticle', { likesCount })
    store.dispatch('article/setAlisTokenToArticle', { alisToken })
  },
  computed: {
    ...mapGetters('article', ['article'])
  }
}
</script>
