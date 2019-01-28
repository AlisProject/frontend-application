<template>
  <div class="area-editor-container">
    <textarea
      class="area-title"
      type="text"
      placeholder="タイトル"
      spellcheck="false"
      maxlength="255"
      @input="onInputTitle"
      @keydown.enter.prevent
      :value="title"/>
    <no-ssr>
      <alis-editor-pc
        v-if="isPc"
        :articleId="articleId"
        :clientId="clientId"
        :functions="functions"
        :status="status"
        :editorContent="editorContent"
      />
      <alis-editor-sp
        v-else
        :articleId="articleId"
        :clientId="clientId"
        :functions="functions"
        :status="status"
        :editorContent="editorContent"
      />
    </no-ssr>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { resizeTextarea } from '~/utils/article'

export default {
  props: {
    title: String,
    status: String, // drafts or public
    editorContent: String
  },
  data() {
    return {
      isPc: true,
      updateArticleInterval: null,
      isInitTitleHeight: false,
      clientId: process.env.CLIENT_ID
    }
  },
  computed: {
    functions() {
      const {
        getUserSession,
        setSaveStatus,
        setIsSaving,
        setIsEdited,
        updateSuggestedThumbnails,
        updateThumbnail
      } = this

      return {
        getUserSession,
        setSaveStatus,
        setIsSaving,
        setIsEdited,
        updateSuggestedThumbnails,
        updateThumbnail
      }
    },
    ...mapGetters('article', ['articleId', 'isEdited', 'thumbnail', 'body']),
    ...mapGetters('user', ['showRestrictEditArticleModal']),
    functions() {
      const {
        getUserSession,
        setSaveStatus,
        setIsSaving,
        setIsEdited,
        updateSuggestedThumbnails,
        updateThumbnail,
        sendNotification,
        updateBody
      } = this

      return {
        getUserSession,
        setSaveStatus,
        setIsSaving,
        setIsEdited,
        updateSuggestedThumbnails,
        updateThumbnail,
        sendNotification,
        updateBody
      }
    }
  },
  mounted() {
    resizeTextarea({
      targetElement: this.$el.querySelector('.area-title'),
      height: '40px',
      lineHeight: '1.5'
    })
    const isIOS = /iP(hone|(o|a)d)/.test(navigator.userAgent)
    const isAndroid = navigator.userAgent.includes('Android')
    this.isPc = !isIOS && !isAndroid

    // Start update article interval
    this.editArticleTitle()
  },
  beforeDestroy() {
    this.setSaveStatus({ saveStatus: '' })
    clearInterval(this.updateArticleInterval)
  },
  methods: {
    async editArticleTitle() {
      try {
        // Do nothing if user don't edit article
        if (!this.isEdited) {
          this.setSaveStatus({ saveStatus: '' })
          return
        }
        // Update title
        await this.updateTitle({ title: document.querySelector('.area-title').value })
        // Init
        this.setIsSaving({ isSaving: true })
        this.setIsEdited({ isEdited: false })
        this.setSaveStatus({ saveStatus: '保存中' })
        // Save Title
        const { title, articleId } = this
        const status = this.status
        await this.putArticleTitle({ title, articleId, status })
        this.setSaveStatus({ saveStatus: '保存済み' })
        this.setIsSaving({ isSaving: false })
      } catch (error) {
        this.sendNotification({ text: '記事の更新に失敗しました', type: 'warning' })
        console.error(error)
      } finally {
        this.updateArticleInterval = setTimeout(this.editArticleTitle, 2000)
      }
    },
    onInputTitle() {
      this.setIsEdited({ isEdited: true })
    },
    async uploadArticleTitle() {
      // Update title
      this.updateTitle({ title: document.querySelector('.area-title').value })

      try {
        await this.putArticle()
      } catch (error) {
        this.sendNotification({ text: '記事の更新に失敗しました', type: 'warning' })
        throw new Error('Update article failed.')
      }
    },
    ...mapActions('article', [
      'updateTitle',
      'updateSuggestedThumbnails',
      'postArticleImage',
      'setRestrictEditArticleModal',
      'setIsSaving',
      'postNewArticle',
      'setIsEdited',
      'setSaveStatus',
      'updateThumbnail',
      'putArticleTitle'
    ]),
    ...mapActions('user', ['setRestrictEditArticleModal', 'getUserSession']),
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    })
  },
  watch: {
    async title(value) {
      if (this.isInitTitleHeight) return
      await this.$nextTick()
      const textarea = this.$el.querySelector('.area-title')
      if (textarea.scrollHeight > textarea.offsetHeight) {
        textarea.style.height = `${textarea.scrollHeight}px`
      }
      this.isInitTitleHeight = true
    }
  }
}
</script>

<style lang="scss" scoped>
.area-editor-container {
  display: grid;
  grid-area: editor;
  grid-template-rows: min-content min-content;
  grid-gap: 20px;
  grid-template-columns: 640px;
  /* prettier-ignore */
  grid-template-areas:
    "title"
    "body ";
}

.area-title {
  grid-area: title;
  border: 0;
  color: #333;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.02em;
  line-height: 1.5;
  resize: none;

  &:placeholder-shown {
    color: #898989;
  }

  &:focus {
    outline: 0;
  }
}

.area-body {
  grid-area: body;
  width: 100%;
  padding-bottom: 120px;
  &.medium-editor-dragover {
    background: #fff;
  }
}

@media screen and (max-width: 640px) {
  .area-editor-container {
    grid-template-columns: 1fr;
  }

  .area-title {
    letter-spacing: 0.01em;
  }
}
</style>
