<template>
  <div class="area-editor-container">
    <textarea
      class="area-title"
      type="text"
      placeholder="タイトル"
      spellcheck="false"
      maxlength="255"
      @input="onInputTitle"
      @keydown.enter.prevent="handleEnter"
      v-model="title"/>
    <no-ssr>
      <alis-editor-pc
        v-if="isChecked && isPc"
        class="area-body"
        :articleId="articleId"
        :clientId="clientId"
        :functions="functions"
        :editorContent="editorContent"
        :iframelyApiKey="iframelyApiKey"
        :domain="domain"
        :isPressedEnterInTitle="isPressedEnterInTitle"
      />
      <alis-editor-sp
        v-else-if="isChecked && !isPc"
        class="area-body"
        :articleId="articleId"
        :clientId="clientId"
        :functions="functions"
        :editorContent="editorContent"
        :iframelyApiKey="iframelyApiKey"
        :domain="domain"
        :isPressedEnterInTitle="isPressedEnterInTitle"
        @editor-mounted="fixToolbarPosition"
        ref="alisEditorSp"
      />
    </no-ssr>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import {
  resizeTextarea,
  getThumbnails,
  preventDragAndDrop,
  getResourceFromIframely
} from '~/utils/article'
import { isIOS, isAndroid, isMobile } from '~/utils/device'

if (process.client && isMobile()) {
  require('~/assets/stylesheets/ckeditor-sp.scss')
  if (isAndroid()) require('~/assets/stylesheets/ckeditor-sp-android.scss')
} else {
  require('~/assets/stylesheets/ckeditor-pc.scss')
}

