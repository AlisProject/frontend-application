<template>
  <edit-draft-article/>
</template>

<script>
import EditDraftArticle from '~/components/pages/EditDraftArticle'
import head from '~/utils/editor-head'

export default {
  components: {
    EditDraftArticle
  },
  async fetch({ store, params }) {
    const { articleId } = params
    await store.dispatch('article/getEditDraftArticle', { articleId })
  },
  head
}
</script>
