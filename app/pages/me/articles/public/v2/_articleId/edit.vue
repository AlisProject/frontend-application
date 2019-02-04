<template>
  <component :is="componentName" />
</template>

<script>
import { mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import BlankPage from '~/components/pages/BlankPage'
import EditPublicArticleV2 from '~/components/pages/EditPublicArticleV2'
import { showEmbedTweet, getThumbnails, preventDropImageOnOGPContent } from '~/utils/article'

export default {
  components: {
    BlankPage,
    EditPublicArticleV2
  },
  data() {
    return {
      componentName: 'BlankPage'
    }
  },
  async beforeCreate() {
    const { articleId } = this.$route.params
    try {
      await this.$store.dispatch('article/getEditPublicArticleDetail', { articleId })
      this.componentName = 'EditPublicArticleV2'
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
  head: {
    title: '記事編集',
    meta: [
      {
        hid: 'viewport',
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
      }
    ]
  }
}
</script>
