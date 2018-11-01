<template>
  <edit-public-article/>
</template>

<script>
import { mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import EditPublicArticle from '~/components/pages/EditPublicArticle'
import head from '~/utils/editor-head'
import {
  isV2,
  showEmbedTweet,
  preventDropImageOnOGPContent,
  initializeExistArticleMediumEditor
} from '~/utils/article'

export default {
  components: {
    EditPublicArticle
  },
  async beforeCreate() {
    const { articleId } = this.$route.params
    try {
      await this.$store.dispatch('article/getEditPublicArticleDetail', { articleId })
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
      initializeExistArticleMediumEditor({ vm: this, editorBody, article })
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
