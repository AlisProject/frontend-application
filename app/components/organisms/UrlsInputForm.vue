<template>
  <div class="tags-input-form" @click="focusToTagInputForm">
    <no-ssr>
      <vue-tags-input
        v-model="url"
        :tags="urls"
        :max-tags="5"
        placeholder=""
        :separators="['　']"
        @tags-changed="handleUrlsChanged"
      />
    </no-ssr>
  </div>
</template>

<script>
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
    focusToTagInputForm() {
      document.querySelector('.ti-new-tag-input').focus()
    },
    handleUrlsChanged(urls) {
      this.urls = urls
    }
  },
  watch: {
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
