<template>
  <div class="tags-input-form">
    <no-ssr>
      <vue-tags-input
        v-model="tag"
        :tags="tags"
        :max-tags="5"
        :maxlength="25"
        placeholder="タグを入力してください"
        @before-adding-tag="checkTags"
        @tags-changed="handleTagsChanged" />
    </no-ssr>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  data() {
    return {
      tag: ''
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
        this.showAlert({ hasDuplicateTag, hasDisallowedTag })
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
      const ALLOWED_TAG_REGEX = /^(?!.*(--| {2}))([a-zA-Z0-9ぁ-んァ-ン一-龥][a-zA-Z0-9ぁ-んァ-ン一-龥- ]*[a-zA-Z0-9ぁ-んァ-ン一-龥]|[a-zA-Z0-9ぁ-んァ-ン一-龥])$/
      const hasDisallowedTag = !addingTag.text.match(ALLOWED_TAG_REGEX)
      return hasDisallowedTag
    },
    showAlert({ hasDuplicateTag, hasDisallowedTag }) {
      // アラートを表示中は再度アラートを表示しない
      if (this.toastMessages.length > 0) return

      let message = ''
      if (hasDuplicateTag) message = 'すでに存在するタグのため、追加できません。'
      if (hasDisallowedTag) message = 'タグを追加できません。'
      if (message === '') return
      this.sendNotification({ text: message, type: 'warning' })
    },
    ...mapActions({ sendNotification: ADD_TOAST_MESSAGE }),
    ...mapActions('article', ['updateTags'])
  },
  computed: {
    ...mapGetters(['toastMessages']),
    ...mapGetters('article', ['tags'])
  },
  watch: {
    tags(newTags, oldTags) {
      // タグが5つあるとき、タグの入力ができないようにする
      if (newTags.length === 5) {
        this.$el.querySelector('.new-tag-input-wrapper').style.display = 'none'
        return
      }

      // タグが5つある状態でタグを消したとき、タグの入力をできるようにする
      if (newTags.length === 4 && oldTags.length === 5) {
        this.$el.querySelector('.new-tag-input-wrapper').style.display = 'flex'
        this.$el.querySelector('.new-tag-input').focus()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-input-form {
  border: 1px dotted #232538;
  min-height: 92px;
  margin-bottom: 40px;
}
</style>

<style lang="scss">
.tags-input-form {
  .vue-tags-input .input {
    border: none;
  }

  .tags {
    .new-tag-input-wrapper {
      font-size: 12px;
      margin: 4px;

      input {
        &::-webkit-input-placeholder {
          color: #cecece;
        }

        ::-moz-placeholder {
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
