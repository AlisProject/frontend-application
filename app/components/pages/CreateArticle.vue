<template>
  <div :class="`create-article-container ${deviceType}`">
    <mobile-editor-header />
    <edit-header-nav type="draft-article" />
    <article-editor-v2
      :title="decodedTitle"
      :updateArticleTitle="updateArticleTitle"
      :putArticleBody="putDraftArticleBody"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MobileEditorHeader from '../organisms/MobileEditorHeader'
import EditHeaderNav from '../molecules/EditHeaderNav'
import ArticleEditorV2 from '../organisms/ArticleEditorV2'
import { htmlDecode } from '~/utils/article'
import { isIOS, isAndroid } from '~/utils/device'

export default {
  components: {
    MobileEditorHeader,
    EditHeaderNav,
    ArticleEditorV2
  },
  data() {
    return {
      deviceType: 'pc'
    }
  },
  mounted() {
    if (isIOS()) {
      this.deviceType = 'ios'
      return
    }
    if (isAndroid()) this.deviceType = 'android'
  },
  computed: {
    decodedTitle() {
      return htmlDecode(this.title)
    },
    ...mapGetters('article', ['articleId', 'title', 'body'])
  },
  methods: {
    ...mapActions('article', ['putDraftArticleTitle', 'gotArticleData', 'putDraftArticleBody']),
    async updateArticleTitle() {
      if (!this.gotArticleData) return
      const { title, thumbnail, articleId } = this
      const article = { title }
      if (thumbnail !== '') article.eye_catch_url = thumbnail
      await this.putDraftArticleTitle({ article, articleId })
    }
  }
}
</script>

<style lang="scss" scoped>
.pc,
.ios,
.android {
  .create-article-container {
    display: grid;
    grid-template-rows: 100px 40px 50px 650px 75px;
    grid-template-columns: 1fr 640px 1fr;
    /* prettier-ignore */
    grid-template-areas:
      "mobile-editor-header mobile-editor-header mobile-editor-header"
      "nav                  nav                  nav                 "
      "...                  ...                  ...                 "
      "...                  editor               ...                 "
      "...                  ...                  ...                 ";
  }
}

.create-article-container.ios,
.create-article-container.android {
  grid-template-rows: 66px 40px min-content min-content min-content;
  grid-template-columns: 10px 1fr 10px;
  /* prettier-ignore */
  grid-template-areas:
    "mobile-editor-header mobile-editor-header mobile-editor-header"
    "nav                  nav                  nav                 "
    "...                  ...                  ...                 "
    "editor               editor               editor              "
    "...                  ...                  ...                 ";
}
</style>
