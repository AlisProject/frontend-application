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
  async beforeCreate() {
    const { articleId } = this.$route.params
    try {
      await this.$store.dispatch('article/getEditPublicArticleDetail', { articleId })
      const { body } = this.$store.state.article
      this.$store.dispatch('article/setGotArticleData', { gotArticleData: true })
      const editorBody = this.$el.querySelector('.area-body')
      editorBody.innerHTML = body
      editorBody.dataset.placeholder = body === '' ? 'あなたの物語を教えてください･･･' : ''
    } catch (error) {
      console.error(error)
    }
  },
  head: { ...head, title: '記事編集' }
}
</script>
