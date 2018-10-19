<template>
  <div
    id="mobile-editor-wrapper"
    :class="{
      'is-modalopened': isOpenModal
    }"
  >
    <alis-editor
      style="position: relative;z-index: 1"
      @export="handlePublishEditor"
      :initialState="blocks"
    />
    <MobileEditorPublishModal
      v-if="isOpenModal"
      @close="handleCloseModal"
      :thumbnails="blocks.filter((block) => block.type === 'Image')"
    />
  </div>
</template>

<script>
import MobileEditorPublishModal from '~/components/organisms/MobileEditorPublishModal.vue'
import AppModal from '~/components/atoms/AppModal.vue'
import AlisEditor from 'alis-editor'
import uuid from 'uuid/v4'

export default {
  name: 'mobile-editor-page',
  components: {
    AppModal,
    AlisEditor,
    MobileEditorPublishModal
  },
  data() {
    return {
      isOpenModal: false,
      blocks: [
        {
          id: uuid(),
          type: 'Heading',
          payload: {
            size: 'h2'
          },
          children: [
            {
              id: uuid(),
              type: 'Text',
              payload: {
                body: '第一章 うさぎの穴をまっさかさま'
              }
            }
          ]
        },
        {
          id: uuid(),
          type: 'Heading',
          payload: {
            size: 'h3'
          },
          children: [
            {
              id: uuid(),
              type: 'Text',
              payload: {
                body: '第一節 白うさぎ'
              }
            }
          ]
        },
        {
          id: uuid(),
          type: 'Paragraph',
          payload: {
            body:
              '<p>でもそのうさぎがほんとうに、チョッキのポケットから懐中時計かいちゅうどけいをとりだしてそれをながめ、そしてまたあわててかけだしたとき、アリスもとびあがりました。というのも、チョッキのポケットなんかがあるうさぎはこれまで見たことがないし、そこからとりだす時計をもっているうさぎなんかも見たことないぞ、というのに急に気がついたからです。</p>'
          }
        },
        {
          id: '9cf0f329-e53b-4340-a96b-e58a9ef8b61e',
          type: 'Image',
          payload: {
            src: 'https://i.imgur.com/c4zRkB7.png'
          },
          children: []
        },
        {
          id: 'fewaarfa-123rewgrszb-t42qgvzaeg-awetw',
          type: 'Paragraph',
          payload: {
            body:
              '<p>そこで、きょうみしんしんになったアリスは、うさぎのあとを追っかけて野原をよこぎって、それがしげみの下の、おっきなうさぎの穴にとびこむのを、ぎりぎりのところで見つけました。</p>'
          }
        },
        {
          id: uuid(),
          type: 'Paragraph',
          payload: {
            body: 'http://www.gutenberg.org/ebooks/11'
          }
        }
      ]
    }
  },
  methods: {
    handleCloseModal() {
      this.isOpenModal = false
    },
    handlePublishEditor(blocks) {
      this.blocks = blocks
      this.isOpenModal = true
    }
  }
}
</script>

<style>
@import '~~/node_modules/alis-editor/dist/AlisEditor.css';
#mobile-editor-wrapper {
  max-width: 424px;
  margin: 0 auto;
}

#mobile-editor-wrapper.is-modalopened {
  height: 100vh;
  overflow-y: hidden;
}

html {
  font-size: 10px;
}
body {
  font-size: 14px;
}
html,
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  min-height: 100vh;
  font-family: sans-serif;
  overflow-x: hidden;
}

* {
  max-width: 100vw;
}

body textarea,
body .paragraph,
h2,
h3,
h4,
h5 {
  font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial',
    'Lucida Grande', 'sans-serif', Sans-Serif;
  line-height: 1.5;
  letter-spacing: 1.5px;
}

* {
  box-sizing: border-box;
}

p {
  margin: 0.25em 0;
}

#app {
  width: 900px;
  margin: 0 auto;
  position: relative;
}

a,
a:visited {
  color: #4372e0;
  display: inline-block;
  margin: 0 4px;
  font-weight: 400;
}

#log {
  margin-top: 40px;
  color: #fff;
  height: 200px;
  overflow: auto;
  background: #141414;
}
#log pre {
  width: 900px;
  padding: 20px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  html {
    font-size: 8px;
  }
  .insert-button {
    display: none !important;
  }
  /* .export-button {
          display: none !important;
        } */
  #log {
    display: none;
  }
}

@media (min-width: 768px) {
  .mobile-insert {
    display: none !important;
  }
}

@media (max-width: 400px) {
  #app::before {
    height: 100vw;
  }
}
</style>
