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
    <ArticleTitleInput v-model="title" />
    <alis-editor
      style="position: relative;z-index: 1"
      @update="updateEditorState"
      @export="handlePublishEditor"
      :initialState="blocks"
      :config="config"
    />
    <NewEditorPublishModal
      v-if="isOpenModal"
      @close="handleCloseModal"
      :thumbnails="blocks.filter((block) => block.type === 'Image')"
    />
  </div>
</template>

<script>
import ArticleTitleInput from '~/components/atoms/ArticleTitleInput.vue'
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
    handleCloseModal() {
      this.isOpenModal = false
    },
    async updateEditorState(blocks) {
      const article = {
        title: this.title,
        body: blocks,
        version: 200
      }
      if (!this.articleId) {
        await this.postNewArticle({ article })
        history.replaceState(
          `/me/articles/draft/${this.articleId}/edit`,
          null,
          `/me/articles/draft/${this.articleId}/edit`
        )
        return
      }
      if (this.articleStatusString === 'draft') {
        await this.putDraftArticle({ article, articleId: this.articleId })
      } else if (this.articleStatusString === 'public') {
        await this.putDraftArticle({ article, articleId: this.articleId })
      }
    },
    handlePublishEditor(blocks) {
      this.blocks = blocks
      this.isOpenModal = true
    },
    openModal() {
      this.isOpenModal = true
    },
    ...mapActions('article', ['postNewArticle', 'putDraftArticle'])
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
