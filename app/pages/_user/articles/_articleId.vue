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
  },
  head: {
    link: [
      {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/medium-editor-insert-plugin/2.4.1/css/medium-editor-insert-plugin.min.css'
      }
    ]
  }
}
</script>
