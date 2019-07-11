<template>
  <div>
    <div class="modal-body">
      <p class="announce">
        認証コードを入力してください
      </p>
      <p class="description">
        SMSに記載の6桁の認証コードを入力してください
      </p>
      <form class="signup-form" @keypress.enter.prevent="onSubmit">
        <div class="signup-form-group" :class="{ error: hasPhoneNumberError }">
          <label class="signup-form-label">認証コード</label>
          <input
            class="signup-form-input"
            type="text"
            placeholder="123456"
            maxlength="6"
            autofocus
            @input="setAuthCode"
            @blur="showError('authCode')"
            @focus="resetError('authCode')"
          >
          <p v-if="showErrorAuthCodeNumeric" class="error-message">
            認証コードは数字で入力してください
          </p>
          <p v-else-if="showErrorInvalidAuthCode" class="error-message">
            認証コードは6文字で入力してください
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
        認証コードを送信する
      </app-button>
      <p class="back-to-input-phone-number">
        電話番号の入力に戻る場合は<span class="link" @click="backToInputPhoneNumber">こちら</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { required, minLength, maxLength, numeric } from 'vuelidate/lib/validators'
import AppButton from '../atoms/AppButton'

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
    showErrorInvalidAuthCode() {
      return (
        this.requestPhoneNumberVerifyModal.inputAuthCode.formError.authCode &&
        (!this.$v.requestPhoneNumberVerifyModal.inputAuthCode.formData.authCode.minLength ||
          !this.$v.requestPhoneNumberVerifyModal.inputAuthCode.formData.authCode.maxLength)
      )
    },
    showErrorAuthCodeNumeric() {
      return (
        this.requestPhoneNumberVerifyModal.inputAuthCode.formError.authCode &&
        !this.$v.requestPhoneNumberVerifyModal.inputAuthCode.formData.authCode.numeric
      )
    },
    invalidSubmit() {
      return this.$v.requestPhoneNumberVerifyModal.inputAuthCode.formData.$invalid
    },
    hasUserIdOrEmailError() {
      return (
        this.requestPhoneNumberVerifyModal.inputAuthCode.formError.userIdOrEmail &&
        this.$v.requestPhoneNumberVerifyModal.inputAuthCode.formData.userIdOrEmail.$error
      )
    },
    hasPhoneNumberError() {
      return (
        this.requestPhoneNumberVerifyModal.inputAuthCode.formError.authCode &&
        this.$v.requestPhoneNumberVerifyModal.inputAuthCode.formData.authCode.$error
      )
    },
    ...mapGetters('user', ['requestPhoneNumberVerifyModal'])
  },
  validations: {
    requestPhoneNumberVerifyModal: {
      inputAuthCode: {
        formData: {
          authCode: {
            required,
            minLength: minLength(6),
            maxLength: maxLength(6),
            numeric
          }
        }
      }
    }
  },
  methods: {
    setAuthCode(e) {
      this.setRequestPhoneNumberVerifyInputAuthCodeAuthCode({ authCode: e.target.value })
    },
    showError(type) {
      this.$v.requestPhoneNumberVerifyModal.inputAuthCode.formData[type].$touch()
      this.showRequestPhoneNumberVerifyInputAuthCodeError({ type })
    },
    resetError(type) {
      this.$v.requestPhoneNumberVerifyModal.inputAuthCode.formData[type].$reset()
      this.hideRequestPhoneNumberVerifyInputAuthCodeError({ type })
    },
    async onSubmit() {
      if (this.isProcessing || this.invalidSubmit) return
      this.isProcessing = true
      const { authCode: code } = this.requestPhoneNumberVerifyModal.inputAuthCode.formData
      try {
        await this.verifySMSCode({ code })
        await this.refreshUserSession()
        this.setRequestPhoneNumberVerifyModal({ isShow: false })
        this.setRequestPhoneNumberVerifyInputAuthCodeModal({ isShow: false })
        await this.setCurrentUserInfo()
        this.sendNotification({ text: '電話番号の登録が完了しました' })
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
    backToInputPhoneNumber() {
      this.setRequestPhoneNumberVerifyInputAuthCodeModal({ isShow: false })
      this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', [
      'setRequestPhoneNumberVerifyInputAuthCodeModal',
      'setRequestPhoneNumberVerifyInputAuthCodeAuthCode',
      'showRequestPhoneNumberVerifyInputAuthCodeError',
      'hideRequestPhoneNumberVerifyInputAuthCodeError',
      'setRequestPhoneNumberVerifyModal',
      'verifySMSCode',
      'refreshUserSession',
      'setCurrentUserInfo'
    ])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;

  .announce {
    @include default-text();
    color: #030303;
    font-weight: bold;
    font-size: 14px;
    margin: 60px auto 0;
    text-align: center;
  }

  .description {
    @include default-text();
    color: #6e6e6e;
    font-size: 12px;
    letter-spacing: 0.8px;
    margin: 20px auto 0;
    max-width: 400px;
    text-align: center;
  }

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

  .back-to-input-phone-number {
    @include default-text();
    color: #6e6e6e;
    text-align: right;

    .link {
      @include default-link();
    }
  }

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

    .description {
      text-align: left;
    }

    .signup-form {
      width: 256px;
    }
  }
}
@media screen and (max-width: 320px) {
  .modal-body {
    .signup-form {
      margin-top: 30px;

      &-input {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
