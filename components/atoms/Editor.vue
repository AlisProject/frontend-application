<template>
  <div class="area-editor-container">
    <input
      class="area-title"
      type="text"
      placeholder="タイトル"
      @input="onInputTitle"
      :value="title">
    <div class="area-body" ref="editable" @input="onInputBody" :value="body"/>
    <button class="area-youtube-button" @click="onClickButton">Add YouTube iframe</button>
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
          text: this.body === '' ? 'あなたの物語を教えてください･･･' : ''
        }
      })
    },
    onClickButton() {
      const url = window.prompt('YouTubeのURLを入力してください')
      const id = this.getYoutubeId(url)
      const iframe = `<iframe width=560 height=315 src='//www.youtube.com/embed/${id}' frameborder=0 allowfullscreen></iframe>`
      this.$refs.editable.innerHTML += iframe
    },
    getYoutubeId(url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
      const match = url.match(regExp)

      if (match && match[2].length === 11) {
        return match[2]
      } else {
        return 'error'
      }
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
    "title         "
    "body          "
    "youtube-button";
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

.area-youtube-button {
  grid-area: youtube-button;
}
</style>
