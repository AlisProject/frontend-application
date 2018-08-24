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
      errorMessage: ''
    }
  },
  methods: {
    handleTagsChanged(tags) {
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
