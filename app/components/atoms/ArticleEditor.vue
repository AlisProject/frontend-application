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
      <alis-editor-pc v-if="isPc" />
    </no-ssr>
    <no-ssr>
      <alis-editor-sp v-if="isMobile" />
    </no-ssr>
    <!-- TODO: 分岐を追加 -->
    <!--<div-->
      <!--class="area-body"-->
      <!--ref="editable"-->
      <!--@dragover="preventDragoverImage"-->
      <!--@drop="preventDropImage"-->
    <!--/>  -->
  </div>
</template>

<script>
/* global $, MediumEditor, iframely */
import { mapActions, mapGetters } from 'vuex'
import urlRegex from 'url-regex'
import {
  getIframelyUrlTemplate,
  getTwitterProfileTemplate,
  getIframelyEmbedTemplate,
  getThumbnails,
  createInsertPluginTemplateFromUrl,
  getResourceFromIframely,
  preventDragAndDrop,
  preventDropImageOnOGPContent,
  isYouTubeVideoURL,
  isFacebookPostURL,
  isInstagramURL,
  resizeTextarea
} from '~/utils/article'
import 'medium-editor/dist/css/medium-editor.min.css'

export default {
  props: {
    title: String,
    putArticle: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isPc: false,
      isMobile: false,
      targetDOM: null,
      editorElement: null,
      updateArticleInterval: null,
      isInitTitleHeight: false
    }
  },
  computed: {
    ...mapGetters('article', ['articleId', 'isEdited', 'thumbnail']),
    ...mapGetters('user', ['showRestrictEditArticleModal'])
  },
  beforeMount() {
  },
  mounted() {
    resizeTextarea({
      targetElement: this.$el.querySelector('.area-title'),
      height: '40px',
      lineHeight: '1.5'
    })
    this.initMediumEditor()
    // window.addEventListener('resize', this.handleResize)
    if (window.innerWidth <= 640) {
      this.isPc = false
      this.isMobile = true
    // TODO: 表示分岐追加
    //   this.setRestrictEditArticleModal({ showRestrictEditArticleModal: true })
    } else {
      this.isPc = true
      this.isMobile = false
    }

    preventDragAndDrop(window)
    const preventDragAndDropInterval = setInterval(() => {
      if (!this.$el.querySelector('.medium-insert-buttons')) return
      preventDragAndDrop(this.$el.querySelector('.medium-insert-buttons'))
      clearInterval(preventDragAndDropInterval)
    }, 100)
    // TODO: editorの表示分岐を追加
    // $('.area-body').keydown((e) => {
    //   const enterKeyCode = 13
    //   const pressedEnterkey = e.keyCode === enterKeyCode
    //   if (pressedEnterkey && e.target.tagName === 'FIGCAPTION') {
    //     e.preventDefault()
    //   }
    // })

    // Start update article interval
    this.updateArticle()
  },
  beforeDestroy() {
    this.setSaveStatus({ saveStatus: '' })
    clearInterval(this.updateArticleInterval)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initMediumEditor() {
      this.editorElement = new MediumEditor('.area-body', {
        imageDragging: false,
        toolbar: {
          buttons: [
            {
              name: 'h2',
              action: 'append-h2',
              tagNames: ['h2'],
              contentDefault: '',
              classList: ['custom-class-h2']
            },
            {
              name: 'h3',
              action: 'append-h3',
              tagNames: ['h3'],
              contentDefault: '',
              classList: ['custom-class-h3']
            },
            {
              name: 'quote',
              action: 'append-blockquote',
              tagNames: ['quote'],
              contentDefault: '',
              classList: ['custom-class-quote']
            },
            'quote',
            {
              name: 'bold',
              action: 'bold',
              tagNames: ['b', 'strong'],
              contentDefault: '',
              classList: ['custom-class-bold']
            },
            {
              name: 'italic',
              action: 'italic',
              tagNames: ['i'],
              contentDefault: '',
              classList: ['custom-class-italic']
            },
            'anchor'
          ],
          diffTop: -20
        },
        placeholder: {
          text: ''
        },
        spellcheck: false
      })
      this.editorElement.subscribe('editableInput', (event, editable) => {
        this.setIsEdited({ isEdited: true })
        this.$el.onkeydown = (event) => this.handleEditorInput(event)
      })
      // TODO: 表示分岐を追加
      // $(() => {
      //   $('.area-body').mediumInsert({
      //     editor: this.editorElement,
      //     addons: {
      //       Part: true,
      //       embeds: false,
      //       images: {
      //         fileUploadOptions: { maxFileSize: 4.5 * 1024 * 1024 },
      //         messages: {
      //           maxFileSizeError: '画像は4.5MBまでアップロード可能です：'
      //         }
      //       }
      //     }
      //   })
      // })
    },
    async handleEditorInput(event) {
      const line = MediumEditor.util.getTopBlockContainer(
        this.editorElement.getSelectedParentElement()
      ).textContent
      const trimmedLine = line.trim()
      if (event.key !== 'Enter' || !urlRegex({ exact: true }).test(trimmedLine)) {
        // Enter もしくは URL 構造でない場合は行う処理がない
        return
      }
      const selectedParentElement = MediumEditor.util.getTopBlockContainer(
        this.editorElement.getSelectedParentElement()
      )
      const isTwitterResource =
        trimmedLine === 'https://twitter.com' || trimmedLine.startsWith('https://twitter.com/')
      const isTweet = isTwitterResource && trimmedLine.split('/')[4] === 'status'
      const isGistResource = trimmedLine.startsWith('https://gist.github.com/')
      const isYouTubeResource = isYouTubeVideoURL(trimmedLine)
      const isFacebookResource = isFacebookPostURL(trimmedLine)
      const isInstagramResource = isInstagramURL(trimmedLine)
      let result, cleanAttrs, embedHTML
      try {
        result = (await getResourceFromIframely(
          isTwitterResource ? 'oembed' : 'iframely',
          trimmedLine
        )).data
      } catch (error) {
        console.error(error)
        return
      }
      selectedParentElement.innerHTML = ''
      if (
        isTweet ||
        isGistResource ||
        isYouTubeResource ||
        isFacebookResource ||
        isInstagramResource
      ) {
        this.editorElement.pasteHTML(getIframelyUrlTemplate(trimmedLine))
        iframely.load()
        return
      }
      if (!isTwitterResource) {
        const { title, description } = result.meta
        const hasTitleOrDescription = title !== undefined || description !== undefined
        if (!hasTitleOrDescription) return
        embedHTML = getIframelyEmbedTemplate({ ...result })
        cleanAttrs = [
          'iframely-embed-card',
          'title',
          'description',
          'site',
          'thumbnail',
          'without-space'
        ]
      } else {
        const { title, description } = result
        const hasTitleOrDescription = title !== undefined || description !== undefined
        if (!hasTitleOrDescription) return
        embedHTML = getTwitterProfileTemplate({ ...result })
        cleanAttrs = ['twitter-profile-card', 'title', 'description', 'site']
      }
      this.editorElement.pasteHTML(
        `<br>
          ${embedHTML}
          <br>`,
        {
          cleanAttrs
        }
      )
      // Prevent drop image on OGP content
      preventDropImageOnOGPContent()
    },
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
        if (this.articleId === '') await this.setArticleId()

        // Upload images
        try {
          await this.uploadImages()
        } catch (error) {
          console.error(error)
        }

        // Upload article
        await this.uploadArticle()

        this.setSaveStatus({ saveStatus: '保存済み' })
        this.setIsSaving({ isSaving: false })
      } catch (error) {
        console.error(error)
      } finally {
        this.updateArticleInterval = setTimeout(this.updateArticle, 2000)
      }
    },
    async setArticleId() {
      try {
        const article = { title: '', body: '' }
        await this.postNewArticle({ article })
      } catch (error) {
        this.sendNotification({
          text: '記事の作成に失敗しました',
          type: 'warning'
        })
        throw new Error('Post article failed.')
      }
    },
    onInputTitle() {
      this.setIsEdited({ isEdited: true })
    },
    async uploadArticle() {
      // Update title
      this.updateTitle({ title: $('.area-title').val() })

      // Update body
      // TODO: 表示分岐を追加
      // $('.area-body')
      //   .find('span[style]')
      //   .contents()
      //   .unwrap()
      // const body = this.removeUselessDOMFromArticleBody()
      const body = this.$el.querySelector('#editor').innerHTML
      this.updateBody({ body })

      try {
        await this.putArticle()
      } catch (error) {
        this.sendNotification({ text: '記事の更新に失敗しました', type: 'warning' })
        throw new Error('Update article failed.')
      }
    },
    async uploadImages() {
      const images = Array.from(this.$el.querySelectorAll('figure img'))
      await Promise.all(
        images.map(async (img) => {
          const isBase64Image = img.src.includes('data:')
          if (!isBase64Image) {
            return
          }
          try {
            const base64Image = img.src
            const base64Hash = base64Image.substring(base64Image.match(',').index + 1)
            const imageContentType = base64Image.substring(
              base64Image.match(':').index + 1,
              base64Image.match(';').index
            )
            const { image_url: imageUrl } = await this.postArticleImage({
              articleId: this.articleId,
              articleImage: base64Hash,
              imageContentType
            })
            img.src = imageUrl
          } catch (error) {
            this.sendNotification({ text: '画像のアップロードに失敗しました', type: 'warning' })
            throw new Error('Image upload failed.')
          }
        })
      )
      // Update thumbnails
      const thumbnails = getThumbnails(images)
      this.updateSuggestedThumbnails({ thumbnails })
      if (!thumbnails.includes(this.thumbnail)) {
        this.updateThumbnail({ thumbnail: '' })
      }
      // Prevent drag & drop on image
      Array.from(this.$el.querySelectorAll('.medium-insert-images')).forEach((element) => {
        if (element.dataset.preventedDragAndDrop === 'true') return
        preventDragAndDrop(element)
        element.dataset.preventedDragAndDrop = true
      })
    },
    removeUselessDOMFromArticleBody() {
      const serializedContents = this.editorElement.serialize()
      const serializedBody = serializedContents['element-0'].value
      const $bodyTmp = $(`<div>${serializedBody}</div>`)
      $bodyTmp.find('[src^="data:image/"]').each((_i, element) => {
        element.src = ''
      })
      $bodyTmp.find('[data-alis-iframely-url]').each((_i, element) => {
        element.innerHTML = ''
      })
      return $bodyTmp.html()
    },
    matchAll(str, regexp) {
      const matches = []
      str.replace(regexp, function() {
        const arr = [].slice.call(arguments, 0)
        const extras = arr.splice(-2)
        arr.index = extras[0]
        arr.input = extras[1]
        matches.push(arr)
      })
      return matches.length ? matches : null
    },
    handleResize() {
      if (window.innerWidth <= 640) {
        if (!this.showRestrictEditArticleModal) {
          this.setRestrictEditArticleModal({ showRestrictEditArticleModal: true })
        }
      } else {
        if (this.showRestrictEditArticleModal) {
          document.querySelector('html,body').style.overflow = ''
          this.setRestrictEditArticleModal({ showRestrictEditArticleModal: false })
        }
      }
    },
    preventDragoverImage(event) {
      event.preventDefault()
      event.stopPropagation()
      setTimeout(() => {
        this.targetDOM = $('.medium-editor-dragover')
      }, 10)
      return false
    },
    preventDropImage(event) {
      event.preventDefault()
      event.stopPropagation()
      this.insertDragImage(event.dataTransfer.files)
      return false
    },
    insertDragImage(files) {
      if (this.targetDOM[0].classList.value.includes('area-body')) return
      const [target] = files
      const MAX_UPLOAD = 4.5 * 1024 * 1024 // 4.5 MB
      if (target.size > MAX_UPLOAD) {
        this.sendNotification({ text: '画像は4.5MBまでアップロード可能です', type: 'warning' })
        return
      }
      if (!this.isImageContent(files[0].type)) return
      const reader = new FileReader()
      reader.onload = ({ currentTarget: { result } }) => {
        this.targetDOM.after($(createInsertPluginTemplateFromUrl(result)))
        this.targetDOM = null
        this.setIsEdited({ isEdited: true })
      }
      reader.readAsDataURL(target)
    },
    isImageContent(fileType) {
      return Boolean(fileType.match(/image.*/))
    },
    ...mapActions('article', [
      'updateTitle',
      'updateBody',
      'updateSuggestedThumbnails',
      'postArticleImage',
      'setRestrictEditArticleModal',
      'setIsSaving',
      'postNewArticle',
      'setIsEdited',
      'setSaveStatus',
      'updateThumbnail'
    ]),
    ...mapActions('user', ['setRestrictEditArticleModal'])
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

.medium-editor-placeholder-relative:after,
.medium-editor-placeholder:after {
  color: #898989;
  font-style: normal;
}

@media screen and (max-width: 640px) {
  .area-editor-container {
    grid-template-columns: 1fr;
    /* TODO: 表示分岐追加 */
    /*display: none;*/
  }

  .area-title {
    letter-spacing: 0.01em;
  }
}
</style>
