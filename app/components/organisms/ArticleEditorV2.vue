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
        :editorContent="editorContent"
      />
      <alis-editor-sp
        v-else
        :articleId="articleId"
        :clientId="clientId"
        :functions="functions"
        :editorContent="editorContent"
        @editor-mounted="fixToolbarPosition"
      />
    </no-ssr>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { resizeTextarea, getThumbnails } from '~/utils/article'
import { isIOS, isAndroid, isMobile } from '~/utils/device'

if (process.client && isMobile()) {
  require('~/assets/stylesheets/ckeditor-sp.scss')
  if (isAndroid()) require('~/assets/stylesheets/ckeditor-sp-android.scss')
} else {
  require('~/assets/stylesheets/ckeditor-pc.scss')
}

const editorToolbarTopOffsetHeight = process.client && window.innerWidth <= 640 ? 118 : 236

export default {
  props: {
    title: String,
    updateArticleTitle: {
      type: Function,
      required: true
    },
    putArticleBody: {
      type: Function
    },
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
        sendNotification,
        updateBody,
        putArticleBody,
        putThumbnail
      } = this

      return {
        getUserSession,
        setSaveStatus,
        setIsSaving,
        setIsEdited,
        sendNotification,
        updateBody,
        putArticleBody,
        putThumbnail
      }
    },
    ...mapGetters('article', ['articleId', 'isEdited', 'thumbnail', 'body']),
    ...mapGetters('user', ['showRestrictEditArticleModal'])
  },
  async mounted() {
    window.addEventListener('scroll', this.fixHeader)

    resizeTextarea({
      targetElement: this.$el.querySelector('.area-title'),
      height: '40px',
      lineHeight: '1.5'
    })
    this.isPc = !isMobile()

    // Start update article interval
    this.updateArticle()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.fixHeader)
    this.setSaveStatus({ saveStatus: '' })
    clearInterval(this.updateArticleInterval)
  },
  methods: {
    async updateArticle() {
      try {
        // Do nothing if user don't edit article
        if (!this.isEdited) {
          this.setSaveStatus({ saveStatus: '' })
          return
        }

        // Init
        this.setIsSaving({ isSaving: true })
        this.setIsEdited({ isEdited: false })
        this.setSaveStatus({ saveStatus: '保存中' })

        // Upload article
        await this.uploadArticleTitle()

        this.setSaveStatus({ saveStatus: '保存済み' })
        this.setIsSaving({ isSaving: false })
      } catch (error) {
        console.error(error)
      } finally {
        this.updateArticleInterval = setTimeout(this.updateArticle, 2000)
      }
    },
    onInputTitle() {
      this.setIsEdited({ isEdited: true })
    },
    async uploadArticleTitle() {
      // Update title
      this.updateTitle({ title: document.querySelector('.area-title').value })

      try {
        await this.updateArticleTitle()
      } catch (error) {
        this.sendNotification({ text: '記事の更新に失敗しました', type: 'warning' })
        throw new Error('Update article failed.')
      }
    },
    putThumbnail() {
      const images = Array.from(this.$el.querySelectorAll('figure img'))
      // Update thumbnails
      const thumbnails = getThumbnails(images)
      this.updateSuggestedThumbnails({ thumbnails })
      if (!thumbnails.includes(this.thumbnail)) {
        this.updateThumbnail({ thumbnail: '' })
      }
    },
    fixToolbarPosition() {
      if (!isIOS()) return
      if (!document.querySelector('.ck-toolbar')) return
      document.querySelector('.ck-toolbar').style.top = `-${editorToolbarTopOffsetHeight}px`
    },
    fixHeader() {
      if (isIOS()) {
        document.querySelector('.area-mobile-editor-header-container').style.top = `${
          window.pageYOffset
        }px`
        document.querySelector('.ck-toolbar').style.top = `${window.pageYOffset -
          editorToolbarTopOffsetHeight}px`
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
      'putArticleTitle',
      'updateBody',
      'putPublicArticleTitle'
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
    padding: 2px 12px;
  }
}
</style>
