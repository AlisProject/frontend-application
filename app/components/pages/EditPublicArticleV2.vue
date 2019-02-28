<template>
  <div :class="`edit-article-container ${deviceType}`">
    <app-header v-if="deviceType === 'pc'" />
    <mobile-editor-header v-else />
    <edit-header-nav-v2 type="public-article" />
    <article-editor-v2
      :default-title="decodedTitle"
      :update-article-title="updateArticleTitle"
      :put-article-body="putPublicArticleBody"
      :editor-content="body"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import MobileEditorHeader from '../organisms/MobileEditorHeader'
import EditHeaderNavV2 from '../molecules/EditHeaderNavV2'
import ArticleEditorV2 from '../organisms/ArticleEditorV2'
import { htmlDecode } from '~/utils/article'
import { isIOS, isAndroid } from '~/utils/device'

export default {
  components: {
    AppHeader,
    MobileEditorHeader,
    EditHeaderNavV2,
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
    ...mapGetters('article', ['title', 'body'])
  },
  methods: {
    ...mapActions('article', ['putPublicArticleTitle', 'gotArticleData', 'putPublicArticleBody']),
    async updateArticleTitle() {
      if (!this.gotArticleData) return
      const { title } = this
      const { articleId } = this.$route.params
      const articleTitle = { title }
      await this.putPublicArticleTitle({ articleTitle, articleId })
    }
  }
}
</script>

<style lang="scss" scoped>
.pc,
.ios,
.android {
  &.edit-article-container {
    display: grid;
    grid-template-rows: 100px 74px 50px 650px 75px;
    grid-template-columns: 1fr 640px 1fr;
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header app-header"
      "nav        nav        nav       "
      "...        ...        ...       "
      "...        editor     ...       "
      "...        ...        ...       ";
  }
}

@media screen and (max-width: 640px) {
  .edit-article-container.ios,
  .edit-article-container.android {
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
}
</style>