export default {
  props: {
    defaultTitle: String,
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
      clientId: process.env.CLIENT_ID,
      iframelyApiKey: process.env.IFRAMELY_API_KEY,
      domain: process.env.DOMAIN,
      titleElementHeight: 40,
      isChecked: false,
      isPressedEnterInTitle: false,
      title: this.defaultTitle
    }
  },
  computed: {
    functions() {
      const {
        getUserSession,
        setSaveStatus,
        setIsSaving,
        setIsEditedBody,
        sendNotification,
        updateBody,
        putArticleBody,
        putThumbnail
      } = this

      return {
        getUserSession,
        setSaveStatus,
        setIsSaving,
        setIsEditedBody,
        sendNotification,
        updateBody,
        putArticleBody,
        putThumbnail,
        getResourceFromIframely
      }
    },
    editorToolbarTopOffsetHeight() {
      // alis-editor のツールバーをページの上部に表示させるため、元々エディタのすぐ上にある
      // ツールバーの位置を上に移動させる必要がある。
      // この算出プロパティではその高さを返している。
      // どれだけ上に移動するかは、タイトルのテキストエリアの高さにより変化するため、タイトルの文字数が変わるたびに
      // titleElementHeight の値を更新しこの算出プロパティで返す高さを更新している。
      return process.client && window.innerWidth <= 640
        ? 58 + this.titleElementHeight
        : 196 + this.titleElementHeight
    },
    ...mapGetters('article', ['articleId', 'isEditedTitle', 'thumbnail', 'body']),
    ...mapGetters('user', ['showRestrictEditArticleModal'])
  },
  async mounted() {
    if (isIOS()) {
      window.addEventListener('scroll', this.fixHeader)
    }
    window.addEventListener('error', this.handleError)
    this.isPc = !isMobile()
    this.isChecked = true
    await this.$nextTick()
    if (!this.isPc) {
      const areaTitleElement = this.$el.querySelector('.area-title')
      areaTitleElement.addEventListener('focus', this.handleTitleFocus)
      areaTitleElement.addEventListener('blur', this.handleTitleBlur)
    }
    const areaBodyElement = document.querySelector('.area-body')
    areaBodyElement.addEventListener('dragover', this.handleDragover)
    areaBodyElement.addEventListener('dragleave', this.handleDragleaveAndDrop)
    areaBodyElement.addEventListener('drop', this.handleDragleaveAndDrop)
    resizeTextarea({
      targetElement: this.$el.querySelector('.area-title'),
      height: `${this.titleElementHeight}px`,
      lineHeight: '1.5'
    })
    preventDragAndDrop(window)
    const textarea = this.$el.querySelector('.area-title')
    if (textarea.scrollHeight > textarea.offsetHeight) {
      textarea.style.height = `${textarea.scrollHeight}px`
    }
    await this.fixToolbarPositionByTitleElementHeight(textarea)

    // Start update article interval
    this.updateArticle()
  },
  beforeDestroy() {
    if (isIOS()) {
      window.removeEventListener('scroll', this.fixHeader)
    }
    window.removeEventListener('error', this.handleError)
    if (!this.isPc) {
      const areaTitleElement = this.$el.querySelector('.area-title')
      areaTitleElement.removeEventListener('focus', this.handleTitleFocus)
      areaTitleElement.removeEventListener('blur', this.handleTitleBlur)
    }
    const areaBodyElement = document.querySelector('.area-body')
    areaBodyElement.removeEventListener('dragover', this.handleDragover)
    areaBodyElement.removeEventListener('dragleave', this.handleDragleaveAndDrop)
    areaBodyElement.removeEventListener('drop', this.handleDragleaveAndDrop)
    this.setSaveStatus({ saveStatus: '' })
    clearInterval(this.updateArticleInterval)
  },
  methods: {
    async updateArticle() {
      try {
        // Do nothing if user don't edit article
        if (!this.isEditedTitle) {
          this.setSaveStatus({ saveStatus: '' })
          return
        }

        // Init
        this.setIsSaving({ isSaving: true })
        this.setIsEditedTitle({ isEditedTitle: false })
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
    async onInputTitle(event) {
      this.setIsEditedTitle({ isEditedTitle: true })
      await this.fixToolbarPositionByTitleElementHeight(event.target)
    },
    handleEnter(event) {
      if (!event.isComposing && event.target.textLength === event.target.selectionEnd) {
        this.isPressedEnterInTitle = !this.isPressedEnterInTitle
      }
    },
    async uploadArticleTitle() {
      // Update title
      this.updateTitle({ title: this.title })

      try {
        await this.updateArticleTitle()
      } catch (error) {
        this.sendNotification({
          text: '記事の更新に失敗しました。お手数ですが、しばらく時間を置いて再度お試しください',
          type: 'warning'
        })
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
      document.querySelector('.ck-toolbar').style.top = `-${this.editorToolbarTopOffsetHeight}px`
    },
    fixHeader() {
      document.querySelector('.area-mobile-editor-header-container').style.top = `${
        window.pageYOffset
      }px`
      document.querySelector('.ck-toolbar').style.top = `${window.pageYOffset -
        this.editorToolbarTopOffsetHeight}px`
    },
    async fixToolbarPositionByTitleElementHeight(targetElement) {
      // resizeTextarea 関数の処理後にタイトルの高さを取得しないと、リサイズ後の高さが取得できないため、
      // $nextTick で処理を遅らせている。
      await this.$nextTick()
      const titleElementHeight = Number(targetElement.style.height.split('px')[0])
      if (this.titleElementHeight === titleElementHeight) return
      this.titleElementHeight = titleElementHeight
      if (!document.querySelector('.ck-toolbar')) return
      document.querySelector('.ck-toolbar').style.top = `-${this.editorToolbarTopOffsetHeight}px`
    },
    handleDragover(e) {
      if (e.target.nodeName === 'P') {
        e.target.classList.add('alis-editor-dragover')
      }
    },
    handleDragleaveAndDrop(e) {
      if (e.target.nodeName === 'P') {
        e.target.classList.remove('alis-editor-dragover')
      }
    },
    changeToolbarButtonState(isEnabled) {
      if (!this.$refs.alisEditorSp) return
      this.$refs.alisEditorSp.changeToolbarButtonState(
        this.$refs.alisEditorSp.editor,
        this.$refs.alisEditorSp.toolbar,
        isEnabled
      )
    },
    handleTitleFocus() {
      this.changeToolbarButtonState(false)
    },
    handleTitleBlur() {
      this.changeToolbarButtonState(true)
    },
    handleError(event) {
      const message = (event.error && event.error.message) || ''
      if (message.startsWith('view-createPositionAt-offset-required:')) {
        return
      }
      this.sendNotification({
        text: 'エラーが発生しました。ページを再読み込みしてください',
        type: 'warning',
        dismissAfter: 60 * 60 * 1000 // 1 時間
      })
    },
    ...mapActions('article', [
      'updateTitle',
      'updateSuggestedThumbnails',
      'postArticleImage',
      'setRestrictEditArticleModal',
      'setIsSaving',
      'setIsEditedTitle',
      'setIsEditedBody',
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
    grid-gap: 0;
  }

  .area-title {
    letter-spacing: 0.01em;
    padding: 2px 12px;
  }

  .area-body {
    padding-bottom: 0;
  }
}
</style>
