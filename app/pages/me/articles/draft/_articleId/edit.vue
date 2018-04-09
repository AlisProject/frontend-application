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
  async beforeCreate() {
    const { articleId } = this.$route.params
    try {
      await this.$store.dispatch('article/getEditDraftArticle', { articleId })
      const { body } = this.$store.state.article
      this.$store.dispatch('article/setGotArticleData', { gotArticleData: true })
      const editorBody = this.$el.querySelector('.area-body')
      editorBody.innerHTML = body
      editorBody.dataset.placeholder = body === '' ? 'あなたの物語を教えてください･･･' : ''
    } catch (error) {
      console.error(error)
    }
  },
  head
}
</script>
