<template>
  <section>
    <div class="tags-input-form" @click="focusToTagInputForm">
      <no-ssr>
        <vue-tags-input
          v-model="tag"
          :tags="tags"
          :max-tags="5"
          :maxlength="25"
          placeholder="タグを入力してください"
          :class="{ 'invalid-tag': isInvalidTag }"
          :autocomplete-items="filteredItems"
          @before-adding-tag="checkTags"
          @tags-changed="handleTagsChanged" />
      </no-ssr>
    </div>
    <span class="error-message">
      {{ errorMessage }}
    </span>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      tag: '',
      // isInvalidTagがtrueのとき、入力中のタグの文字色を赤くする
      isInvalidTag: false,
      errorMessage: '',
      autocompleteItems: []
    }
  },
  methods: {
    handleTagsChanged(tags) {
      this.autocompleteItems = []
      this.updateTags({ tags })
    },
    checkTags({ tag: addingTag, addTag }) {
      const hasDuplicateTag = this.checkHasDuplicateTag(addingTag)
      const hasDisallowedTag = this.checkHasDisallowedTag(addingTag)
      // 追加できないタグがある場合はタグを追加せず、アラートを表示する
      if (hasDuplicateTag || hasDisallowedTag) {
        this.showErrorMessage({ hasDuplicateTag, hasDisallowedTag })
        this.isInvalidTag = true
        return
      }
      addTag()
    },
    checkHasDuplicateTag(addingTag) {
      // タグは大文字小文字を区別しない
      // 例：「AAA」というタグがすでにあるとき、「aaa」というタグは追加できない
      const hasDuplicateTag = this.tags.reduce(
        (acc, crr) => acc || crr.text.toLowerCase() === addingTag.text.toLowerCase(),
        false
      )
      return hasDuplicateTag
    },
    checkHasDisallowedTag(addingTag) {
      const DENIED_SYMBOL_PATTERN = /([!-,./:-@[-`{-~]|--| {2})/
      const ALLOWED_SYMBOLS = ['-', ' ']
      let hasDisallowedTag = ''

      hasDisallowedTag = addingTag.text.match(DENIED_SYMBOL_PATTERN)
      if (hasDisallowedTag) return hasDisallowedTag

      ALLOWED_SYMBOLS.forEach((symbol) => {
        if (addingTag.text[0] === symbol || addingTag.text.slice(-1) === symbol) {
          hasDisallowedTag = true
        }
      })
      return hasDisallowedTag
    },
    showErrorMessage({ hasDuplicateTag, hasDisallowedTag }) {
      let message = ''
      if (hasDuplicateTag) message = 'すでにご入力いただいているタグと重複しています'
      if (hasDisallowedTag) message = 'ご利用いただける記号は-（ハイフン）のみとなります'
      if (message === '') return

      this.errorMessage = message
    },
    focusToTagInputForm() {
      this.$el.querySelector('.new-tag-input').focus()
    },
    repositionAutocompletePopup() {
      const tagsInputFormRect = document.querySelector('.tags-input-form').getBoundingClientRect()
      const newTagInputWrappeRect = document
        .querySelector('.new-tag-input-wrapper')
        .getBoundingClientRect()

      // vue-tags-input の autocomplete が表示されるまで少し待つ必要がある
      setTimeout(() => {
        if (document.querySelector('.autocomplete')) {
          document.querySelector('.autocomplete').style.left = `
          ${newTagInputWrappeRect.x - tagsInputFormRect.x}px
        `
        }
      }, 700)
    },
    initItems() {
      if (this.tag.length === 0) return

      const mockData = [
        { text: 'aaa', count: 1 },
        { text: 'bbb', count: 2 },
        { text: 'cccc', count: 3 },
        { text: 'dddd', count: 4 },
        { text: 'aaaa', count: 10 }
      ]

      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.autocompleteItems = mockData.filter((item) => {
          return item.text.includes(this.tag) && !this.checkHasDuplicateTag(item)
        })
      }, 600)
    },
    ...mapActions('article', ['updateTags'])
  },
  computed: {
    filteredItems() {
      const filteredItems = this.autocompleteItems.filter((item) => {
        return item.text.includes(this.tag) && !this.checkHasDuplicateTag(item)
      })
      setTimeout(() => {
        if (document.querySelectorAll('.autocomplete ul div').length > 0) {
          Array.from(document.querySelectorAll('.autocomplete ul div')).forEach((item, i) => {
            item.dataset.count = `(${filteredItems[i].count})`
          })
        }
      }, 100)
      return filteredItems
    },
    ...mapGetters('article', ['tags'])
  },
  watch: {
    tag() {
      // 入力中のタグを編集したとき、エラーを消しタグの色を黒色にもどす
      this.isInvalidTag = false
      this.errorMessage = ''

      this.repositionAutocompletePopup()

      this.initItems()
    },
    isInvalidTag() {
      this.$emit('change-tag-validation-state', this.isInvalidTag)
    },
    tags(newTags, oldTags) {
      const newTagInputWrapper = this.$el.querySelector('.new-tag-input-wrapper')

      // タグが5つあるとき、タグの入力ができないようにする
      if (newTags.length === 5) {
        newTagInputWrapper.style.display = 'none'
        return
      }

      // タグが5つある状態でタグを消したとき、タグの入力をできるようにする
      if (newTagInputWrapper.style.display === 'none') {
        newTagInputWrapper.style.display = 'flex'
        this.focusToTagInputForm()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-input-form {
  border: 1px dotted #232538;
  min-height: 92px;
  margin-bottom: 4px;
  cursor: text;
}

.error-message {
  color: #f06273;
  display: block;
  font-size: 12px;
  margin-bottom: 22px;
  min-height: 14px;
  text-align: left;
}
</style>

<style lang="scss">
@keyframes fadein {
  0% {
    opacity: 0;
  }
  90% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.tags-input-form {
  .vue-tags-input {
    .input {
      border: none;
    }

    &.invalid-tag .new-tag-input-wrapper input {
      color: #f06273;
    }

    .autocomplete {
      width: auto;
      border: none;
      box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.5);
      border-radius: 4px;
      padding: 4px 8px;
      text-align: left;
      // autocomplete の popup の位置が変わる間、表示を遅らせてちらつかせないようにする
      animation: fadein 100ms linear 0s;

      .item {
        padding: 2px 0;
        color: #6e6e6e;
        font-size: 12px;

        div {
          &:after {
            content: attr(data-count);
          }
        }

        &.selected-item {
          background-color: transparent;
          color: #858dda;
        }
      }
    }
  }

  .tags {
    .new-tag-input-wrapper {
      font-size: 12px;
      margin: 4px;

      input {
        &::-webkit-input-placeholder {
          color: #cecece;
        }

        &::-moz-placeholder {
          color: #cecece;
        }
      }
    }

    .tag {
      border-radius: 4px;
      font-size: 12px;
      margin: 4px;
      padding: 6px 5px 6px 8px;

      .content {
        color: #858dda;
      }

      &.valid {
        background-color: rgba(133, 141, 218, 0.05);
      }

      &.tag.deletion-mark {
        background-color: rgba(133, 141, 218, 0.25);
      }

      .icon-close {
        color: rgb(76, 92, 163);
      }
    }
  }
}
</style>
