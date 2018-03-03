<template>
  <edit-public-article/>
</template>

<script>
import EditPublicArticle from '~/components/pages/EditPublicArticle'
import head from '~/utils/editor-head'

export default {
  components: {
    EditPublicArticle
  },
  async fetch({ store, params }) {
    const { articleId } = params
    await store.dispatch('article/getEditPublicArticleDetail', { articleId })
  },
  head
}
</script>
