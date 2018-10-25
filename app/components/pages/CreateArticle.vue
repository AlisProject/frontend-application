<template>
  <div
    class="new-editor-container"
    :class="{
      'is-modalopened': isOpenModal
    }"
  >
    <app-header class="area-app-header-container" />
    <EditHeaderNav
      style="width:880px;"
    />
    <div
      id="mobile-editor-wrapper"
    >
      <ArticleTitleInput />
      <no-ssr>
        <alis-editor
          style="position: relative;z-index: 1"
          @update="updateEditorState"
          @export="handlePublishEditor"
          :initialState="blocks"
          :iframelyApikey="iframelyApikey"
        />
      </no-ssr>
      <MobileEditorPublishModal
        v-if="isOpenModal"
        @close="handleCloseModal"
        :thumbnails="blocks.filter((block) => block.type === 'Image')"
      />
    </div>
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
  name: 'mobile-editor-page',
  components: {
    AppModal,
    AppHeader,
    ArticleTitleInput,
    AlisEditor,
    EditHeaderNav,
    MobileEditorPublishModal
  },
  data() {
    return {
      isOpenModal: false,
      title: '',
      blocks: [
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
  computed: {
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
        body: JSON.stringify(blocks) // あとで blocks へと変える
      }
      if (!this.articleId) {
        await this.postNewArticle({ article })
      }
      await this.putDraftArticle({ article, articleId: this.articleId })
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
@import '~~/node_modules/alis-editor/dist/AlisEditor.css';

#mobile-editor-wrapper {
  display: flex;
  flex-direction: column;
}

.is-modalopened {
  height: 100vh;
  overflow-y: hidden;
}

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

#ALISEditor * {
  max-width: 100vw;
  box-sizing: border-box;
}

#ALISEditor body textarea,
#ALISEditor body .paragraph,
#ALISEditor h2,
#ALISEditor h3,
#ALISEditor h4,
#ALISEditor h5 {
  font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial',
    'Lucida Grande', 'sans-serif', Sans-Serif;
  line-height: 1.5;
  letter-spacing: 1.5px;
}

#ALISEditor p {
  margin: 0.25em 0;
}

#app {
  width: 900px;
  margin: 0 auto;
  position: relative;
}

#ALISEditor a,
#ALISEditor a:visited {
  color: #4372e0;
  display: inline-block;
  margin: 0 4px;
  font-weight: 400;
}

@media (max-width: 768px) {
  html {
    font-size: 8px;
  }
  .insert-button {
    display: none !important;
  }
}

@media (min-width: 768px) {
  .mobile-insert {
    display: none !important;
  }
}

@media (max-width: 400px) {
  #app::before {
    height: 100vw;
  }
}

.new-editor-container {
  width: 1100px;
  margin: 0 auto;
}

.area-app-header-container,
#mobile-editor-wrapper {
  width: 880px;
  margin: 0 auto;
  z-index: 2;
}
</style>
