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
    const { tag = null } = params
    if (tag === null || (tag && tag.length >= 25)) {
      error({ statusCode: 404 })
      return
    }
    try {
      await store.dispatch('article/getTagArticles', { tag })
    } catch (e) {
      error({ statusCode: 500 })
    }
  },
  head: {
    title: 'タグ'
  }
}
</script>
