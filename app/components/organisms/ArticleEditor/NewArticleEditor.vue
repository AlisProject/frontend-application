<template>
  <div id="new-editor-wrapper">
    <edit-header-nav class="new-editor-head-nav" :class="{ drafts: draft }">
      <div slot="right-content" class="area-post-article">
        <article-editor-publish-button
          :publishable="!!blocks.length"
          :onClick="openModal"
        />
      </div>
    </edit-header-nav>
    <ArticleTitleInput v-model="title" @focus-trigger="handleFocus" />
    <alis-editor
      class="alis-editor"
      style="position: relative;z-index: 1"
      @update="updateEditorState"
      :initialState="blocks"
      :config="config"
    />
    <NewEditorPublishModal
      v-if="isOpenModal"
      @close="handleCloseModal"
      @publish="publish"
      :thumbnails="blocks.filter((block) => block.type === 'Image')"
    />
  </div>
</template>

<script>
import ArticleTitleInput from '~/components/atoms/ArticleEditor/ArticleTitleInput.vue'
import EditHeaderNav from '~/components/molecules/EditHeaderNav'
import NewEditorPublishModal from '~/components/organisms/ArticleEditor/NewEditorPublishModal.vue'
import AppModal from '~/components/atoms/AppModal.vue'
import AppHeader from '~/components/organisms/AppHeader.vue'
import AlisEditor from 'alis-editor'
import ArticleEditorPublishButton from '~/components/atoms/ArticleEditor/ArticleEditorPublishButton.vue'
import { createInitialBlocks } from '~/utils/article'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    AppModal,
    AppHeader,
    ArticleTitleInput,
    ArticleEditorPublishButton,
    AlisEditor,
    EditHeaderNav,
    NewEditorPublishModal
  },
  props: {
    defaultTitle: String,
    defaultBlocks: Array,
    draft: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isOpenModal: false,
      isPublishing: false,
      article: {
        title: this.defaultTitle || '',
        body: this.defaultBlocks || [],
        version: 200
      },
      title: this.defaultTitle || '',
      axiosConfig: {
        headers: {
          Authorization: ''
        }
      },
      blocks: this.defaultBlocks || createInitialBlocks()
    }
  },
  mounted() {
    setTimeout(async () => {
      try {
        await this.$store.dispatch('user/getUserSession')
        const currentUser = localStorage.getItem(
          `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.LastAuthUser`
        )
        const token = localStorage.getItem(
          `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.${currentUser}.idToken`
        )
        if (!token) {
          throw new Error('Unauthorized.')
        }
        this.axiosConfig.headers['Authorization'] = token
      } catch (e) {
        this.$router.push('/login')
      }
    }, 1000)
  },
  computed: {
    articleStatusString() {
      return this.draft ? 'draft' : 'public'
    },
    config() {
      return {
        articleId: this.articleId,
        preview: false,
        iframelyApikey: process.env.IFRAMELY_API_KEY,
        uploadEndpoint: `/api/me/articles/${this.articleId}/images`,
        axiosConfig: this.axiosConfig
      }
    },
    iframelyApikey() {
      return process.env.IFRAMELY_API_KEY
    },
    ...mapGetters('article', ['articleId'])
  },
  methods: {
    async publish(formData) {
      if (this.isPublishing) return
      this.isPublishing = true
      console.log({
        article: {
          ...this.article,
          eye_catch_url: formData.thumbnail
        },
        articleId: this.articleId
      })
      try {
        if (this.draft) {
          await this.putDraftArticle({
            article: {
              ...this.article,
              eye_catch_url: formData.thumbnail
            },
            articleId: this.articleId
          })
          await this.publishDraftArticle({
            articleId: this.articleId,
            topic: formData.topic,
            tags: formData.tags
          })
        } else {
          await this.putPublicArticle({
            article: {
              ...this.article,
              eye_catch_url: formData.thumbnail
            },
            articleId: this.articleId
          })
          await this.republishPublicArticle({
            articleId: this.articleId,
            topic: formData.topic,
            tags: formData.tags
          })
        }
        this.$router.push('/me/articles/public')
        this.sendNotification({ text: '記事を公開しました。' })
      } catch (e) {
        this.publishingArticle = false
        this.sendNotification({ text: '記事の公開に失敗しました。', type: 'warning' })
        console.error(e)
      } finally {
        this.isPublishing = false
      }
    },
    handleCloseModal() {
      this.isOpenModal = false
    },
    handleFocus() {
      const alisEditor = this.$el.querySelector('.alis-editor')
      alisEditor.querySelector('.target').focus()
    },
    async updateEditorState(blocks) {
      if (this.isPublishing) return
      this.article = {
        title: this.title,
        body: blocks,
        version: 200
      }
      if (!this.articleId) {
        await this.postNewArticle({ article: this.article })
        history.replaceState(
          `/me/articles/draft/${this.articleId}/edit`,
          null,
          `/me/articles/draft/${this.articleId}/edit`
        )
        return
      }
      if (this.articleStatusString === 'draft') {
        await this.putDraftArticle({ article: this.article, articleId: this.articleId })
      } else if (this.articleStatusString === 'public') {
        await this.putPublicArticle({ article: this.article, articleId: this.articleId })
      }
    },
    openModal() {
      this.isOpenModal = true
    },
    ...mapActions('article', [
      'postNewArticle',
      'putDraftArticle',
      'putPublicArticle',
      'publishDraftArticle',
      'republishPublicArticle'
    ])
  }
}
</script>

<style lang="scss" scoped>
#new-editor-wrapper {
  display: flex;
  flex-direction: column;
  width: 880px;
  max-width: 100%;
  margin: 0 auto;
  z-index: 2;

  .new-editor-head-nav {
    width: 880px;
    max-width: 100%;
  }
}

.is-modalopened {
  height: 100vh;
  overflow-y: hidden;
}

.area-post-article {
  grid-area: post-article;
  position: relative;
  display: flex;
  align-self: center;
  justify-content: center;
}
</style>
