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
          :class="{
            'ti-invalid-tag': isInvalidTag,
            'hide-autocomplete-items': !hasAutocompleteItems
          }"
          :autocomplete-items="autocompleteItems"
          :autocomplete-always-open="true"
          :separators="['　']"
          @before-adding-tag="checkTags"
          @tags-changed="handleTagsChanged"
        />
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
      document.querySelector('.ti-new-tag-input').focus()
    },
    repositionAutocompletePopup() {
      const tagsInputFormRect = document.querySelector('.tags-input-form').getBoundingClientRect()
      const newTagInputWrappeRect = document
        .querySelector('.ti-new-tag-input-wrapper')
        .getBoundingClientRect()

      document.querySelector('.ti-autocomplete').style.left = `
        ${newTagInputWrappeRect.x - tagsInputFormRect.x}px
      `
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
      Array.from(document.querySelectorAll('.ti-autocomplete ul div')).forEach((item, i) => {
        item.dataset.count = `(${items[i].count})`
      })
    },
    ...mapActions('article', ['updateTags'])
  },
  computed: {
    hasAutocompleteItems() {
      return this.autocompleteItems.length > 0
    },
    ...mapGetters('article', ['tags'])
  },
  watch: {
    tag() {
      // 入力中のタグを編集したとき、エラーを消しタグの色を黒色にもどす
      this.isInvalidTag = false
      this.errorMessage = ''

      const addingTag = { text: this.tag }
      const hasDuplicateTag = this.checkHasDuplicateTag(addingTag)
      const hasDisallowedTag = this.checkHasDisallowedTag(addingTag)

      // 追加できないタグを入力中はアラートを表示する
      if (hasDuplicateTag || hasDisallowedTag) {
        this.showErrorMessage({ hasDuplicateTag, hasDisallowedTag })
        this.isInvalidTag = true
        this.autocompleteItems = []
        return
      }

      // 入力中のタグをすべて消したときに、サジェスト結果をリセットするために必要
      if (this.tag === '') this.autocompleteItems = []

      clearTimeout(this.debounce)
      this.debounce = setTimeout(async () => {
        await this.updateAutocompleteItems()
        this.addTagCounts(this.autocompleteItems)
        this.repositionAutocompletePopup()
      }, 600)
    },
    isInvalidTag() {
      this.$emit('change-tag-validation-state', this.isInvalidTag)
    },
    tags(newTags, oldTags) {
      const newTagInputWrapper = document.querySelector('.ti-new-tag-input-wrapper')

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
  box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);
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
    .ti-input {
      border: none;
    }

    &.invalid-tag .ti-new-tag-input-wrapper input {
      color: #f06273;
    }

    &.hide-autocomplete-items .ti-autocomplete {
      display: none;
    }

    .ti-autocomplete {
      width: auto;
      border: none;
      box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.5);
      border-radius: 4px;
      padding: 4px 8px;
      text-align: left;

      .ti-item {
        padding: 2px 0;
        color: #6e6e6e;
        font-size: 12px;

        div {
          white-space: nowrap;

          &:after {
            content: attr(data-count);
          }
        }

        &.ti-selected-item {
          background-color: transparent;
          color: #0086cc;
        }
      }
    }
  }

  .ti-tags {
    .ti-new-tag-input-wrapper {
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

    .ti-tag {
      border-radius: 4px;
      font-size: 12px;
      margin: 4px;
      padding: 6px 5px 6px 8px;
      word-break: break-word;

      .ti-content {
        color: #0086cc;
      }

      &.ti-valid {
        background-color: rgba(0, 134, 204, 0.05);
      }

      &.ti-tag.ti-deletion-mark {
        background-color: rgba(0, 134, 204, 0.2);
      }

      .ti-icon-close {
        color: #0086cc;
      }
    }
  }
}
</style>
