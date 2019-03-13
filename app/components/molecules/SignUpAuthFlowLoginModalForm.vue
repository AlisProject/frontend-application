<template>
  <div>
    <div class="modal-body">
      <p class="announce">
        登録を完了させるため、<span class="br" />以下からログインしてください
      </p>
      <form class="signup-form" @keypress.enter.prevent="onSubmit">
        <div class="signup-form-group" :class="{ error: hasUserIdOrEmailError }">
          <label class="signup-form-label">ユーザーID または メールアドレス</label>
          <input
            ref="userIdOrEmail"
            class="signup-form-input"
            type="text"
            placeholder="alis@example.com"
            autofocus
            @input="setUserIdOrEmail"
            @blur="showError('userIdOrEmail')"
            @focus="resetError('userIdOrEmail')"
          >
        </div>
        <div class="signup-form-group" :class="{ error: hasPasswordError }">
          <label class="signup-form-label">パスワード※半角英数字8文字以上</label>
          <input
            ref="password"
            class="signup-form-input"
            type="password"
            placeholder="●●●●●●●●"
            @input="setPassword"
            @blur="showError('password')"
            @focus="resetError('password')"
          >
          <p v-if="showErrorInvalidPassword" class="error-message">
            パスワードは8文字以上で入力してください
          </p>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <p class="error-message">
        {{ errorMessage }}
      </p>
      <p class="agreement-confirmation">
        <nuxt-link to="/terms" target="_blank">
          利用規約
        </nuxt-link>、
        <nuxt-link to="/privacy" target="_blank">
          プライバシーポリシー
        </nuxt-link>に同意して
      </p>
      <app-button class="login-button" :disabled="invalidSubmit" @click="onSubmit">
        ログインする
      </app-button>
      <p class="for-password-forgot-user">
        パスワードを忘れた方は<span class="link" @click="forgotPassword">こちら</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  data() {
    return {
      errorMessage: ''
    }
  },
  computed: {
    showErrorInvalidPassword() {
      return (
        this.signUpAuthFlowModal.login.formError.password &&
        !this.$v.signUpAuthFlowModal.login.formData.password.minLength
      )
    },
    invalidSubmit() {
      return this.$v.signUpAuthFlowModal.login.formData.$invalid
    },
    hasUserIdOrEmailError() {
      return (
        this.signUpAuthFlowModal.login.formError.userIdOrEmail &&
        this.$v.signUpAuthFlowModal.login.formData.userIdOrEmail.$error
      )
    },
    hasPasswordError() {
      return (
        this.signUpAuthFlowModal.login.formError.password &&
        this.$v.signUpAuthFlowModal.login.formData.password.$error
      )
    },
    ...mapGetters('user', ['signUpAuthFlowModal'])
  },
  validations: {
    signUpAuthFlowModal: {
      login: {
        formData: {
          userIdOrEmail: {
            required
          },
          password: {
            required,
            minLength: minLength(8)
          }
        }
      }
    }
  },
  methods: {
    setUserIdOrEmail(e) {
      this.setSignUpAuthFlowLoginUserIdOrEmail({ userIdOrEmail: e.target.value })
    },
    setPassword(e) {
      this.setSignUpAuthFlowLoginPassword({ password: e.target.value })
    },
    showError(type) {
      this.$v.signUpAuthFlowModal.login.formData[type].$touch()
      this.showSignUpAuthFlowLoginError({ type })
    },
    resetError(type) {
      this.$v.signUpAuthFlowModal.login.formData[type].$reset()
      this.hideSignUpAuthFlowLoginError({ type })
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      const { userIdOrEmail, password } = this.signUpAuthFlowModal.login.formData
      try {
        await this.signUpLogin({ userId: userIdOrEmail, password })
        this.setSignUpAuthFlowLoginModal({ isSignUpAuthFlowLoginModal: false })
        this.setSignUpAuthFlowInputPhoneNumberModal({ isSignUpAuthFlowInputPhoneNumberModal: true })
        this.$refs.userIdOrEmail.value = ''
        this.$refs.password.value = ''
        this.resetPassword()
      } catch (error) {
        let errorMessage = ''
        switch (error.code) {
          case 'NotAuthorizedException':
            errorMessage = 'ユーザーID・メールアドレスまたはパスワードが正しくありません'
            break
          default:
            errorMessage = 'エラーが発生しました。入力内容を確認してください'
            break
        }
        this.errorMessage = errorMessage
      }
    },
    ...mapActions('user', [
      'setSignUpAuthFlowLoginModal',
      'setSignUpAuthFlowLoginUserIdOrEmail',
      'setSignUpAuthFlowLoginPassword',
      'showSignUpAuthFlowLoginError',
      'hideSignUpAuthFlowLoginError',
      'setSignUpAuthFlowInputPhoneNumberModal',
      'signUpLogin',
      'resetPassword',
      'forgotPassword'
    ])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;

  .announce {
    @include default-text();
    font-size: 14px;
    margin: 40px 0 0;
    text-align: center;
  }

  .signup-form {
    margin: 40px auto 0;
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
  margin: 20px auto 40px;

  .agreement-confirmation {
    @include default-text();
    color: #6e6e6e;
    text-align: center;
  }

  .error-message {
    bottom: 0;
    color: #f06273;
    font-size: 12px;
    width: 100%;
  }

  .login-button {
    margin: 20px auto 0;
  }

  .for-password-forgot-user {
    @include default-text();
    color: #6e6e6e;
    text-align: right;
  }

  .link {
    @include default-link();
  }
}

@media screen and (max-width: 550px) {
  .br {
    &:before {
      content: '\A';
      white-space: pre;
    }
  }

  .modal-body {
    .signup-form {
      width: 256px;
    }
  }
}
</style>
