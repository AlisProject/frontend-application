<template>
  <div class="tags-input-form" @click="focusToTagInputForm">
    <no-ssr>
      <vue-tags-input
        v-model="url"
        :tags="urls"
        :max-tags="5"
        placeholder=""
        :class="{ 'ti-invalid-tag': isInvalidUrl }"
        :separators="['　']"
        @before-adding-tag="checkUrls"
        @tags-changed="handleUrlsChanged"
      />
    </no-ssr>
    <span class="error-message">
      {{ errorMessage }}
    </span>
  </div>
</template>

<script>
import urlRegex from 'url-regex'

export default {
  props: {
    initialUrls: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      isInvalidUrl: false,
      errorMessage: '',
      url: '',
      urls: this.initialUrls.map((url) => {
        return {
          text: url,
          tiClasses: ['ti-valid']
        }
      })
    }
  },
  methods: {
    checkUrls({ tag: addingUrl, addTag }) {
      const isInvalidUrl = this.checkIsInvalidUrl(addingUrl)
      // 追加できないURLがある場合はURLを追加せず、アラートを表示する
      if (isInvalidUrl) {
        this.errorMessage = 'URLの形式が正しくありません'
        this.isInvalidUrl = true
        return
      }
      addTag()
    },
    checkIsInvalidUrl({ text: url }) {
      if (url === '') return false
      const isInvalidUrl = !urlRegex({ exact: true }).test(url)
      return isInvalidUrl
    },
    focusToTagInputForm() {
      document.querySelector('.ti-new-tag-input').focus()
    },
    handleUrlsChanged(urls) {
      this.urls = urls
    }
  },
  watch: {
    url() {
      this.isInvalidUrl = false
      this.errorMessage = ''

      const addingUrl = { text: this.url }
      const isInvalidUrl = this.checkIsInvalidUrl(addingUrl)

      if (isInvalidUrl) {
        this.errorMessage = 'URLの形式が正しくありません'
        this.isInvalidUrl = true
      }
    },
    isInvalidUrl() {
      this.$emit('change-url-validation-state', this.isInvalidUrl)
    },
    urls(newUrls, oldUrls) {
      // URL がゼロの状態でバックスペースを押したときも watch が発火するため、
      // URL の個数を判定し同じ場合は emit しない
      if (newUrls.length === oldUrls.length) return
      this.$emit('handle-change-urls', this.urls)
    },
    initialUrls(urls) {
      this.urls = urls
    }
  }
}
</script>

<style lang="scss" scoped>
.error-message {
  bottom: 20px;
  margin: 0;
  color: #f06273;
  font-size: 12px;
  position: absolute;
  width: 100%;
  text-align: right;
  bottom: -20px;
}
</style>

<style lang="scss">
/* vue-tags-input は scoped で CSS を定義できず、他の vue-tags-input を呼び出しているコンポーネントと
スタイルが競合するため、親コンポーネントをラップしている class でネストしている。 */
.create-application-container,
.edit-application-container {
  .tags-input-form {
    cursor: text;
    position: relative;

    .vue-tags-input {
      box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);

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
        display: none;
      }

      &.ti-invalid-tag {
        box-shadow: 0 0 8px 0 rgba(240, 98, 115, 0.5);
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
          color: #030303;
        }

        &.ti-valid {
          background-color: #f0f0f0;
        }

        &.ti-tag.ti-deletion-mark {
          background-color: #e0e0e0;
        }

        .ti-icon-close {
          color: #030303;
        }
      }
    }
  }
}
</style>
