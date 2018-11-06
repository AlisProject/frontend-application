<template>
  <div>
    <div class="modal-body">
      <form class="signup-form" @submit.prevent>
        <div
          v-if="isCopyrightViolation"
          class="signup-form-group"
          :class="{ 'error': hasOriginalURLError }">
          <label class="signup-form-label">元記事のURL</label>
          <input
            class="signup-form-input"
            type="text"
            placeholder="半角英数3文字以上"
            @input="setOriginalURL($event.target.value)"
            @blur="showError('originalURL')"
            @focus="resetError('originalURL')">
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

export default {
  components: {
    AppButton
  },
  computed: {
    isCopyrightViolation() {
      return this.userReportModal.selectReason.formData.reason === 'copyright_violation'
    },
    invalidSubmit() {
      if (!this.isCopyrightViolation) return false
      return this.$v.userReportModal.inputFreeText.formData.$invalid
    },
    hasOriginalURLError() {
      return (
        this.userReportModal.inputFreeText.formError.originalURL &&
        this.$v.userReportModal.inputFreeText.formData.originalURL.$error
      )
    },
    ...mapGetters('user', ['userReportModal'])
  },
  validations: {
    userReportModal: {
      inputFreeText: {
        formData: {
          originalURL: {
            required
          }
        }
      }
    }
  },
  methods: {
    setOriginalURL(originalURL) {
      this.setUserReportInputFreeTextOriginalURL({ originalURL })
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
    ...mapActions('user', [
      'setUserReportInputFreeTextOriginalURL',
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
    width: 80%;

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
      overflow: hidden;

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
      border: 1px dotted #232538;
      height: 8em;
      padding: 5px;
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
