<template>
  <div class="area-editor-container">
    <input
      class="area-title"
      type="text"
      placeholder="タイトル"
      spellcheck="false"
      @input="onInputTitle"
      :value="title">
    <div class="area-body" ref="editable" @input="onInputBody"/>
  </div>
</template>

<script>
/* eslint no-undef: 0 */
import { mapActions, mapGetters } from 'vuex'
import 'medium-editor/dist/css/medium-editor.min.css'

export default {
  props: {
    title: String
  },
  computed: {
    ...mapGetters('article', ['articleId']),
    ...mapGetters('user', ['showRestrictEditArticleModal'])
  },
  mounted() {
    this.initMediumEditor()
    window.addEventListener('resize', this.handleResize)
    if (window.innerWidth <= 640) {
      document.querySelector('html,body').style.overflow = 'hidden'
      this.setRestrictEditArticleModal({ showRestrictEditArticleModal: true })
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initMediumEditor() {
      const editorElement = new MediumEditor('.area-body', {
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
      $(() => {
        $('.area-body').mediumInsert({
          editor: editorElement,
          addons: {
            Part: true,
            embeds: false,
            images: {
              fileUploadOptions: { maxFileSize: 6 * 1024 * 1024 },
              messages: {
                maxFileSizeError: '画像は6MBまでアップロード可能です：'
              }
            }
          }
        })
      })
    },
    onInputTitle({ target: { value: title } }) {
      this.updateTitle({ title })
    },
    async onInputBody() {
      const images = Array.from(document.querySelectorAll('.area-body figure img'))
      /* eslint-disable space-before-function-paren */
      await Promise.all(
        images.map(async (img) => {
          this.setIsSaving({ isSaving: true })

          const isBase64Image = img.src.includes('data:')
          const isNotUploadedImage = img.dataset.status !== 'uploaded'
          const isNotUploadingImage = img.dataset.status !== 'uploading'
          if (isBase64Image && isNotUploadedImage && isNotUploadingImage) {
            img.dataset.status = 'uploading'
            try {
              const base64Image = img.src
              const base64Hash = base64Image.substring(base64Image.match(',').index + 1)
              const imageContentType = base64Image.substring(
                base64Image.match(':').index + 1,
                base64Image.match(';').index
              )
              const { articleId } = this.articleId === '' ? this.$route.params : this
              const { image_url: imageUrl } = await this.postArticleImage({
                articleId,
                articleImage: base64Hash,
                imageContentType
              })
              img.src = imageUrl
              img.dataset.status = 'uploaded'
              this.setIsSaved({ isSaved: true })
            } catch (error) {
              console.error(error)
              img.dataset.status = ''
            }
          }
        })
      )
      const thumbnails = images
        .filter((img) => img.dataset.status === 'uploaded' || img.src.includes(process.env.DOMAIN))
        .map((img) => img.src)
      this.updateSuggestedThumbnails({ thumbnails })
      const hasNotImage = images.length === 0 && thumbnails.length === 0
      const hasNotUploadingImage = images.length !== 0 && thumbnails.length !== 0
      if (hasNotImage || hasNotUploadingImage) {
        $('.area-body')
          .find('span[style]')
          .contents()
          .unwrap()
        const body = document.querySelector('.area-body').innerHTML
        this.updateBody({ body })
        this.setIsSaved({ isSaved: true })
      }
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
    ...mapActions('article', [
      'updateTitle',
      'updateBody',
      'addTag',
      'updateTag',
      'updateSuggestedThumbnails',
      'postArticleImage',
      'setRestrictEditArticleModal',
      'setIsSaving',
      'setIsSaved'
    ]),
    ...mapActions('user', ['setRestrictEditArticleModal'])
  }
}
</script>

<style lang="scss" scoped>
.area-editor-container {
  display: grid;
  grid-area: editor;
  grid-template-rows: 32px 500px 70px;
  grid-gap: 40px;
  grid-template-columns: 640px;
  /* prettier-ignore */
  grid-template-areas:
    "title"
    "body "
    "tags ";
}

.area-title {
  color: #040404;
  font-family: 'Yu Gothic', YuGothic;
  font-size: 24px;
  font-weight: bold;
  grid-area: title;
  height: 32px;
  letter-spacing: 2px;
  line-height: 32px;
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
