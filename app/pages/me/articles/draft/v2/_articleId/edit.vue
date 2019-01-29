<template>
  <component :is="componentName" />
</template>

<script>
import { mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import BlankPage from '~/components/pages/BlankPage'
import EditDraftArticleV2 from '~/components/pages/EditDraftArticleV2'
import { showEmbedTweet, getThumbnails, preventDropImageOnOGPContent } from '~/utils/article'

export default {
  components: {
    BlankPage,
    EditDraftArticleV2
  },
  data() {
    return {
      componentName: 'BlankPage'
    }
  },
  async beforeCreate() {
    const { articleId } = this.$route.params
    try {
      await this.$store.dispatch('article/getEditDraftArticle', { articleId })
      this.componentName = 'EditDraftArticleV2'
      this.$store.dispatch('article/setGotArticleData', { gotArticleData: true })
      // Update thumbnails
      const images = Array.from(this.$el.querySelectorAll('figure img'))
      const thumbnails = getThumbnails(images)
      this.$store.dispatch('article/updateSuggestedThumbnails', { thumbnails })
      showEmbedTweet()
      preventDropImageOnOGPContent()
    } catch (error) {
      this.sendNotification({ text: '記事データの取得に失敗しました', type: 'warning' })
      console.error(error)
    }
  },
  methods: {
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    })
  },
  head: { title: '記事編集' }
}
</script>
