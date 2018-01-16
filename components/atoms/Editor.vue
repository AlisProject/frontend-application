<template>
  <div class="area-editor-container">
    <input
      class="area-title"
      type="text"
      placeholder="タイトル"
      @input="onInputTitle"
      :value="title">
    <div class="area-body" ref="editable" @input="onInputBody" :value="body"/>
  </div>
</template>

<script>
/* eslint no-undef: 0 */
import { mapMutations } from 'vuex'
import * as types from '~/store/mutation-types'
import 'medium-editor/dist/css/medium-editor.min.css'
import 'medium-editor/dist/css/themes/default.min.css'

export default {
  props: {
    title: String,
    body: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.initMediumEditor()
    this.$refs.editable.innerHTML = this.body
  },
  methods: {
    initMediumEditor() {
      const editorElement = new MediumEditor('.area-body', {
        placeholder: {
          text: this.body === '' ? 'あなたの物語を教えてください･･･' : ''
        }
      })
      $(() => {
        $('.area-body').mediumInsert({
          editor: editorElement
        })
      })
    },
    onInputTitle({ target: { value: title } }) {
      this.updateTitle({ title })
    },
    onInputBody({ target: { innerHTML: body } }) {
      this.updateBody({ body })
    },
    ...mapMutations('story', { updateTitle: types.UPDATE_TITLE, updateBody: types.UPDATE_BODY })
  }
}
</script>

<style lang="scss" scoped>
.area-editor-container {
  display: grid;
  grid-area: editor;
  grid-template-rows: 50px 500px 50px;
  grid-template-columns: 1082px;
  /* prettier-ignore */
  grid-template-areas:
    "title"
    "body ";
}

.area-title {
  grid-area: title;
  width: 100%;
}

.area-body {
  grid-area: body;
  width: 100%;
  overflow: scroll;
}

.medium-editor-insert-plugin .medium-insert-buttons button {
  margin-top: -6px;
}
</style>
