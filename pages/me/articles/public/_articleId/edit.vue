<template>
  <edit-article/>
</template>

<script>
import EditArticle from '~/components/pages/EditArticle'
import head from '~/utils/editor-head'

export default {
  components: {
    EditArticle
  },
  async fetch({ store, params }) {
    const { articleId } = params
    await store.dispatch('article/getEditArticle', { articleId })
  },
  head
}
</script>
