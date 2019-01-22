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
      <alis-editor-pc></alis-editor-pc>
    </no-ssr>
  </div>
</template>

<script>
/* global $ */
import { mapActions, mapGetters } from 'vuex'
import {
  getThumbnails,
  createInsertPluginTemplateFromUrl,
  preventDragAndDrop,
  resizeTextarea
} from '~/utils/article'

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
      updateArticleInterval: null,
      isInitTitleHeight: false
    }
  },
  computed: {
    ...mapGetters('article', ['articleId', 'isEdited', 'thumbnail']),
    ...mapGetters('user', ['showRestrictEditArticleModal'])
  },
  mounted() {
    resizeTextarea({
      targetElement: this.$el.querySelector('.area-title'),
      height: '40px',
      lineHeight: '1.5'
    })

    preventDragAndDrop(window)
    const preventDragAndDropInterval = setInterval(() => {
      if (!this.$el.querySelector('.medium-insert-buttons')) return
      preventDragAndDrop(this.$el.querySelector('.medium-insert-buttons'))
      clearInterval(preventDragAndDropInterval)
    }, 100)

    // Start update article interval
    this.updateArticle()
  },
  beforeDestroy() {
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
      'setIsSaving',
      'postNewArticle',
      'setIsEdited',
      'setSaveStatus',
      'updateThumbnail'
    ])
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
  }

  .area-title {
    letter-spacing: 0.01em;
  }
}
</style>
