<template>
  <tag-article-list/>
</template>

<script>
import TagArticleList from '~/components/pages/TagArticleList'

export default {
  components: {
    TagArticleList
  },
  async fetch({ store, params }) {
    const { tag } = params
    await store.dispatch('article/getTagArticles', { tag })
  },
  head: {
    title: 'タグ'
  }
}
</script>
