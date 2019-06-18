<template>
  <div>
    <div class="modal-body">
      <p class="announce">
        {{ confirmTextPrefix }}<span class="br" />SMSによるアカウント認証が必要です
      </p>
      <p class="description">
        ご入力いただいた電話番号にSMSで認証コードを送らせていただきます※記事作成並びに評価による、ALIS獲得のためにはアカウントの認証を必須とさせていただいております
      </p>
      <form class="signup-form" @keypress.enter.prevent="onSubmit">
        <div class="signup-form-group" :class="{ error: hasPhoneNumberError }">
          <label class="signup-form-label">電話番号</label>
          <input
            ref="phoneNumber"
            class="signup-form-input"
            type="tel"
            placeholder="08012345678"
            maxlength="11"
            autofocus
            @input="setPhoneNumber"
            @blur="showError('phoneNumber')"
            @focus="resetError('phoneNumber')"
          >
          <p v-if="showErrorPhoneNumberNumeric" class="error-message">
            電話番号は数字で入力してください
          </p>
          <p v-else-if="showErrorInvalidPhoneNember" class="error-message">
            電話番号は11文字で入力してください
          </p>
          <p v-else-if="showErrorPhoneNumberJapanesePhoneNumber" class="error-message">
            現在日本国内の電話番号のみ利用可能です
          </p>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <p class="error-message">
        {{ errorMessage }}
      </p>
      <app-button
        class="to-next-step-button"
        :disabled="isProcessing || invalidSubmit"
        @click="onSubmit"
      >
        次へ
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, minLength, maxLength, numeric } from 'vuelidate/lib/validators'
import AppButton from '../atoms/AppButton'

function japanesePhoneNumber(value) {
  return Boolean(value.match(/^0[789]0/))
}

export default {
  components: {
    AppButton
  },
  data() {
    return {
      errorMessage: '',
      isProcessing: false
    }
  },
  computed: {
    confirmTextPrefix() {
      switch (this.requestPhoneNumberVerifyModal.requestType) {
        case 'articleCreate':
          return '記事の作成を行うには'
        case 'articleLike':
          return '記事へいいねを行うには'
        case 'articleComment':
          return '記事へコメントを行うには'
        case 'articleCommentLike':
          return 'コメントへいいねを行うには'
        case 'articleTip':
          return 'ALISを贈るには'
        case 'articleReport':
          return '記事を報告するには'
        case 'purchaseArticle':
          return '記事を購入するためには'
        case 'depositToken':
          return '入金するためには'
        case 'withdrawToken':
          return '出金するためには'
        case 'provideInfo':
          return '認証を行うためには'
        default:
          return ''
      }
    },
    showErrorInvalidPhoneNember() {
      return (
        this.requestPhoneNumberVerifyModal.inputPhoneNumber.formError.phoneNumber &&
        (!this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.phoneNumber.minLength ||
          !this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.phoneNumber.maxLength)
      )
    },
    showErrorPhoneNumberNumeric() {
      return (
        this.requestPhoneNumberVerifyModal.inputPhoneNumber.formError.phoneNumber &&
        !this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.phoneNumber.numeric
      )
    },
    showErrorPhoneNumberJapanesePhoneNumber() {
      return (
        this.requestPhoneNumberVerifyModal.inputPhoneNumber.formError.phoneNumber &&
        !this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.phoneNumber
          .japanesePhoneNumber
      )
    },
    invalidSubmit() {
      return this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.$invalid
    },
    hasUserIdOrEmailError() {
      return (
        this.requestPhoneNumberVerifyModal.inputPhoneNumber.formError.userIdOrEmail &&
        this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.userIdOrEmail.$error
      )
    },
    hasPhoneNumberError() {
      return (
        this.requestPhoneNumberVerifyModal.inputPhoneNumber.formError.phoneNumber &&
        this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData.phoneNumber.$error
      )
    },
    ...mapGetters('user', ['requestPhoneNumberVerifyModal', 'requestPhoneNumberVerifyModal'])
  },
  validations: {
    requestPhoneNumberVerifyModal: {
      inputPhoneNumber: {
        formData: {
          phoneNumber: {
            required,
            minLength: minLength(11),
            maxLength: maxLength(11),
            numeric,
            japanesePhoneNumber
          }
        }
      }
    }
  },
  methods: {
    setPhoneNumber(e) {
      this.setRequestPhoneNumberVerifyInputPhoneNumberPhoneNumber({ phoneNumber: e.target.value })
    },
    showError(type) {
      this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData[type].$touch()
      this.showRequestPhoneNumberVerifyInputPhoneNumberError({ type })
    },
    resetError(type) {
      this.$v.requestPhoneNumberVerifyModal.inputPhoneNumber.formData[type].$reset()
      this.hideRequestPhoneNumberVerifyInputPhoneNumberError({ type })
    },
    async onSubmit() {
      try {
        if (this.isProcessing || this.invalidSubmit) return
        this.isProcessing = true
        const { phoneNumber } = this.requestPhoneNumberVerifyModal.inputPhoneNumber.formData

        await this.updatePhoneNumber({ phoneNumber: `+81${phoneNumber.slice(1)}` })
        await this.sendConfirm()

        this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: false })
        this.setRequestPhoneNumberVerifyInputAuthCodeModal({ isShow: true })
        this.$refs.phoneNumber.value = ''
      } catch (error) {
        let errorMessage = ''
        switch (error.code) {
          default:
            errorMessage = 'エラーが発生しました。入力内容を確認してください'
            break
        }
        this.errorMessage = errorMessage
      } finally {
        this.isProcessing = false
      }
    },
    ...mapActions('user', [
      'setRequestPhoneNumberVerifyInputPhoneNumberModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberPhoneNumber',
      'showRequestPhoneNumberVerifyInputPhoneNumberError',
      'hideRequestPhoneNumberVerifyInputPhoneNumberError',
      'setRequestPhoneNumberVerifyInputAuthCodeModal',
      'updatePhoneNumber',
      'sendConfirm'
    ])
  }
}
</script>

