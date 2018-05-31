<template>
  <edit-draft-article/>
</template>

<script>
import EditDraftArticle from '~/components/pages/EditDraftArticle'
import head from '~/utils/editor-head'
import showEmbedTweet from '~/utils/showEmbedTweet'
import getThumbnails from '~/utils/getThumbnails'

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
      // Update thumbnails
      const images = Array.from(this.$el.querySelectorAll('figure img'))
      const thumbnails = getThumbnails(images)
      this.$store.dispatch('article/updateSuggestedThumbnails', { thumbnails })
      editorBody.dataset.placeholder = body === '' ? '本文を入力してください' : ''
      showEmbedTweet({ $axios: this.$axios })
    } catch (error) {
      console.error(error)
    }
  },
  head: { ...head, title: '記事編集' }
}
</script>
