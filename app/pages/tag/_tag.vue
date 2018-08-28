<template>
  <tag-article-list/>
</template>

<script>
import TagArticleList from '~/components/pages/TagArticleList'

export default {
  components: {
    TagArticleList
  },
  async fetch({ store, params, error }) {
    try {
      const { tag } = params
      await store.dispatch('article/getTagArticles', { tag })
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  head: {
    title: 'タグ'
  }
}
</script>
