<template>
  <div id="new-editor-wrapper">
    <ArticleTitleInput v-model="title" />
    <alis-editor
      style="position: relative;z-index: 1"
      @update="updateEditorState"
      @export="handlePublishEditor"
      :initialState="blocks"
      :config="config"
    />
    <MobileEditorPublishModal
      v-if="isOpenModal"
      @close="handleCloseModal"
      :thumbnails="blocks.filter((block) => block.type === 'Image')"
    />
  </div>
</template>

<script>
import ArticleTitleInput from '~/components/atoms/ArticleTitleInput.vue'
import EditHeaderNav from '../molecules/EditHeaderNav'
import MobileEditorPublishModal from '~/components/organisms/MobileEditorPublishModal.vue'
import AppModal from '~/components/atoms/AppModal.vue'
import AppHeader from '~/components/organisms/AppHeader.vue'
import AlisEditor from 'alis-editor'
import uuid from 'uuid/v4'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    AppModal,
    AppHeader,
    ArticleTitleInput,
    AlisEditor,
    EditHeaderNav,
    MobileEditorPublishModal
  },
  props: ['defaultTitle', 'defaultBlocks'],
  data() {
    return {
      isOpenModal: false,
      title: this.defaultTitle || '',
      axiosConfig: {
        headers: {
          Authorization: ''
        }
      },
      blocks: this.defaultBlocks || [
        {
          id: uuid(),
          type: 'Paragraph',
          payload: {
            body: ''
          }
        },
        {
          id: uuid(),
          type: 'Paragraph',
          payload: {
            body: ''
          }
        }
      ]
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
        this.axiosConfig.headers['Authorization'] = token
      } catch (e) {}
    }, 1000)
  },
  computed: {
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
        body: JSON.stringify(blocks),
        version: 200
      }
      if (!this.articleId) {
        await this.postNewArticle({ article })
      }
      await this.putDraftArticle({ article, articleId: this.articleId })
      history.replaceState(`/me/articles/draft/${this.articleId}/edit`, null, `/me/articles/draft/${this.articleId}/edit`)
    },
    handlePublishEditor(blocks) {
      this.blocks = blocks
      this.isOpenModal = true
    },
    ...mapActions('article', ['postNewArticle', 'putDraftArticle'])
  }
}
</script>

<style lang="scss">
html {
  font-size: 10px;
}

body {
  font-size: 14px;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  min-height: 100vh;
  font-family: sans-serif;
  overflow-x: hidden;
}

#new-editor-wrapper {
  display: flex;
  flex-direction: column;
}

.is-modalopened {
  height: 100vh;
  overflow-y: hidden;
}

#new-editor-wrapper {
  width: 880px;
  max-width: 100%;
  margin: 0 auto;
  z-index: 2;
}
</style>
