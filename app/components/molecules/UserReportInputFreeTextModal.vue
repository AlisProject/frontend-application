<template>
  <div>
    <div class="modal-body">
      <form class="signup-form" @submit.prevent>
        <div
          v-if="isCopyrightViolation"
          class="signup-form-group"
          :class="{ 'error': hasOriginURLError }">
          <label class="signup-form-label">著作権元と思われる記事のURL</label>
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
      return this.userReportModal.selectReason.formData.reason === 'copyright_violation'
    },
    showErrorUrl() {
      return (
        this.userReportModal.inputFreeText.formError.originURL &&
        !this.$v.userReportModal.inputFreeText.formData.originURL.url
      )
    },
    invalidSubmit() {
      if (!this.isCopyrightViolation) return false
      return this.$v.userReportModal.inputFreeText.formData.$invalid
    },
    hasOriginURLError() {
      return (
        this.userReportModal.inputFreeText.formError.originURL &&
        this.$v.userReportModal.inputFreeText.formData.originURL.$error
      )
    },
    ...mapGetters('report', ['userReportModal'])
  },
  validations: {
    userReportModal: {
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
      this.setUserReportInputFreeTextOriginURL({ originURL })
    },
    setFreeText(freeText) {
      this.setUserReportInputFreeTextFreeText({ freeText })
    },
    showError(type) {
      this.$v.userReportModal.inputFreeText.formData[type].$touch()
      this.showUserReportInputFreeTextError({ type })
    },
    resetError(type) {
      this.$v.userReportModal.inputFreeText.formData[type].$reset()
      this.hideUserReportInputFreeTextError({ type })
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      this.setUserReportInputFreeTextModal({ isShow: false })
      this.setUserReportConfirmationModal({ isShow: true })
    },
    ...mapActions('report', [
      'setUserReportInputFreeTextOriginURL',
      'setUserReportInputFreeTextFreeText',
      'showUserReportInputFreeTextError',
      'hideUserReportInputFreeTextError',
      'setUserReportInputFreeTextModal',
      'setUserReportConfirmationModal'
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
    width: 100%;

    &-group {
      position: relative;
    }

    &-label {
      color: #030303;
      font-size: 14px;
      line-height: 3;
    }

    &-input,
    &-textarea {
      appearance: none;
      border-radius: 0;
      border: none;
      box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.5);
      box-sizing: border-box;
      margin-bottom: 30px;
      padding: 12px;
      resize: none;
      width: 100%;

      &::-webkit-input-placeholder {
        color: #cecece;
        font-size: 14px;
        letter-spacing: 0.05em;
        line-height: 1.5;
      }

      &:focus {
        outline: 0;
      }
    }

    &-textarea {
      appearance: none;
      height: 8em;
    }

    .error-message {
      color: #f06273;
      font-size: 12px;
      position: absolute;
      right: 0;
      top: 80px;
    }

    .error {
      .signup-form {
        &-input,
        &-textarea {
          box-shadow: 0 0 16px 0 rgba(240, 98, 115, 0.5);
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
