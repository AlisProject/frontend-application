<template>
  <edit-draft-article/>
</template>

<script>
import { mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import EditDraftArticle from '~/components/pages/EditDraftArticle'
import head from '~/utils/editor-head'
import { showEmbedTweet, getThumbnails, preventDropImageOnOGPContent } from '~/utils/article'

export default {
  components: {
    EditDraftArticle
  },
  async beforeCreate() {
    const { articleId } = this.$route.params
    let body
    let isNewVersionArticle = false

    try {
      await this.$store.dispatch('article/getEditDraftArticle', { articleId })
      body = this.$store.state.article.body
      this.$store.dispatch('article/setGotArticleData', { gotArticleData: true })
    } catch (error) {
      this.sendNotification({ text: '記事データの取得に失敗しました。', type: 'warning' })
      console.error(error)
    }

    // JSON.parseできれば v2
    try {
      JSON.parse(body)
      isNewVersionArticle = true
    } catch (e) {}

    try {
      if (isNewVersionArticle) {
        return
      }
      const editorBody = this.$el.querySelector('.area-body')
      editorBody.innerHTML = body
      // Update thumbnails
      const images = Array.from(this.$el.querySelectorAll('figure img'))
      const thumbnails = getThumbnails(images)
      this.$store.dispatch('article/updateSuggestedThumbnails', { thumbnails })
      editorBody.dataset.placeholder =
        body === '' || body === '<p><br></p>' ? '本文を入力してください' : ''
      showEmbedTweet()
      preventDropImageOnOGPContent()
    } catch (error) {
      this.sendNotification({ text: '記事データの取得に失敗しました。', type: 'warning' })
      console.error(error)
    }
  },
  methods: {
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    })
  },
  head: { ...head, title: '記事編集' }
}
</script>
