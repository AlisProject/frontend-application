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
          :autocomplete-items="autocompleteItems"
          :autocomplete-always-open="true"
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

      const autocompleteWrapper = document.querySelector('.autocomplete')
      if (!autocompleteWrapper) return
      autocompleteWrapper.style.left = `${newTagInputWrappeRect.x - tagsInputFormRect.x}px`
    },
    async updateAutocompleteItems() {
      if (this.tag === '') return

      const items = await this.$axios.$get('/search/tags', {
        params: { query: this.tag, limit: 5, page: 1 }
      })
      const formattedItems = items.map((tag) => {
        return { ...tag, text: tag.name }
      })
      const autocompleteItems = formattedItems.filter((tag) => {
        return !this.checkHasDuplicateTag(tag)
      })

      this.autocompleteItems = autocompleteItems
    },
    addTagCounts(items) {
      const showingAutocompleteItems = document.querySelectorAll('.autocomplete ul div')
      if (showingAutocompleteItems.length < 0) return
      Array.from(showingAutocompleteItems).forEach((item, i) => {
        item.dataset.count = `(${items[i].count})`
      })
    },
    ...mapActions('article', ['updateTags'])
  },
  computed: {
    ...mapGetters('article', ['tags'])
  },
  watch: {
    tag() {
      // 入力中のタグを編集したとき、エラーを消しタグの色を黒色にもどす
      this.isInvalidTag = false
      this.errorMessage = ''

      // 入力中のタグをすべて消し、再度入力するときに消す前のサジェスト結果を表示しないために
      // サジェスト結果をリセットする
      if (this.tag === '') {
        this.autocompleteItems = []
      }

      clearTimeout(this.debounce)
      this.debounce = setTimeout(async () => {
        await this.updateAutocompleteItems()
        // vue-tags-input の autocomplete 要素が表示されるまで少し待つ必要がある
        await this.$nextTick()
        this.addTagCounts(this.autocompleteItems)
        this.repositionAutocompletePopup()
      }, 600)
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

      .item {
        padding: 2px 0;
        color: #6e6e6e;
        font-size: 12px;

        div {
          white-space: nowrap;

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
