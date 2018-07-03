<template>
  <div class="area-editor-container">
    <input
      class="area-title"
      type="text"
      placeholder="タイトル"
      spellcheck="false"
      maxlength="255"
      @input="onInputTitle"
      :value="title">
    <div
      class="area-body"
      ref="editable"
      @dragover="preventDragoverImage"
      @drop="preventDropImage"
    />
  </div>
</template>

<script>
/* eslint no-undef: 0 */
/* eslint-disable space-before-function-paren */
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import urlRegex from 'url-regex'
import {
  getIframelyUrlTemplate,
  getTwitterProfileTemplate,
  getIframelyEmbedTemplate,
  getThumbnails,
  createInsertPluginTemplateFromUrl
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
      targetDOM: null,
      editorElement: null,
      updateArticleInterval: null
    }
  },
  computed: {
    ...mapGetters('article', ['articleId', 'isEdited']),
    ...mapGetters('user', ['showRestrictEditArticleModal'])
  },
  mounted() {
    this.initMediumEditor()
    window.addEventListener('resize', this.handleResize)
    if (window.innerWidth <= 640) {
      document.querySelector('html,body').style.overflow = 'hidden'
      this.setRestrictEditArticleModal({ showRestrictEditArticleModal: true })
    }
    this.preventDragAndDrop(window)
    this.preventDragAndDrop(document.querySelector('.medium-insert-buttons'))
    $('.area-body').keydown((e) => {
      const enterKeyCode = 13
      const pressedEnterkey = e.keyCode === enterKeyCode
      if (pressedEnterkey && e.target.tagName === 'FIGCAPTION') {
        e.preventDefault()
      }
    })
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
        this.$el.onkeydown = async (event) => {
          if (event.key === 'Enter') {
            const line = this.editorElement.getSelectedParentElement().textContent
            const trimmedLine = line.trim()
            if (urlRegex({ exact: true }).test(trimmedLine)) {
              const selectedParentElement = this.editorElement.getSelectedParentElement()
              let result
              if (
                trimmedLine === 'https://twitter.com' ||
                trimmedLine.startsWith('https://twitter.com/')
              ) {
                const isTweet = trimmedLine.split('/')[4] === 'status'
                try {
                  result = await this.$axios.$get(
                    `https://iframe.ly/api/oembed?api_key=${
                      process.env.IFRAMELY_API_KEY
                    }&url=${encodeURIComponent(trimmedLine)}&omit_script=1&omit_css=1`
                  )
                } catch (error) {
                  const message = isTweet
                    ? 'ツイートが取得できませんでした。'
                    : 'Twitterのユーザー情報が取得できませんでした。'
                  this.sendNotification({
                    text: message,
                    type: 'warning'
                  })
                  console.error(error)
                  return
                }

                selectedParentElement.innerHTML = ''

                if (isTweet) {
                  this.editorElement.pasteHTML(getIframelyUrlTemplate(trimmedLine))
                  iframely.load()
                } else {
                  this.editorElement.pasteHTML(
                    `<br>
                  ${getTwitterProfileTemplate({ ...result })}
                  <br>`,
                    { cleanAttrs: ['twitter-profile-card', 'title', 'description', 'site'] }
                  )
                }
              } else {
                try {
                  result = await this.$axios.$get(
                    `https://iframe.ly/api/iframely?api_key=${
                      process.env.IFRAMELY_API_KEY
                    }&url=${encodeURIComponent(trimmedLine)}&omit_script=1&omit_css=1`
                  )
                } catch (error) {
                  console.error(error)
                  return
                }
                const { title, description } = result.meta
                const hasTitleOrDescription = title !== undefined || description !== undefined
                if (!hasTitleOrDescription) return

                selectedParentElement.innerHTML = ''

                this.editorElement.pasteHTML(
                  `<br>
                    ${getIframelyEmbedTemplate({ ...result })}
                    <br>`,
                  {
                    cleanAttrs: [
                      'iframely-embed-card',
                      'title',
                      'description',
                      'site',
                      'thumbnail',
                      'without-space'
                    ]
                  }
                )
              }
            }
          }
        }
      })
      $(() => {
        $('.area-body').mediumInsert({
          editor: this.editorElement,
          addons: {
            Part: true,
            embeds: false,
            images: {
              fileUploadOptions: { maxFileSize: 4.5 * 1024 * 1024 },
              messages: {
                maxFileSizeError: '画像は4.5MBまでアップロード可能です：'
              }
            }
          }
        })
      })
    },
    async updateArticle() {
      try {
        await (async () => {
          // Do nothing if user don't edit article
          if (!this.isEdited) {
            this.setSaveStatus({ saveStatus: '' })
            return
          }

          // Init
          this.setIsSaving({ isSaving: true })
          this.setIsEdited({ isEdited: false })
          this.setSaveStatus({ saveStatus: 'Saving...' })
          if (this.articleId === '') await this.setArticleId()

          // Upload images
          try {
            await this.uploadImages()
          } catch (error) {
            console.error(error)
          }

          // Upload article
          await this.uploadArticle()

          this.setSaveStatus({ saveStatus: 'Saved' })
          this.setIsSaving({ isSaving: false })
        })()
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
          text: '記事の作成に失敗しました。',
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
      $('.area-body')
        .find('span[style]')
        .contents()
        .unwrap()
      const body = this.removeUselessDOMFromArticleBody()
      this.updateBody({ body })

      try {
        await this.putArticle()
      } catch (error) {
        this.sendNotification({ text: '記事の更新に失敗しました。', type: 'warning' })
        throw new Error('Update article failed.')
      }
    },
    async uploadImages() {
      const images = Array.from(this.$el.querySelectorAll('figure img'))
      await Promise.all(
        images.map(async (img) => {
          const isBase64Image = img.src.includes('data:')
          if (isBase64Image) {
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
              this.sendNotification({ text: '画像のアップロードに失敗しました。', type: 'warning' })
              throw new Error('Image upload failed.')
            }
          }
        })
      )
      // Update thumbnails
      const thumbnails = getThumbnails(images)
      this.updateSuggestedThumbnails({ thumbnails })
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
    addEmptyTag() {
      if (this.tags.length >= 5) return
      this.addTag({
        id: Math.random()
          .toString(36)
          .slice(-9),
        name: ''
      })
    },
    onInputTag({ target }) {
      const { id, value: name } = target
      this.updateTag({ id, name })
    },
    handleResize() {
      if (window.innerWidth <= 640) {
        if (!this.showRestrictEditArticleModal) {
          document.querySelector('html,body').style.overflow = 'hidden'
          this.setRestrictEditArticleModal({ showRestrictEditArticleModal: true })
        }
      } else {
        if (this.showRestrictEditArticleModal) {
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
      const reader = new FileReader()
      reader.onload = ({ currentTarget: { result } }) => {
        this.targetDOM.after($(createInsertPluginTemplateFromUrl(result)))
        this.targetDOM = null
        this.setIsEdited({ isEdited: true })
      }
      reader.readAsDataURL(target)
    },
    preventDragAndDrop(element) {
      element.addEventListener(
        'drop',
        (e) => {
          e.preventDefault()
          e.stopPropagation()
        },
        false
      )
      element.addEventListener(
        'dragover',
        (e) => {
          e.preventDefault()
          e.stopPropagation()
        },
        false
      )
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', [
      'updateTitle',
      'updateBody',
      'addTag',
      'updateTag',
      'updateSuggestedThumbnails',
      'postArticleImage',
      'setRestrictEditArticleModal',
      'setIsSaving',
      'postNewArticle',
      'setIsEdited',
      'setSaveStatus'
    ]),
    ...mapActions('user', ['setRestrictEditArticleModal'])
  }
}
</script>

