<template>
  <div class="new-editor-container" v-if="isNewVersionArticle">
    <app-header />
    <edit-header-nav class="drafts" />
    <v2-editor :defaultTitle="decodedTitle" :defaultBlocks="JSON.parse(this.body)"/>
  </div>
  <div class="edit-article-container" v-else>
    <app-header />
    <edit-header-nav class="drafts" />
    <v1-editor :title="decodedTitle" :putArticle="putArticle"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import EditHeaderNav from '../molecules/EditHeaderNav'
import ArticleEditor from '../atoms/ArticleEditor'
import NewArticleEditor from '~/components/organisms/NewArticleEditor.vue'
import { htmlDecode } from '~/utils/article'

export default {
  components: {
    AppHeader,
    EditHeaderNav,
    'v2-editor': NewArticleEditor,
    'v1-editor': ArticleEditor
  },
  computed: {
    decodedTitle() {
      return htmlDecode(this.title)
    },
    isNewVersionArticle() {
      try {
        JSON.parse(this.body)
        return true
      } catch (e) {
        return false
      }
    },
    ...mapGetters('article', ['title', 'body'])
  },
  methods: {
    ...mapActions('article', ['putDraftArticle', 'gotArticleData']),
    async putArticle() {
      if (!this.gotArticleData) return
      const { title, body, thumbnail } = this
      const { articleId } = this.$route.params
      const article = { title, body }
      if (thumbnail !== '') article.eye_catch_url = thumbnail
      await this.putDraftArticle({ article, articleId })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-article-container {
  display: grid;
  grid-template-rows: 100px 40px 50px 650px 75px;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header app-header"
    "nav         nav        nav       "
    "...         ...        ...       "
    "...         editor     ...       "
    "...         ...        ...       ";
}

.new-editor-container .new-editor-head-nav {
  width: 880px;
}

.new-editor-container {
  width: 1100px;
  margin: 0 auto;
}

.area-app-header-container {
  width: 880px;
  margin: 0 auto;
  z-index: 2;
}
</style>
