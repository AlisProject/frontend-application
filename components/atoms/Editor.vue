<template>
  <div class="area-editor-container">
    <input class="area-title" type="text" @input="onInputTitle" :value="title">
    <div class="area-body" ref="editable" @input="onInputBody" :value="body"/>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import * as types from '~/store/mutation-types'
import 'medium-editor/dist/css/medium-editor.min.css'
import 'medium-editor/dist/css/themes/default.min.css'
const MediumEditor = process.browser ? require('medium-editor') : null

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
      const editorElement = this.$refs.editable
      /* eslint no-new: 0 */
      new MediumEditor(editorElement, {
        placeholder: {
          text: this.body === '' ? 'Type your text' : ''
        }
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
  grid-template-rows: 50px 500px;
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
</style>
