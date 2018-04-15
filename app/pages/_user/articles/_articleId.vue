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
    const { articleId } = params
    await store.dispatch('article/getArticleDetail', { articleId })
  },
  computed: {
    ...mapGetters('article', ['article'])
  }
}
</script>
