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
        this.signUpAuthFlowModal.inputAuthCode.formError.authCode &&
        (!this.$v.signUpAuthFlowModal.inputAuthCode.formData.authCode.minLength ||
          !this.$v.signUpAuthFlowModal.inputAuthCode.formData.authCode.maxLength)
      )
    },
    showErrorAuthCodeNumeric() {
      return (
        this.signUpAuthFlowModal.inputAuthCode.formError.authCode &&
        !this.$v.signUpAuthFlowModal.inputAuthCode.formData.authCode.numeric
      )
    },
    invalidSubmit() {
      return this.$v.signUpAuthFlowModal.inputAuthCode.formData.$invalid
    },
    hasUserIdOrEmailError() {
      return (
        this.signUpAuthFlowModal.inputAuthCode.formError.userIdOrEmail &&
        this.$v.signUpAuthFlowModal.inputAuthCode.formData.userIdOrEmail.$error
      )
    },
    hasPhoneNumberError() {
      return (
        this.signUpAuthFlowModal.inputAuthCode.formError.authCode &&
        this.$v.signUpAuthFlowModal.inputAuthCode.formData.authCode.$error
      )
    },
    ...mapGetters('user', ['signUpAuthFlowModal'])
  },
  validations: {
    signUpAuthFlowModal: {
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
      this.setSignUpAuthFlowInputAuthCodeAuthCode({ authCode: e.target.value })
    },
    showError(type) {
      this.$v.signUpAuthFlowModal.inputAuthCode.formData[type].$touch()
      this.showSignUpAuthFlowInputAuthCodeError({ type })
    },
    resetError(type) {
      this.$v.signUpAuthFlowModal.inputAuthCode.formData[type].$reset()
      this.hideSignUpAuthFlowInputAuthCodeError({ type })
    },
    async onSubmit() {
      try {
        if (this.isProcessing || this.invalidSubmit) return
        this.isProcessing = true

        const { authCode: code } = this.signUpAuthFlowModal.inputAuthCode.formData
        await this.verifySMSCode({ code })
        await this.refreshUserSession()
        this.setSignUpAuthFlowInputAuthCodeModal({
          isSignUpAuthFlowInputAuthCodeModal: false
        })
        this.setSignUpAuthFlowProfileSettingsModal({
          isSignUpAuthFlowProfileSettingsModal: true
        })
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
      this.setSignUpAuthFlowInputPhoneNumberModal({
        isSignUpAuthFlowInputPhoneNumberModal: true
      })
      this.setSignUpAuthFlowInputAuthCodeModal({
        isSignUpAuthFlowInputAuthCodeModal: false
      })
    },
    ...mapActions('user', [
      'setSignUpAuthFlowInputPhoneNumberModal',
      'setSignUpAuthFlowInputAuthCodeAuthCode',
      'showSignUpAuthFlowInputAuthCodeError',
      'hideSignUpAuthFlowInputAuthCodeError',
      'setSignUpAuthFlowInputAuthCodeModal',
      'setSignUpAuthFlowProfileSettingsModal',
      'verifySMSCode',
      'refreshUserSession'
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

    &-label {
      color: #030303;
      font-size: 14px;
      line-height: 2.4;
    }

    &-group {
      position: relative;
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

  .to-next-step-button {
    margin: 20px auto 0;
  }

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

    .description {
      text-align: left;
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
