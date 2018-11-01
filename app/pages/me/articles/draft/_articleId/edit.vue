<template>
  <edit-draft-article/>
</template>

<script>
import { mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import EditDraftArticle from '~/components/pages/EditDraftArticle'
import head from '~/utils/editor-head'
import { isV2, showEmbedTweet, getThumbnails, preventDropImageOnOGPContent } from '~/utils/article'

export default {
  components: {
    EditDraftArticle
  },
  async beforeCreate() {
    const { articleId } = this.$route.params
    try {
      await this.$store.dispatch('article/getEditDraftArticle', { articleId })
      this.$store.dispatch('article/setGotArticleData', { gotArticleData: true })
    } catch (error) {
      this.sendNotification({ text: '記事データの取得に失敗しました。', type: 'warning' })
      console.error(error)
      return
    }
    const article = this.$store.state.article

    try {
      if (isV2(article)) {
        return
      }
      const editorBody = this.$el.querySelector('.area-body')
      editorBody.innerHTML = article.body
      // Update thumbnails
      const images = Array.from(this.$el.querySelectorAll('figure img'))
      const thumbnails = getThumbnails(images)
      this.$store.dispatch('article/updateSuggestedThumbnails', { thumbnails })
      editorBody.dataset.placeholder = ['', '<p><br></p>'].includes(article.body)
        ? '本文を入力してください'
        : ''
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
