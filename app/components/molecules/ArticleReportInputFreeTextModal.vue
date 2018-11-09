<template>
  <div>
    <div class="modal-body">
      <form class="signup-form" @submit.prevent>
        <div
          v-if="isCopyrightViolation"
          class="signup-form-group"
          :class="{ 'error': hasOriginURLError }">
          <label class="signup-form-label">元記事のURL</label>
          <input
            class="signup-form-input"
            type="text"
            placeholder="https://example.com"
            @input="setOriginURL($event.target.value)"
            @blur="showError('originURL')"
            @focus="resetError('originURL')">
          <p class="error-message" v-if="showErrorUrl">URLを正しい形式で入力してください</p>
        </div>
        <div class="signup-form-group">
          <label class="signup-form-label">報告の詳細※任意</label>
          <textarea
            class="signup-form-textarea"
            type="text"
            placeholder="具体的な報告の内容や報告の箇所をご記入ください"
            maxlength="400"
            @input="setFreeText($event.target.value)"/>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <app-button class="to-next-step-button" :disabled="invalidSubmit" @click="onSubmit">
        次へ
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import AppButton from '../atoms/AppButton'
import urlRegex from 'url-regex'

function url(value) {
  return urlRegex({ exact: true }).test(value)
}

export default {
  components: {
    AppButton
  },
  computed: {
    isCopyrightViolation() {
      return this.articleReportModal.selectReason.formData.reason === 'copyright_violation'
    },
    showErrorUrl() {
      return (
        this.articleReportModal.inputFreeText.formError.originURL &&
        !this.$v.articleReportModal.inputFreeText.formData.originURL.url
      )
    },
    invalidSubmit() {
      if (!this.isCopyrightViolation) return false
      return this.$v.articleReportModal.inputFreeText.formData.$invalid
    },
    hasOriginURLError() {
      return (
        this.articleReportModal.inputFreeText.formError.originURL &&
        this.$v.articleReportModal.inputFreeText.formData.originURL.$error
      )
    },
    ...mapGetters('report', ['articleReportModal'])
  },
  validations: {
    articleReportModal: {
      inputFreeText: {
        formData: {
          originURL: {
            required,
            url
          }
        }
      }
    }
  },
  methods: {
    setOriginURL(originURL) {
      this.setArticleReportInputFreeTextOriginURL({ originURL })
    },
    setFreeText(freeText) {
      this.setArticleReportInputFreeTextFreeText({ freeText })
    },
    showError(type) {
      this.$v.articleReportModal.inputFreeText.formData[type].$touch()
      this.showArticleReportInputFreeTextError({ type })
    },
    resetError(type) {
      this.$v.articleReportModal.inputFreeText.formData[type].$reset()
      this.hideArticleReportInputFreeTextError({ type })
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      this.setArticleReportInputFreeTextModal({ isShow: false })
      this.setArticleReportConfirmationModal({ isShow: true })
    },
    ...mapActions('report', [
      'setArticleReportInputFreeTextOriginURL',
      'setArticleReportInputFreeTextFreeText',
      'showArticleReportInputFreeTextError',
      'hideArticleReportInputFreeTextError',
      'setArticleReportInputFreeTextModal',
      'setArticleReportConfirmationModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;

  .signup-form {
    margin: 30px auto 0;
    max-width: 400px;
    width: 80%;

    &-group {
      position: relative;
    }

    &-label {
      color: #030303;
      font-size: 14px;
      line-height: 20px;
    }

    &-input,
    &-textarea {
      border: none;
      border-radius: 0;
      border-bottom: 1px dotted #232538;
      margin-bottom: 30px;
      padding: 5px 0;
      width: 100%;
      resize: none;

      &::-webkit-input-placeholder {
        color: #cecece;
        font-size: 14px;
        letter-spacing: 0.05em;
      }

      &:focus {
        outline: 0;
      }
    }

    &-textarea {
      appearance: none;
      border: 1px dotted #232538;
      height: 8em;
      padding: 5px;
    }

    .error-message {
      top: 40px;
      color: #f06273;
      font-size: 12px;
      position: absolute;
      width: 100%;
    }

    .error {
      .signup-form {
        &-label {
          color: #f06273;
        }

        &-input {
          border-bottom: 1px dotted #f06273;
        }
      }
    }
  }
}

.modal-footer {
  width: 270px;
  margin: 20px auto 40px;

  .to-next-step-button {
    margin: 20px auto 0;
  }

  .error-message {
    color: #f06273;
    font-size: 12px;
    width: 100%;
  }
}

@media screen and (max-width: 320px) {
  .modal-footer {
    width: 250px;
    margin: 40px auto;
  }
}
</style>
