<template>
  <edit-draft-article/>
</template>

<script>
/* eslint-disable no-undef */
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
      editorBody.dataset.placeholder = body === '' ? '本文を入力してください' : ''
      document.querySelectorAll('[data-alis-iframely-url]').forEach((element) => {
        element.innerHTML = `<a href="${element.dataset.alisIframelyUrl}" data-iframely-url></a>`
      })
      iframely.load()
    } catch (error) {
      console.error(error)
    }
  },
  head: { ...head, title: '記事編集' }
}
</script>
