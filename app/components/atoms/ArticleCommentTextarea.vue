<template>
  <textarea
    class="comment-textarea"
    :class="{ 'no-border': noBorder }"
    type="text"
    placeholder="コメントを入力してください"
    maxlength="400"
    @focus="handleFocus"
    @input="handleInput"
    :value="value"
  />
</template>

<script>
import { espaceHTML } from '~/utils/text'

export default {
  props: {
    value: String,
    noBorder: Boolean
  },
  mounted() {
    const textarea = this.$el
    textarea.style.lineHeight = '18px'
    textarea.style.height = '60px'

    textarea.addEventListener('input', (event) => {
      if (event.target.scrollHeight > event.target.offsetHeight) {
        event.target.style.height = `${event.target.scrollHeight}px`
        return
      }
      let height, lineHeight
      while (true) {
        height = Number(event.target.style.height.split('px')[0])
        lineHeight = Number(event.target.style.lineHeight.split('px')[0])
        event.target.style.height = `${height - lineHeight}px`
        if (event.target.scrollHeight > event.target.offsetHeight) {
          event.target.style.height = `${event.target.scrollHeight}px`
          break
        }
      }
    })

    const viewportMeta = document.querySelector('meta[name="viewport"]')
    textarea.addEventListener('touchstart', (event) => {
      viewportMeta.setAttribute('content', 'width=device-width,initial-scale=1,user-scalable=0')
    })
    textarea.addEventListener('blur', (event) => {
      viewportMeta.setAttribute('content', 'width=device-width,initial-scale=1')
    })
  },
  methods: {
    handleInput(event) {
      const { target: { value } } = event
      const escapedHTML = espaceHTML(value)
      console.log(escapedHTML.length)
      if (escapedHTML.length >= 400) {
        event.preventDefault()
        this.$emit('input', this.value)
        return false
      }
      this.$emit('input', value)
    },
    handleFocus(event) {
      this.$emit('focus', event)
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-textarea {
  -webkit-appearance: none;
  border-radius: 0;
  border: none;
  border: 1px dotted #232538;
  font-family: YuGothic, 'Helvetica Neue', Helvetica, Arial, 游ゴシック体, '游ゴシック',
    'ヒラギノ角ゴ ProN W3', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ Pro W3',
    'Hiragino Kaku Gothic Pro', 'メイリオ', Meiryo, 'MS ゴシック', 'MS Gothic', sans-serif;
  font-size: 12px;
  height: 4em;
  margin: 14px 0 8px;
  overflow: hidden;
  padding: 5px;
  resize: none;
  width: 100%;
  box-sizing: border-box;

  &.no-border {
    border: none;
  }

  &::-webkit-input-placeholder {
    color: #cecece;
    font-size: 14px;
    letter-spacing: 0.05em;
  }

  &:focus {
    border: none;
    outline: 0;
  }
}
</style>
