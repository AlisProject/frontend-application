<template>
  <div class="area-editor-container">
    <input
      class="area-title"
      type="text"
      placeholder="タイトル"
      @input="onInputTitle"
      :value="title">
    <div class="area-body" ref="editable" @input="onInputBody" :value="body"/>
    <div class="area-tags">
      <button class="add-tag-button" @click="addEmptyTag">＋</button>
      <input
        type="text"
        class="tag"
        v-for="tag in tags"
        :id="tag.id"
        :key="tag.id"
        :value="tag.name"
        @input="onInputTag"
        placeholder="タグを追加"/>
    </div>
  </div>
</template>

<script>
/* eslint no-undef: 0 */
import { mapMutations } from 'vuex'
import * as types from '~/store/mutation-types'
import 'medium-editor/dist/css/medium-editor.min.css'

export default {
  props: {
    title: String,
    body: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    this.initMediumEditor()
    this.$refs.editable.innerHTML = this.body
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
          text: this.body === '' ? 'あなたの物語を教えてください･･･' : ''
        },
        spellcheck: false
      })
      $(() => {
        $('.area-body').mediumInsert({
          editor: editorElement,
          addons: {
            Part: true
          }
        })
      })
    },
    onInputTitle({ target: { value: title } }) {
      this.updateTitle({ title })
    },
    onInputBody({ target: { innerHTML: body } }) {
      const suggestedThumbnails = this.matchAll(body, /<img.*src\s*=\s*["|'](.*?)["|'].*>/g)
      if (suggestedThumbnails) {
        const thumbnails = suggestedThumbnails.map((img) => img[1])
        this.updateSuggestedThumbnails({ thumbnails })
      }
      this.updateBody({ body })
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
      if (this.tags.length < 5) {
        this.addTag({
          id: Math.random()
            .toString(36)
            .slice(-9),
          name: ''
        })
      }
    },
    onInputTag({ target }) {
      const { id, value: name } = target
      this.updateTag({ id, name })
    },
    ...mapMutations('story', {
      updateTitle: types.UPDATE_TITLE,
      updateBody: types.UPDATE_BODY,
      addTag: types.ADD_TAG,
      updateTag: types.UPDATE_TAG,
      updateSuggestedThumbnails: types.UPDATE_SUGGESTED_THUMBNAILS
    })
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
  overflow: scroll;
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
</style>