<style lang="scss" scoped>
.br {
  &:before {
    content: '\A';
    white-space: pre;
  }
}

.modal-body {
  margin: 0 auto;

  .announce {
    @include default-text();
    color: #030303;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.8px;
    line-height: 1.5;
    margin: 60px auto 0;
    text-align: center;
  }

  .description {
    @include default-text();
    color: #6e6e6e;
    letter-spacing: 0.8px;
    margin: 20px auto 0;
    max-width: 400px;
  }

  .signup-form {
    margin: 60px auto 0;
    max-width: 400px;
    width: 100%;

    &-group {
      position: relative;
    }

    &-label {
      color: #030303;
      font-size: 14px;
      line-height: 2.4;
    }

    &-input {
      appearance: none;
      box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.5);
      border: none;
      border-radius: 0;
      box-sizing: border-box;
      margin-bottom: 40px;
      padding: 12px;
      width: 100%;

      &::-webkit-input-placeholder {
        color: #cecece;
        font-size: 14px;
        letter-spacing: 0.05em;
      }

      &:focus {
        outline: 0;
      }
    }

    .error-message {
      bottom: 20px;
      margin: 0;
      color: #f06273;
      font-size: 12px;
      position: absolute;
      width: 100%;
      text-align: right;
    }

    .error {
      .signup-form {
        &-input {
          box-shadow: 0 0 16px 0 rgba(240, 98, 115, 0.5);
        }
      }
    }
  }
}

.modal-footer {
  width: 270px;
  margin: 30px auto 40px;

  .error-message {
    color: #f06273;
    font-size: 12px;
    width: 100%;
  }
}

@media screen and (max-width: 550px) {
  .modal-body {
    .announce,
    .description {
      width: 256px;
    }

    .announce {
      letter-spacing: 0;
      margin: 40px auto 0;
    }

    .signup-form {
      width: 256px;
    }
  }
}

@media screen and (max-width: 320px) {
  .modal-footer {
    width: 250px;
  }
}
</style>