<style lang="scss" scoped>
.area-editor-container {
  display: grid;
  grid-area: editor;
  grid-template-rows: 32px min-content;
  // grid-template-rows: 32px 500px 70px;
  grid-gap: 40px;
  grid-template-columns: 640px;
  /* prettier-ignore */
  grid-template-areas:
    "title"
    "body ";
  // "tags ";
}

.area-title {
  color: #040404;
  font-family: 'Yu Gothic', YuGothic;
  font-size: 24px;
  font-weight: bold;
  grid-area: title;
  height: 32px;
  letter-spacing: 0.1em;
  line-height: 1.5;
  border: 0;

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

.area-tags {
  grid-area: tags;
  position: relative;
}

.add-tag-button {
  border-radius: 50%;
  border: none;
  box-shadow: 0 3px 10px 0 rgba(146, 146, 146, 0.5);
  color: #cacaca;
  height: 32px;
  left: -50px;
  position: absolute;
  width: 32px;

  &:focus {
    outline: 0;
  }
}

.tag {
  background: #eee;
  border-radius: 4px;
  border: none;
  color: #898989;
  font-family: 'Yu Gothic', YuGothic;
  font-size: 14px;
  font-weight: 500;
  line-height: 12px;
  padding: 4px;
  text-align: center;
  margin: 0 2px 4px;
  display: inline-block;

  &:focus {
    outline: 0;
  }
}

@media screen and (max-width: 640px) {
  .area-editor-container {
    grid-template-columns: 1fr;
    display: none;
  }
}
</style>
